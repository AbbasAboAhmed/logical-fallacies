/* UTF-8. Content stays data; HTML from book text is never trusted. */
window.BLOCKS=(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const meanings={ev:'معلومة أو دليل',as:'افتراض محتاج فحص',er:'حكم الأسباب ما تثبتوش',ok:'أسباب كفاية للحكم',key:'مصطلح أساسي'};
const strip=s=>String(s??'').replace(/\[\[(ev|as|er|ok|key):([^\[\]]+)\]\]/g,'$2');
function plain(v){if(typeof v==='string')return strip(v).replace(/\*\*|`/g,'');if(Array.isArray(v))return v.map(plain).join(' ');if(v&&typeof v==='object')return Object.entries(v).filter(([k])=>!['type','kind','layout'].includes(k)).map(([,x])=>plain(x)).join(' ');return ''}
function basic(s){return String(s).split(/([A-Za-z][A-Za-z0-9]*(?:[ -][A-Za-z][A-Za-z0-9]*)*)/g).map((v,i)=>i%2?'<bdi dir="ltr">'+esc(v)+'</bdi>':esc(v)).join('').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<bdi dir="ltr">$1</bdi>')}
// Each token is escaped. Only allowlisted meaning types reach attribute values.
function inline(s){if(Array.isArray(s))return render(s);const source=String(s??''),re=/\[\[(ev|as|er|ok|key):([^\[\]]+)\]\]/g;let out='',last=0,m;while((m=re.exec(source))){out+=basic(source.slice(last,m.index))+'<mark class="word-mark mark-'+m[1]+'" title="'+meanings[m[1]]+'">'+basic(m[2])+'</mark>';last=re.lastIndex}return (out+basic(source.slice(last))).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}
const item=v=>typeof v==='string'?{text:v}:v;
function content(v){const x=item(v);return (x.title?'<strong class="block-title">'+inline(x.title)+'</strong>':'')+render(x.text??'')}
function render(value){if(typeof value==='string')return value.split(/\n\s*\n/).filter(Boolean).map(p=>'<p>'+inline(p).replace(/\n/g,'<br>')+'</p>').join('');if(!value)return '';if(!Array.isArray(value))value=[value];return value.map(b=>{if(typeof b==='string')return render(b);const items=b.items||[];if(b.type==='p')return render(b.text);if(b.type==='branch')return '<div class="meaning-block block-branch" data-block="branch"><div class="branch-parent" data-reveal-item>'+inline(b.parent)+'</div><div class="branch-children">'+items.map((v,i)=>{const x=item(v);return '<div class="branch-child" data-reveal-item><span class="branch-arrow" aria-hidden="true">↓</span><button class="branch-node" aria-expanded="false" data-branch="'+i+'">'+inline(x.title||x.text)+'<span class="branch-tap">＋ افتح الفكرة</span></button><div class="branch-detail"'+(x.title?'':' hidden')+'>'+render(x.title?x.text:'')+'</div></div>'}).join('')+'</div></div>';
if(b.type==='pair')return '<div class="meaning-block block-pair" data-block="pair">'+items.map((v,i)=>'<div class="pair-side tone-'+(['ev','as','er','ok','key'].includes(item(v).kind)?item(v).kind:'ink')+' '+(item(v).kind==='er'?'pair-error':item(v).kind==='ok'?'pair-sound':'')+'" data-reveal-item>'+content(v)+'</div>').join('')+'</div>';
if(b.type==='chain')return '<ol class="meaning-block block-chain" data-block="chain">'+items.map(v=>'<li data-reveal-item><span class="chain-arrow" aria-hidden="true">←</span><div>'+content(v)+'</div></li>').join('')+'</ol>';
if(b.type==='steps'||b.type==='list')return '<'+(b.type==='steps'?'ol':'ul')+' class="meaning-block block-'+b.type+'" data-block="'+b.type+'">'+items.map(v=>'<li data-reveal-item>'+content(v)+'</li>').join('')+'</'+(b.type==='steps'?'ol':'ul')+'>';
return render(b.text??'')}).join('')}
let observer,timers=new Set(),manual=false;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function elements(root){return [...root.querySelectorAll('[data-reveal-item]')].filter(e=>!e.classList.contains('is-shown'))}
function reveal(root,instant=false){if(instant||reduced())root.classList.add('reveal-instant');const els=elements(root);els.forEach((el,i)=>{if(instant||reduced())el.classList.add('is-shown');else{const t=setTimeout(()=>{el.classList.add('is-shown');timers.delete(t)},i*500);timers.add(t)}});return reduced()||instant?0:els.length*500}
function observe(root=document){if(reduced())root.querySelectorAll('[data-branch]').forEach(b=>{b.setAttribute('aria-expanded','true');b.nextElementSibling?.classList.add('detail-open')});observer?.disconnect();observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!manual){reveal(e.target);observer.unobserve(e.target)}}),{threshold:.08});root.querySelectorAll('[data-block]').forEach(b=>{b.classList.add('reveal-ready');if(reduced())reveal(b,true);else observer.observe(b)})}
function control(value){manual=value;timers.forEach(clearTimeout);timers.clear();if(!value)observe()}
function leave(){observer?.disconnect();timers.forEach(clearTimeout);timers.clear();manual=false}
document.addEventListener('click',e=>{const b=e.target.closest('[data-branch]');if(!b)return;const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',open);b.nextElementSibling?.classList.toggle('detail-open',open);b.querySelector('.branch-tap').textContent=open?'− اقفل الفكرة':'＋ افتح الفكرة'});
return {esc,inline,render,plain,strip,observe,reveal,control,leave,elements};
})();
