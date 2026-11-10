/*! HubSpot Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: hubspot_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectHubspotForms) return;
  window.__ctDetectHubspotForms = true;
  window.dataLayer = window.dataLayer || [];

  // Updated-editor conversions are keyed by HubSpot's documented conversion
  // ID. Legacy messages use event-object identity because their documented
  // callback payload has no conversion ID.
  var seenConversions = {};
  var seenLegacyEvents = typeof WeakSet === 'function' ? new WeakSet() : [];

  function fireConversion(formId, conversionId, acceptedContext) {
    var id = formId ? String(formId) : '';
    if (typeof conversionId !== 'string' || !conversionId) return false;
    var key = '$' + conversionId;
    if (seenConversions[key]) return false;
    seenConversions[key] = true;
    var handled = false;
    var adapter = window.__ctHubspotMethod2Handler;
    if (typeof adapter === 'function') {
      try {
        handled = adapter({
          formId: id,
          instanceId: acceptedContext && acceptedContext.instanceId || '',
          conversionId: conversionId,
          form: acceptedContext && acceptedContext.form || null
        }) === true;
      } catch (e) {
        handled = false;
      }
    }
    // The push is contained, and a conversion whose push failed is
    // forgotten, so a repeat of HubSpot's event can still count it.
    if (!handled) {
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'hubspot_form_submitted', form_id: id });
      } catch (e) {
        delete seenConversions[key];
        return false;
      }
    }
    return true;
  }

  function claimLegacyEvent(event) {
    if (!event || typeof event !== 'object') return false;
    if (seenLegacyEvents && typeof seenLegacyEvents.has === 'function') {
      if (seenLegacyEvents.has(event)) return false;
      seenLegacyEvents.add(event);
      return true;
    }
    if (seenLegacyEvents.indexOf(event) !== -1) return false;
    seenLegacyEvents.push(event);
    return true;
  }

  function releaseLegacyEvent(event) {
    try {
      if (typeof seenLegacyEvents.delete === 'function') { seenLegacyEvents.delete(event); return; }
      var i = seenLegacyEvents.indexOf(event);
      if (i !== -1) seenLegacyEvents.splice(i, 1);
    } catch (e) {}
  }

  // ------------------------------------------------------------
  // Path 1: current forms editor (live-verified)
  // ------------------------------------------------------------
  // HubSpot dispatches this on the .hs-form-frame container and lets it bubble
  // (or on document itself when it cannot find the container), with
  // detail = { formId, instanceId }. It only ever follows a submission
  // HubSpot's server accepted. Listening on document in the capture phase
  // catches both dispatch points and cannot be silenced by page code that
  // stops the event's propagation further down.
  function hubspotFormsApi() {
    return window.HubSpotFormsV4 || window.HubspotFormsV4 || null;
  }

  function handleSubmissionSuccess(event) {
    try {
      var detail = event && event.detail;
      if (!detail || typeof detail.formId !== 'string' || !detail.formId) return;
      if (typeof detail.instanceId !== 'string' || !detail.instanceId) return;
      // When HubSpot's forms API is on the page, the event must name a form
      // instance HubSpot actually rendered here. A stray or malformed event
      // with a made-up instance id is ignored.
      var api = hubspotFormsApi();
      if (!api || typeof api.getFormFromEvent !== 'function') return;
      var form = api.getFormFromEvent(event);
      if (!form || typeof form.getFormId !== 'function' ||
          typeof form.getInstanceId !== 'function' ||
          typeof form.getConversionId !== 'function') return;
      if (form.getFormId() !== detail.formId ||
          form.getInstanceId() !== detail.instanceId) return;
      // HubSpot documents getConversionId as valid after successful
      // submission. It is the stable key for event replay and repeated submits.
      fireConversion(detail.formId, form.getConversionId(), { form: form, instanceId: detail.instanceId });
    } catch (e) {
      // Never throw back into HubSpot's own event dispatch.
    }
  }

  // ------------------------------------------------------------
  // Path 2: legacy forms editor (ported from the production module)
  // ------------------------------------------------------------
  // Legacy forms announce each lifecycle step with a postMessage of
  // { type: 'hsFormCallback', eventName, id, data }. Only 'onFormSubmitted'
  // means the submission was accepted; 'onFormSubmit' also fires for
  // submissions that then fail validation, so it is ignored.
  //
  // The legacy callback payload documents its form ID but not a safe mapping
  // from a cross-origin source WindowProxy to that ID. Accept only the inline
  // same-window callback; cross-origin iframe messages fail closed until a
  // vendor-supported source/form binding can be verified.
  function isTrustedOrigin(event) {
    return !!(event && event.source === window &&
      event.origin === window.location.origin);
  }

  function handleMessage(event) {
    try {
      // Reject an unbound source before even reading its structured-clone data.
      if (!isTrustedOrigin(event)) return;
      var data = event && event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type !== 'hsFormCallback') return;
      if (data.eventName !== 'onFormSubmitted') return;
      var formId = data.id;
      if (typeof formId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(formId)) return;
      if (!claimLegacyEvent(event)) return;
      // The documented legacy callback runs after persistence, but has no
      // stable conversion ID. The local guard only recognizes replay of this
      // exact MessageEvent object; a distinct event object may be a replay or a
      // new conversion, so cross-event deduplication is not claimed.
      var handled = false;
      var adapter = window.__ctHubspotMethod2Handler;
      if (typeof adapter === 'function') {
        try {
          handled = adapter({ formId: formId, legacyEvent: event }) === true;
        } catch (e) { handled = false; }
      }
      if (!handled) {
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'hubspot_form_submitted', form_id: formId });
        } catch (e) {
          releaseLegacyEvent(event);
        }
      }
    } catch (e) {
      // Never throw back into the page's own message handling.
    }
  }

  document.addEventListener('hs-form-event:on-submission:success', handleSubmissionSuccess, true);
  window.addEventListener('message', handleMessage, false);
})();
