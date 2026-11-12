const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// generic-ajax-form.js infers success from what the page does after a submit.
// These tests evaluate the shipped file against small stand-ins for the DOM
// pieces it touches and dispatch submit the way a browser does: the form's own
// handler first, then the snippet's bubble-phase listener on document, both
// seeing the same event object.
const snippetPath = path.resolve(__dirname, '../../skills/conversion-tracking/assets/snippets/generic-ajax-form.js');
const snippet = fs.readFileSync(snippetPath, 'utf8');

function element(tag, attrs = {}) {
  return {
    nodeType: 1, tagName: tag.toUpperCase(), id: attrs.id || '', className: attrs.className || '',
    textContent: attrs.textContent || '', hidden: false, parentNode: null, children: [],
    getAttribute(name) { return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null; },
    // Only the snippet's own error selector is ever queried.
    querySelectorAll() {
      return this.children.filter((c) => c.getAttribute('aria-invalid') === 'true' ||
        /error|is-invalid/.test(c.className) || c.getAttribute('role') === 'alert');
    },
    checkValidity() { return attrs.valid !== false; },
  };
}
function within(node, root) { for (let n = node; n; n = n.parentNode) if (n === root) return true; return false; }

function loadPage() {
  const timers = [], observers = [], listeners = {};
  let nextId = 1;
  const window = {
    location: { pathname: '/contact' }, dataLayer: [],
    setTimeout(fn, ms) { const id = nextId++; timers.push({ id, fn, ms }); return id; },
    clearTimeout(id) { const i = timers.findIndex((t) => t.id === id); if (i > -1) timers.splice(i, 1); },
  };
  const document = { readyState: 'complete', addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); } };
  class MutationObserver {
    constructor(cb) { this.cb = cb; }
    observe(target) { this.target = target; observers.push(this); }
    disconnect() { const i = observers.indexOf(this); if (i > -1) observers.splice(i, 1); }
  }
  vm.runInContext(snippet, vm.createContext({ window, document, MutationObserver,
    setTimeout: window.setTimeout, clearTimeout: window.clearTimeout }), { filename: snippetPath });
  return {
    dataLayer: window.dataLayer,
    submit(form, pageHandler) {
      const event = { type: 'submit', target: form, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
      if (pageHandler) pageHandler(event);
      for (const fn of listeners.submit || []) fn(event);
    },
    appendChild(parent, child) {
      child.parentNode = parent; parent.children.push(child);
      for (const o of observers.slice()) if (within(parent, o.target)) o.cb([{ type: 'childList', target: parent, addedNodes: [child] }]);
    },
    elapse(ms) { for (const t of timers.splice(0)) if (t.ms <= ms) t.fn(); },
  };
}

// Submits the form, lets the page render the response, runs out the 7s
// window, and returns how many form_submitted events were pushed.
function submitAndRender({ ajax, response, valid }) {
  const page = loadPage();
  const container = element('div');
  const form = element('form', { id: 'contact', name: 'contact', valid });
  page.appendChild(container, form);
  // An AJAX handler cancels the native navigation and sends fetch(); a plain
  // form lets the browser navigate.
  page.submit(form, ajax ? (e) => e.preventDefault() : null);
  if (response === 'success') page.appendChild(container, element('div', { className: 'form-success', textContent: 'Thanks! We will be in touch.' }));
  if (response === 'error') page.appendChild(form, element('div', { className: 'form-error', textContent: 'Please enter a valid email address.' }));
  page.elapse(8000);
  return page.dataLayer.filter((e) => e.event === 'form_submitted').length;
}

test('an AJAX form (preventDefault + fetch) whose response renders a success message fires once', () => {
  assert.equal(submitAndRender({ ajax: true, response: 'success' }), 1);
});
test('a plain form whose page renders a success message fires once', () => {
  assert.equal(submitAndRender({ ajax: false, response: 'success' }), 1);
});
test('a visible validation error after the submit does not fire', () => {
  assert.equal(submitAndRender({ ajax: true, response: 'error' }), 0);
});
test('no success signal within the 7s window does not fire', () => {
  assert.equal(submitAndRender({ ajax: true, response: null }), 0);
});
test('a form that fails checkValidity() does not fire even if success text appears', () => {
  assert.equal(submitAndRender({ ajax: true, valid: false, response: 'success' }), 0);
});
