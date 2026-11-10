/*! Forminator conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: forminator_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctForminatorForms) return;
  window.__ctForminatorForms = true;
  window.dataLayer = window.dataLayer || [];
  var listeners=[],lastEvent=null;
  window.__ctForminatorSubscribe=function(listener){if(listener&&typeof listener==='object')listeners.push(listener);};
  function isForm(form){
    try{return !!(form&&String(form.tagName||'').toLowerCase()==='form'&&form.classList&&form.classList.contains('forminator-custom-form'));}
    catch(e){return false;}
  }
  function notify(phase,form,candidate,event){
    var handled=false;
    for(var i=0;i<listeners.length;i++)try{var fn=listeners[i]&&listeners[i][phase];if(typeof fn==='function'&&fn(form,candidate,event)===true)handled=true;}catch(e){}
    return handled;
  }
  function submit(event){try{var form=event.target;if(isForm(form))notify('beforeAttempt',form,false,event);}catch(e){}}
  function success(event){
    try{
      if(event&&typeof event==='object'&&event===lastEvent)return;
      lastEvent=event;
      if(event&&typeof event==='object')setTimeout(function(){if(lastEvent===event)lastEvent=null;},0);
      var form=event&&event.target;if(!isForm(form))return;
      if(!notify('onCandidate',form,true,event))window.dataLayer.push({event:'forminator_form_submitted',form_id:form.getAttribute('data-form-id')||''});
    }catch(e){}
  }
  document.addEventListener('submit',submit,true);
  // Page-reload forms render their verdict in the returned page instead of
  // emitting the AJAX event. Read only the confirmation class and form ID.
  var confirmedForms=[];
  function nativeConfirmations(){
    try{
      var forms=document.querySelectorAll('form.forminator-custom-form:not(.forminator_ajax)');
      for(var i=0;i<forms.length;i++){
        var form=forms[i],message=form.querySelector('.forminator-response-message.forminator-success');
        if(!message||!message.getClientRects().length||confirmedForms.indexOf(form)!==-1)continue;
        confirmedForms.push(form);
        success({target:form});
      }
    }catch(e){}
  }
  function watchNative(){
    nativeConfirmations();
    if(window.MutationObserver&&document.documentElement){
      new MutationObserver(nativeConfirmations).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watchNative);
  else watchNative();
  window.addEventListener('load',nativeConfirmations);
  function hook(){
    try{
      if(window.__ctForminatorSuccessHooked)return true;
      var jq=window.jQuery||(typeof jQuery!=='undefined'?jQuery:(typeof $!=='undefined'?$:null));
      if(!jq)return false;
      window.__ctForminatorSuccessHooked=true;
      jq(document).on('forminator:form:submit:success',success);return true;
    }catch(e){return false;}
  }
  if(!hook()){document.addEventListener('DOMContentLoaded',hook);window.addEventListener('load',hook);}
})();
