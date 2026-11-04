// Continuous reading: scrolling past the end of a page moves to the next one,
// with a short "you are now in…" toast. Chapters first show a "chapter finished" card.
(function(){
  const main=document.getElementById('main');
  const KEY='fallacies-flow-arrived';
  let zone=null,armedAt=0,going=false,touchY=null;

  const busy=()=>document.body.classList.contains('is-guided')||document.body.classList.contains('is-autoplay')||document.querySelector('dialog[open]');
  const unitId=()=>{const m=location.hash.match(/^#\/f\/(\d+)/);return m?+m[1]:(/^#\/intro/.test(location.hash)?0:null)};
  const lastText=a=>{const n=[...a.childNodes].filter(x=>x.nodeType===3||x.tagName==='B').pop();return (n?n.textContent:a.textContent).trim()};

  function nextTarget(){
    const page=main.querySelector('.page-pager .pp-next');
    if(page)return{href:page.getAttribute('href'),name:page.querySelector('b').textContent.trim(),group:(page.querySelector('small').textContent.split('·')[1]||'').replace('←','').trim()};
    const links=main.querySelectorAll('.prev-next a');
    const a=links[links.length-1];
    if(a&&unitId()!==null)return{href:a.getAttribute('href'),name:lastText(a),group:'فصول الكتاب'};
    return null;
  }

  function endCard(id){
    const cb=document.querySelector('[data-done="'+id+'"]');
    const done=cb&&cb.checked;
    const name=(main.querySelector('h1')||{}).textContent||'';
    const card=document.createElement('section');
    card.className='chapter-end';
    card.innerHTML='<div class="chapter-end-mark" aria-hidden="true">✓</div><h2>'+(id===0?'خلصت المقدمة':'خلصت الفصل '+id)+'</h2><p>'+name.replace(/</g,'&lt;')+'</p>'+
      (cb?'<button type="button" class="chapter-end-done'+(done?' is-done':'')+'">'+(done?'متعلّمة إنها اتفهمت ✓':'علّمها إنها اتفهمت')+'</button>':'');
    const btn=card.querySelector('button');
    if(btn)btn.addEventListener('click',()=>{const c=document.querySelector('[data-done="'+id+'"]');if(!c||c.checked)return;c.click();btn.textContent='متعلّمة إنها اتفهمت ✓';btn.classList.add('is-done')});
    return card;
  }

  function build(){
    zone=null;going=false;
    const t=nextTarget();
    if(!t)return;
    const host=main.querySelector('.page')||main;
    const id=unitId();
    const foot=host.querySelector('.site-footer');
    if(id!==null){const card=endCard(id);foot?host.insertBefore(card,foot):host.appendChild(card)}
    zone=document.createElement('div');
    zone.className='flow-zone';
    zone.innerHTML='<div class="flow-zone-inner"><span class="flow-arrow" aria-hidden="true">↓</span><small>كمّل سكرول لتحت</small><b>'+t.name.replace(/</g,'&lt;')+'</b><span class="flow-bar"><i></i></span></div>';
    zone.dataset.href=t.href;zone.dataset.name=t.name;zone.dataset.group=t.group;
    host.appendChild(zone);
    armedAt=Date.now()+700;
  }

  function progress(){
    if(!zone)return 0;
    const r=zone.getBoundingClientRect(),h=r.height||1;
    return Math.max(0,Math.min(1,(innerHeight-r.top)/h));
  }

  function check(push){
    if(!zone||going||busy()||Date.now()<armedAt)return;
    const p=progress();
    const bar=zone.querySelector('.flow-bar i');if(bar)bar.style.width=Math.round(p*100)+'%';
    const atBottom=innerHeight+scrollY>=document.documentElement.scrollHeight-4;
    if((p>=0.98||atBottom&&push)&&p>0.5)go();
  }

  function go(){
    going=true;
    try{sessionStorage.setItem(KEY,JSON.stringify({group:zone.dataset.group,name:zone.dataset.name}))}catch(e){}
    location.hash=zone.dataset.href;
  }

  function arrived(){
    let a=null;try{a=JSON.parse(sessionStorage.getItem(KEY));sessionStorage.removeItem(KEY)}catch(e){}
    if(!a)return;
    let el=document.getElementById('flow-toast');
    if(!el){el=document.createElement('div');el.id='flow-toast';el.setAttribute('role','status');document.body.appendChild(el)}
    el.innerHTML=(a.group?'<small>'+a.group.replace(/</g,'&lt;')+'</small>':'')+'<b>'+a.name.replace(/</g,'&lt;')+'</b>';
    el.classList.remove('show');void el.offsetWidth;el.classList.add('show');
    clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1800);
  }

  function onRoute(){setTimeout(()=>{build();arrived()},60)}
  addEventListener('hashchange',onRoute);
  addEventListener('scroll',()=>check(false),{passive:true});
  addEventListener('wheel',e=>{if(e.deltaY>0)check(true)},{passive:true});
  addEventListener('touchstart',e=>{touchY=e.touches[0].clientY},{passive:true});
  addEventListener('touchmove',e=>{if(touchY!==null&&touchY-e.touches[0].clientY>30)check(true)},{passive:true});
  addEventListener('keydown',e=>{if((e.key==='PageDown'||e.key==='End')&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))check(true)});
  onRoute();
})();
