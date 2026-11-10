/*! Ninja Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: ninja_forms_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  'use strict';
  var runtime = window.__ctNinjaFormsRuntime;
  if (runtime && runtime.installed) return;

  // Preserve the recipe's public duplicate-install guard. If a superseded
  // snippet already set it without this runtime, fail closed: don't layer a
  // second listener over an unknown old detector.
  if (!runtime && window.__ctDetectNinjaForms) return;

  if (!runtime) {
    runtime = { seenEntryIds: Object.create(null), installed: false };
    window.__ctNinjaFormsRuntime = runtime;
  }
  window.__ctDetectNinjaForms = true;
  window.dataLayer = window.dataLayer || [];

  var MISSING = {};
  var MAX_SAFE_INTEGER = 9007199254740991;

  // Read only own data properties. Callback payloads are normally parsed JSON,
  // but a filter or another page script can supply accessor-backed objects.
  // Do not execute getters while deciding whether a response proves a save.
  function ownDataValue(object, key) {
    if (!object || typeof object !== 'object' || !Object.prototype.hasOwnProperty.call(object, key)) return MISSING;
    if (typeof Object.getOwnPropertyDescriptor !== 'function') return MISSING;
    var descriptor = Object.getOwnPropertyDescriptor(object, key);
    if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) return MISSING;
    return descriptor.value;
  }

  function emptyErrors(value) {
    if (Object.prototype.toString.call(value) === '[object Array]') return value.length === 0;
    if (!value || typeof value !== 'object') return false;
    for (var key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) return false;
    }
    return true;
  }

  // Accept only primitive safe integers or canonical decimal strings. Never
  // coerce booleans, arrays, objects, boxed numbers, or accessor-backed IDs.
  function positiveIntegerId(value) {
    if (typeof value === 'number') {
      if (!isFinite(value) || value <= 0 || Math.floor(value) !== value || value > MAX_SAFE_INTEGER) return null;
      return String(value);
    }
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
    var number = Number(value);
    if (!isFinite(number) || number > MAX_SAFE_INTEGER || String(number) !== value) return null;
    return value;
  }

  function canonicalFormId(value) {
    var formId;
    if (typeof value === 'number') {
      if (!isFinite(value) || value <= 0 || Math.floor(value) !== value || value > MAX_SAFE_INTEGER) return null;
      formId = String(value);
    } else if (typeof value === 'string') {
      formId = value;
    } else {
      return null;
    }
    if (!/^[1-9]\d*(?:_(?:0|[1-9]\d*))*$/.test(formId)) return null;
    var parts = formId.split('_');
    for (var i = 0; i < parts.length; i++) {
      var part = Number(parts[i]);
      if (!isFinite(part) || part > MAX_SAFE_INTEGER || String(part) !== parts[i]) return null;
    }
    return formId;
  }

  function inspectResponse(response, callbackFormId) {
    var errors = ownDataValue(response, 'errors');
    if (errors === MISSING || !emptyErrors(errors)) return null;
    var data = ownDataValue(response, 'data');
    if (!data || typeof data !== 'object') return null;
    var halt = ownDataValue(data, 'halt');
    if (halt !== MISSING && halt) return null;
    var nestedErrors = ownDataValue(data, 'errors');
    if (nestedErrors !== MISSING && !emptyErrors(nestedErrors)) return null;
    var formValue = ownDataValue(data, 'form_id');
    var formId = formValue === MISSING ? null : canonicalFormId(formValue);
    if (!formId || canonicalFormId(callbackFormId) !== formId) return null;
    var actions = ownDataValue(data, 'actions');
    if (!actions || typeof actions !== 'object') return null;
    var save = ownDataValue(actions, 'save');
    if (!save || typeof save !== 'object') return null;
    var saveValue = ownDataValue(save, 'sub_id');
    var entryId = saveValue === MISSING ? null : positiveIntegerId(saveValue);
    if (!entryId) return null;
    return { formId: formId, entryId: entryId };
  }

  runtime.inspectResponse = inspectResponse;

  function handleSubmitResponse(response, textStatus, jqXHR, callbackFormId) {
      var accepted = inspectResponse(response, callbackFormId);
      if (!accepted) {
        if (typeof window.__ctNinjaMethod2AfterResponse === 'function') {
          window.__ctNinjaMethod2AfterResponse(callbackFormId, false, false);
        }
        return;
      }

      var key = '$' + accepted.entryId;
      if (runtime.seenEntryIds[key]) {
        if (typeof window.__ctNinjaMethod2AfterResponse === 'function') {
          window.__ctNinjaMethod2AfterResponse(accepted.formId, false, true);
        }
        return;
      }
      runtime.seenEntryIds[key] = true;

      var enriched = false;
      if (typeof window.__ctNinjaMethod2Emit === 'function') {
        try {
          enriched = window.__ctNinjaMethod2Emit(accepted.formId, accepted.entryId) === true;
        } catch (e) {
          enriched = false;
        }
      }
      if (!enriched) {
        window.dataLayer.push({ event: 'ninja_forms_submitted', form_id: accepted.formId });
      }
      if (typeof window.__ctNinjaMethod2AfterResponse === 'function') {
        window.__ctNinjaMethod2AfterResponse(accepted.formId, true, false);
      }
  }

  function hookNfRadio() {
    if (runtime.installed) return true;
    var radio = typeof nfRadio !== 'undefined' && nfRadio.channel ? nfRadio :
      (typeof Backbone !== 'undefined' && Backbone.Radio ? Backbone.Radio : null);
    if (!radio) return false;
    try {
      radio.channel('forms').on('submit:response', handleSubmitResponse);
      runtime.installed = true;
      return true;
    } catch (e) {
      return false;
    }
  }

  if (!hookNfRadio()) {
    document.addEventListener('DOMContentLoaded', hookNfRadio);
    window.addEventListener('load', hookNfRadio);
  }
})();
