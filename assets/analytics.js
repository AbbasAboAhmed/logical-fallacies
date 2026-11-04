// Privacy-friendly page counts (GoatCounter: no cookies, no personal data).
// Off unless SITE_CONFIG.goatcounter holds the account code, and only on http(s), never on file://.
(function(){
  const code=window.SITE_CONFIG&&window.SITE_CONFIG.goatcounter;
  if(typeof code!=='string'||!/^https?:$/.test(location.protocol))return;
  // Each hash route (#/f/9, #/lessons…) counts as its own page.
  const path=()=>location.pathname+(location.hash.replace(/^#/,'')||'/');
  const count=()=>{if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:path()})};
  window.goatcounter={no_onload:true};
  const s=document.createElement('script');
  s.async=true;s.src='https://gc.zgo.at/count.js';
  s.dataset.goatcounter='https://'+code+'.goatcounter.com/count';
  s.onload=count;
  document.head.appendChild(s);
  addEventListener('hashchange',count);
})();
