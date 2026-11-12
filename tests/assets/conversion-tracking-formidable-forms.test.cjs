const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// formidable-forms.js hands a native POST off to the next page through a
// sessionStorage marker written on pagehide. These tests evaluate the shipped
// file against stand-ins for the DOM pieces it touches, dispatch submit the
// way a browser does (defaultPrevented marks the AJAX submits Formidable's own
// handler cancels), share sessionStorage and a controlled clock across two page
// loads, and count the dataLayer events on the landing page.
const snippetPath = path.resolve(__dirname, '../../skills/conversion-tracking/assets/snippets/formidable-forms.js');
const snippet = fs.readFileSync(snippetPath, 'utf8');

function makePage(pathname, { hasForm }, store, clock) {
  const listeners = { doc: {}, win: {} };
  const jqHandlers = [];
  const state = { errorsVisible: false };
  const formIdInput = { getAttribute: () => '7' };
  const wrapper = {
    querySelector: (sel) => {
      if (sel === 'form') return form;
      if (/frm_error/.test(sel)) return state.errorsVisible ? {} : null;
      return null; // no .frm_message: the submit did not succeed
    },
  };
  const form = {
    tagName: 'FORM',
    closest: (sel) => (sel === '.frm_forms' ? wrapper : null),
    querySelector: (sel) => (sel === 'input[name="form_id"]' ? formIdInput : null),
  };
  const document = {
    readyState: 'complete',
    addEventListener: (t, fn) => { (listeners.doc[t] = listeners.doc[t] || []).push(fn); },
    getElementById: (id) => (hasForm && id === 'frm_form_7_container' ? wrapper : null),
    querySelector: (sel) => (hasForm && state.errorsVisible && /frm_error/.test(sel) ? {} : null),
  };
  const window = {
    location: { protocol: 'https:', origin: 'https://shop.example', pathname },
    dataLayer: [],
    sessionStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    },
    addEventListener: (t, fn) => { (listeners.win[t] = listeners.win[t] || []).push(fn); },
    removeEventListener: (t, fn) => { listeners.win[t] = (listeners.win[t] || []).filter((f) => f !== fn); },
    jQuery: () => ({ on: (_names, fn) => jqHandlers.push(fn) }),
  };
  window.window = window;
  vm.runInContext(snippet, vm.createContext({ window, document, Date: { now: () => clock.now } }), { filename: snippetPath });
  return {
    dataLayer: window.dataLayer,
    submit: (prevented) => (listeners.doc.submit || []).forEach((fn) => fn({ target: form, defaultPrevented: !!prevented })),
    ajaxFailed: () => { state.errorsVisible = true; }, // Formidable fires no frmFormComplete on failure
    leave: () => (listeners.win.pagehide || []).forEach((fn) => fn({})),
    triggerComplete: (response) => jqHandlers.forEach((fn) => fn({}, form, response)),
  };
}

// Submits on /contact, optionally fails the AJAX submit, advances the clock,
// leaves the page, and counts formidable_forms_submitted on /pricing.
function submitThenLeave({ submit, prevented, leaveMs, readMs }) {
  const store = new Map();
  const clock = { now: 0 };
  const contact = makePage('/contact', { hasForm: true }, store, clock);
  if (submit) {
    contact.submit(prevented);
    if (prevented) contact.ajaxFailed();
  }
  clock.now = leaveMs;
  contact.leave();
  clock.now = readMs;
  const pricing = makePage('/pricing', { hasForm: false }, store, clock);
  return pricing.dataLayer.filter((e) => e.event === 'formidable_forms_submitted').length;
}

test('a failed AJAX submit followed by a later same-origin navigation does not fire', () => {
  assert.equal(submitThenLeave({ submit: true, prevented: true, leaveMs: 120000, readMs: 120000 }), 0);
});
test('a failed AJAX submit followed by a navigation within the marker TTL does not fire', () => {
  assert.equal(submitThenLeave({ submit: true, prevented: true, leaveMs: 30000, readMs: 30000 }), 0);
});
test('a native submit that leaves immediately and lands on another same-origin page fires once', () => {
  assert.equal(submitThenLeave({ submit: true, prevented: false, leaveMs: 0, readMs: 0 }), 1);
});
test('a plain navigation with no submit does not fire', () => {
  assert.equal(submitThenLeave({ submit: false, prevented: false, leaveMs: 120000, readMs: 120000 }), 0);
});
test('a native submit whose landing page reads the marker after the TTL does not fire', () => {
  assert.equal(submitThenLeave({ submit: true, prevented: false, leaveMs: 0, readMs: 120000 }), 0);
});
test('an AJAX success via frmFormComplete fires once on the form page and a later navigation does not refire', () => {
  const store = new Map();
  const clock = { now: 0 };
  const contact = makePage('/contact', { hasForm: true }, store, clock);
  contact.submit(true); // AJAX submit, cancelled by Formidable's own handler
  contact.triggerComplete({ entry_id: 1 }); // frmFormComplete
  clock.now = 60000;
  contact.leave();
  const pricing = makePage('/pricing', { hasForm: false }, store, clock);
  const count = (page) => page.dataLayer.filter((e) => e.event === 'formidable_forms_submitted').length;
  assert.equal(count(contact) + count(pricing), 1);
});
