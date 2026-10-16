/*! Webflow Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: webflow_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctWebflowForms) return;
  window.__ctWebflowForms = true;
  window.dataLayer = window.dataLayer || [];
  var listeners = [], timeout = 30000;
  window.__ctWebflowSubscribe = function (listener) {
    if (listener && typeof listener === 'object') listeners.push(listener);
  };
  function isForm(form) {
    try { return !!(form && String(form.tagName || '').toLowerCase() === 'form' && form.closest && form.closest('.w-form')); }
    catch (e) { return false; }
  }
  function notify(phase, form, candidate) {
    var handled = false;
    for (var i=0;i<listeners.length;i++) {
      try { var fn=listeners[i] && listeners[i][phase]; if (typeof fn==='function' && fn(form,candidate)===true) handled=true; } catch(e) {}
    }
    return handled;
  }
  function visible(el) { try { return !!el && window.getComputedStyle(el).display !== 'none'; } catch(e) { return false; } }
  function emit(form) {
    var name=''; try { name=form.getAttribute('data-name') || form.id || ''; } catch(e) {}
    if (!notify('onCandidate', form, true)) window.dataLayer.push({event:'webflow_form_submitted',form_name:name});
  }
  function submit(event) {
    try {
      var form=event.target; if (!isForm(form)) return;
      notify('beforeAttempt', form, false);
      var wrap=form.closest('.w-form'), done=wrap.querySelector('.w-form-done'), fail=wrap.querySelector('.w-form-fail');
      if (!done) return;
      var old=form.__ctWebflowWatch;
      if (old) { notify('onOverlap', form, false); old.cancel(false); form.__ctWebflowWatch=null; }
      var staleFail=visible(fail), settled=false, observer=null, poll=null, kill=null, jq=window.jQuery;
      function stop(rejected) { if(settled)return; settled=true; if(observer)try{observer.disconnect();}catch(e){} if(jq)jq(document).off('ajaxComplete',check); if(poll)clearInterval(poll); if(kill)clearTimeout(kill); if(form.__ctWebflowWatch===state)form.__ctWebflowWatch=null; if(rejected)notify('onRejected',form,false); }
      var state={cancel:function(){stop(false);}};
      function check() {
        if(settled)return;
        // Webflow sets success only after its server accepts the form. A redirect
        // skips the success box, so check that state after its AJAX callback.
        var wf=jq && jq(form).data('.w-form');
        if(wf && wf.form && wf.form[0]===form && wf.redirect && wf.success===true){ stop(); emit(form); return; }
        if(visible(done)){ stop(); emit(form); return; }
        if(!visible(fail)){staleFail=false;return;}
        if(!staleFail)stop(true);
      }
      if(typeof MutationObserver==='function'){observer=new MutationObserver(check);observer.observe(wrap,{attributes:true,attributeFilter:['style','class'],subtree:true,childList:true});}
      if(jq)jq(document).on('ajaxComplete',check);
      poll=setInterval(check,300); kill=setTimeout(function(){stop(true);},timeout); form.__ctWebflowWatch=state;
    } catch(e) {}
  }
  if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('submit',submit,true);
})();
