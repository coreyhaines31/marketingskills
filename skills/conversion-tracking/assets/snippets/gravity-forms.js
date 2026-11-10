/*! Gravity Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: gravity_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
/* Gravity Forms Submission Listener.
 * Event-only adaptation of verified production detection helpers.
 * Source SHA256 3ed591d48dc449e94fd48f634bb07ae8285f5d661a4b48fc5db867ca3e659b69.
 * Reads no form field values. Sends only event and form_id to dataLayer.
 * Native handoff stores only form ID, source path and time in sessionStorage.
 */
(function(){
"use strict";
if(window.__ctGalleryGravityForms)return;
window.__ctGalleryGravityForms=true;
// Preserve the original recipe guard for an old recipe loaded after this code.
// Do not return on the legacy guard: an old-first listener is independently
// active and remains an unsupported migration state, but must not suppress us.
window.__ctDetectGravityForms=true;
function isGravityForm(formEl) {
    if (!formEl) return false;
    // Check for gform_wrapper parent or gform_ ID prefix
    try {
      if (formEl.closest && formEl.closest('.gform_wrapper')) return true;
    } catch (e) {
      // .closest not available — fall back to ID check
    }
    // Fallback: GF forms have IDs like "gform_1", "gform_5"
    var id = formEl.id || '';
    return /^gform_\d+$/.test(id);
  }

function getFormId(formEl) {
    if (!formEl) return null;
    var fid = (formEl.getAttribute && formEl.getAttribute('data-formid')) || '';
    if (fid) return String(fid);
    var id = formEl.id || '';
    var m = /gform_(\d+)/.exec(id);
    return m ? m[1] : null;
  }

function isAjaxForm(formEl) {
    if (!formEl) return false;
    try {
      var target = (formEl.getAttribute && formEl.getAttribute('target')) || '';
      if (target.indexOf('gform_ajax_frame_') === 0) return true;
      if (formEl.querySelector && formEl.querySelector('input[name="gform_ajax"]')) {
        return true;
      }
    } catch (e) {
      // DOM access failed — treat as non-AJAX; the reload path is the
      // safer default (it still only fires on confirmed success).
    }
    return false;
  }

function isNodeHidden(el) {
    try {
      if (el.hidden) return true;
      if (el.getAttribute && el.getAttribute('aria-hidden') === 'true') return true;
      var view = el.ownerDocument && el.ownerDocument.defaultView;
      if (view && view.getComputedStyle) {
        var cs = view.getComputedStyle(el);
        if (cs && (cs.display === 'none' || cs.visibility === 'hidden')) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

function hasVisibleValidationErrors(rootEl) {
    if (!rootEl || !rootEl.querySelectorAll) return false;
    try {
      if (rootEl.className &&
          (' ' + rootEl.className + ' ').indexOf(' gform_validation_error ') !== -1) {
        return true;
      }
      var nodes = rootEl.querySelectorAll(
        '.gform_validation_errors, .validation_error, .gfield_error, .validation_message, [aria-invalid="true"]'
      );
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (isNodeHidden(node)) continue;
        if (node.getAttribute && node.getAttribute('aria-invalid') === 'true') return true;
        // Error classes and ARIA state are structural signals. Never read
        // rendered validation text: themes may include resolved field values.
        var classes = typeof node.className === 'string' ? node.className : '';
        if (/^(?:.*\s)?(?:gform_validation_errors|validation_error|gfield_error)(?:\s.*)?$/.test(classes)) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

function safeFormId(formId) {
    if (formId == null) return null;
    var s = String(formId);
    return /^\d+$/.test(s) ? s : null;
  }

function hasServerRejectionMarkers(formId) {
    var fid = safeFormId(formId);
    try {
      if (fid) {
        var scope = document.querySelector('#gform_wrapper_' + fid) ||
          document.querySelector('#gform_' + fid + ', form[data-formid="' + fid + '"]');
        if (scope && scope.closest) {
          scope = scope.closest('.gform_wrapper') || scope;
        }
        // The submitted form isn't on this page at all → no rejection
        // evidence FOR THIS FORM, whatever other forms are showing.
        return scope ? hasVisibleValidationErrors(scope) : false;
      }
      var wrappers = document.querySelectorAll('.gform_wrapper');
      for (var i = 0; i < wrappers.length; i++) {
        if (hasVisibleValidationErrors(wrappers[i])) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

function hasConfirmationMessage(formId) {
    var fid = safeFormId(formId);
    try {
      var nodes = document.querySelectorAll(
        '.gform_confirmation_message, [id^="gform_confirmation_message_"], [id^="gform_confirmation_wrapper_"]'
      );
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (isNodeHidden(node)) continue;
        // Presence of a visible, form-attributed confirmation element is a
        // structural legacy signal; its rendered contents are never inspected.
        if (!fid) continue;
        // Attribute the node to a form id if it carries one (own id or an
        // ancestor confirmation-wrapper id).
        var taggedId = null;
        var m = /gform_confirmation_(?:message|wrapper)_(\d+)/.exec(node.id || '');
        if (m) {
          taggedId = m[1];
        } else if (node.closest) {
          try {
            var anc = node.closest('[id^="gform_confirmation_wrapper_"], [id^="gform_confirmation_message_"]');
            var am = anc && /_(\d+)$/.exec(anc.id || '');
            if (am) taggedId = am[1];
          } catch (e2) {
            // .closest unavailable — treat as untagged
          }
        }
        if (taggedId === fid) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }
var pending={},complete={},TTL=120000,markerKey='__ct_gallery_gf_pending_v3';
var modernHookInstalled=false,seenEntries={};
window.dataLayer=window.dataLayer||[];
function forget(id){var entry=pending[id];if(entry&&entry.timer)clearTimeout(entry.timer);delete pending[id];}
function discardNotice(id,reason,form){try{document.dispatchEvent(new CustomEvent('ct:gform-attempt-discarded',{detail:{formId:String(id||''),reason:reason||'discarded',form:form||null}}));}catch(e){}}
function emitConfirmed(id,form,uniqueAccepted){id=safeFormId(id);if(!id||(!uniqueAccepted&&complete[id]))return;complete[id]=true;var handled=false;try{if(typeof window.__ctGravityMethod2Emit==='function')handled=window.__ctGravityMethod2Emit(id,form)===true;}catch(e){}if(!handled)window.dataLayer.push({event:'gravity_form_submitted',form_id:id});}
function fireLegacy(id){id=safeFormId(id);if(modernHookInstalled||!id||!pending[id]||complete[id])return;var form=pending[id].form;forget(id);emitConfirmed(id,form);}
function attempt(form,method,type){
 if(!isGravityForm(form))return;var id=safeFormId(getFormId(form));if(!id)return;
 if(modernHookInstalled){return;}
 if(type&&type!=='submit'){forget(id);discardNotice(id,'nonfinal');return;}
 forget(id);complete[id]=false;
 var entry={form:form,method:method||(isAjaxForm(form)?'iframe':'postback'),trusted:method==='postback',time:Date.now(),path:location.pathname,timer:null};
 entry.timer=setTimeout(function(){if(pending[id]===entry){forget(id);discardNotice(id,'timeout');}},TTL);pending[id]=entry;
}
function acceptedIframe(frame){
 if(modernHookInstalled||!frame||frame.tagName!=='IFRAME'||!/^gform_ajax_frame_\d+$/.test(frame.id||''))return;
 var id=frame.id.replace('gform_ajax_frame_','');if(!pending[id])return;
 try{var doc=frame.contentDocument;if(!doc||!doc.querySelector('.GF_AJAX_POSTBACK'))return;if(doc.querySelector('.gform_validation_error, .gform_validation_errors, .gfield_error, [aria-invalid=\"true\"]')){forget(id);discardNotice(id,'rejected');return;}var confirmation=doc.querySelector('#gform_confirmation_wrapper_'+id+', #gform_confirmation_message_'+id);if(confirmation&&!isNodeHidden(confirmation))fireLegacy(id);}catch(e){}
}
document.addEventListener('load',function(event){acceptedIframe(event.target);},true);
var jqueryHooked=false;
function hook(){
 if(!jqueryHooked&&typeof window.jQuery==='function'){jqueryHooked=true;window.jQuery(document).on('gform_confirmation_loaded.ctGallery',function(event,id){fireLegacy(id);});}
 if(modernHookInstalled||!window.gform||!gform.utils||!gform.utils.addAsyncFilter)return;
 modernHookInstalled=true;
 gform.utils.addAsyncFilter('gform/submission/pre_submission',function(data){
  var form=data&&data.form;if(form&&!form.tagName&&form[0])form=form[0];var id=safeFormId(getFormId(form));
  if(!id)return data;
  if(data.submissionType!=='submit'){
   discardNotice(id,'nonfinal',form);
   return data;
  }
  if(data.abort===true)return data;
  if(data.submissionMethod==='postback'||data.submissionMethod==='iframe')data.submissionMethod='ajax';
  return data;
 });
 gform.utils.addAsyncFilter('gform/submission/submission_started',function(data){
  var form=data&&data.form;if(form&&!form.tagName&&form[0])form=form[0];var id=safeFormId(getFormId(form));
  if(id&&data.submissionType==='submit')complete[id]=false;
  return data;
 });
 gform.utils.addAsyncFilter('gform/ajax/post_ajax_submission',function(data){
  var form=data&&data.form;if(form&&!form.tagName&&form[0])form=form[0];var id=safeFormId(getFormId(form));if(!id)return data;
  var result=data&&data.submissionResult,verdict=result&&result.data;
  var rawEntryId=verdict&&verdict.entry_id,entryId=typeof rawEntryId==='number'?rawEntryId:(typeof rawEntryId==='string'&&/^\d+$/.test(rawEntryId)?Number(rawEntryId):NaN);
  var key=id+':'+entryId;
  if(result&&result.success===true&&verdict&&verdict.is_valid===true&&verdict.submission_type==='submit'&&isFinite(entryId)&&Math.floor(entryId)===entryId&&entryId>0&&entryId<=9007199254740991&&verdict.is_spam===false){
   if(seenEntries[key]){discardNotice(id,'duplicate-entry',form);return data;}
   seenEntries[key]=true;emitConfirmed(id,form,true);
  }else if(result&&result.success===true)discardNotice(id,'rejected',form);
  return data;
 });
 gform.utils.addAsyncFilter('gform/ajax/pre_display_error',function(data){
  if(data&&data.formId){var errorForm=null;try{errorForm=document.querySelector('#gform_'+safeFormId(data.formId));}catch(e){}discardNotice(data.formId,'ajax-error',errorForm);}
  return data;
 });
 document.addEventListener('gform/submission/submission_aborted',function(event){
  var form=event&&event.detail&&event.detail.form,id=safeFormId(getFormId(form));
  if(id)discardNotice(id,'abort',form);
 });
}
hook();document.addEventListener('gform/theme/scripts_loaded',hook);document.addEventListener('DOMContentLoaded',hook);window.addEventListener('load',hook);
document.addEventListener('submit',function(event){attempt(event.target,null,'submit');},true);
document.addEventListener('click',function(event){var el=event.target;if(!el||!el.closest)return;var control=el.closest('[id^="gform_submit_button_"]');if(control)attempt(control.closest('form'),null,'submit');},true);
function confirmationNode(node){if(modernHookInstalled||!node||node.nodeType!==1)return;var nodes=[];if(node.matches&&node.matches('[id^="gform_confirmation_message_"], [id^="gform_confirmation_wrapper_"]'))nodes.push(node);if(node.querySelectorAll){var list=node.querySelectorAll('[id^="gform_confirmation_message_"], [id^="gform_confirmation_wrapper_"]');for(var i=0;i<list.length;i++)nodes.push(list[i]);}for(var j=0;j<nodes.length;j++){var match=/gform_confirmation_(?:message|wrapper)_(\d+)/.exec(nodes[j].id||'');if(match&&!isNodeHidden(nodes[j]))fireLegacy(match[1]);}}
if(typeof MutationObserver==='function')new MutationObserver(function(mutations){for(var i=0;i<mutations.length;i++)for(var j=0;j<mutations[i].addedNodes.length;j++)confirmationNode(mutations[i].addedNodes[j]);}).observe(document.body||document.documentElement,{childList:true,subtree:true});
window.addEventListener('pagehide',function(){
 var markers=[];for(var id2 in pending)if(Object.prototype.hasOwnProperty.call(pending,id2)){var entry=pending[id2];if(entry.method!=='postback'||Date.now()-entry.time>10000||(!entry.trusted&&hasVisibleValidationErrors(entry.form)))continue;markers.push({id:id2,time:entry.time,path:entry.path});}
 if(markers.length)try{sessionStorage.setItem(markerKey,JSON.stringify(markers));}catch(e){}
});
function deferred(){if(modernHookInstalled)return;var markers;try{var raw=sessionStorage.getItem(markerKey);sessionStorage.removeItem(markerKey);markers=JSON.parse(raw||'[]');}catch(e){return;}if(!Array.isArray(markers))return;for(var i=0;i<markers.length;i++){var marker=markers[i],id=safeFormId(marker&&marker.id);if(!id||!marker.time||Date.now()-marker.time>60000)continue;if(hasServerRejectionMarkers(id))continue;if(hasConfirmationMessage(id)){pending[id]={};fireLegacy(id);}}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',deferred);else deferred();

})();
