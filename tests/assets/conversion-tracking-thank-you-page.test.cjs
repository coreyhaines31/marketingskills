const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// thank-you-page.js must count one conversion once: a refresh or a
// back/forward return to the confirmation page is the same arrival seen
// again, a new navigation to it is a new conversion. These tests model one
// browser tab. Each load() evaluates the shipped file in a fresh context, the
// way a page load does, with the navigation type the browser would report.
const snippetPath = path.resolve(__dirname, '../../skills/conversion-tracking/assets/snippets/thank-you-page.js');
const shipped = fs.readFileSync(snippetPath, 'utf8');

function openTab() {
  return {
    load(pathname, navigationType, code = shipped) {
      const timers = [], listeners = {};
      const location = { pathname, search: '', href: 'https://example.com' + pathname };
      const window = {
        location, dataLayer: [],
        history: {
          pushState(s, t, url) { location.pathname = url; },
          replaceState(s, t, url) { location.pathname = url; },
        },
        performance: { getEntriesByType: (t) => (t === 'navigation' ? [{ type: navigationType }] : []) },
        addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
      };
      const document = { readyState: 'complete', addEventListener() {} };
      vm.runInContext(code, vm.createContext({ window, document,
        setTimeout(fn) { timers.push(fn); return timers.length; }, clearTimeout() {} }), { filename: snippetPath });
      const flush = () => { for (const fn of timers.splice(0)) fn(); };
      flush();
      return {
        count: () => window.dataLayer.filter((e) => e.event === 'thank_you_page_view').length,
        pushState(url) { window.history.pushState({}, '', url); flush(); },
        popstateTo(url) { location.pathname = url; for (const fn of listeners.popstate || []) fn({}); flush(); },
      };
    },
  };
}

test('arriving on a confirmation path fires once', () => {
  assert.equal(openTab().load('/thank-you', 'navigate').count(), 1);
});
test('a refresh of the confirmation page does not fire again', () => {
  const tab = openTab();
  tab.load('/thank-you', 'navigate');
  assert.equal(tab.load('/thank-you', 'reload').count(), 0);
});
test('a back/forward return to the confirmation page does not fire again', () => {
  const tab = openTab();
  tab.load('/thank-you', 'navigate');
  tab.load('/pricing', 'navigate');
  assert.equal(tab.load('/thank-you', 'back_forward').count(), 0);
});
test('a new navigation to the same confirmation path is a new conversion', () => {
  const tab = openTab();
  tab.load('/thank-you', 'navigate');
  tab.load('/thank-you', 'reload');
  assert.equal(tab.load('/thank-you', 'navigate').count(), 1);
});
test('a different confirmation path counts as well', () => {
  const tab = openTab();
  tab.load('/thank-you', 'navigate');
  assert.equal(tab.load('/success', 'navigate').count(), 1);
});
test('single-page app: a route change fires once and the back button does not fire again', () => {
  const page = openTab().load('/', 'navigate');
  page.pushState('/thank-you');
  assert.equal(page.count(), 1);
  page.pushState('/pricing');
  page.popstateTo('/thank-you');
  assert.equal(page.count(), 1);
});
test('a route change in a page that itself loaded as a reload still counts', () => {
  const page = openTab().load('/', 'reload');
  page.pushState('/thank-you');
  assert.equal(page.count(), 1);
});
test('COUNT_EVERY_VIEW = true counts a refresh again', () => {
  const every = shipped.replace('var COUNT_EVERY_VIEW = false;', 'var COUNT_EVERY_VIEW = true;');
  assert.notEqual(every, shipped, 'COUNT_EVERY_VIEW flag not found in the snippet');
  const tab = openTab();
  tab.load('/thank-you', 'navigate', every);
  assert.equal(tab.load('/thank-you', 'reload', every).count(), 1);
});
