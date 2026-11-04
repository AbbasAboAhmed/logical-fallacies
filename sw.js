/* Regenerate the cache version whenever site assets change. */
const CACHE='fallacies-v5-f58247a97b24';
const ASSETS=[
  "./",
  "./.nojekyll",
  "./assets/app.js",
  "./assets/blocks.js",
  "./assets/glossary.js",
  "./assets/round5.css",
  "./assets/playback.js",
  "./assets/favicon.svg",
  "./assets/fonts/Cairo-license.txt",
  "./assets/fonts/Cairo-Variable.ttf",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/og.html",
  "./assets/og.png",
  "./assets/reader.css",
  "./assets/reader.js",
  "./assets/sheets/01.webp",
  "./assets/sheets/02.webp",
  "./assets/sheets/03.webp",
  "./assets/sheets/04.webp",
  "./assets/sheets/05.webp",
  "./assets/sheets/06.webp",
  "./assets/sheets/07.webp",
  "./assets/sheets/08.webp",
  "./assets/sheets/09.webp",
  "./assets/sheets/10.webp",
  "./assets/sheets/11.webp",
  "./assets/sheets/12.webp",
  "./assets/styles.css",
  "./content/00-intro.js",
  "./content/01.js",
  "./content/02.js",
  "./content/03.js",
  "./content/04.js",
  "./content/05.js",
  "./content/06.js",
  "./content/07.js",
  "./content/08.js",
  "./content/09.js",
  "./content/10.js",
  "./content/11.js",
  "./content/12.js",
  "./content/13.js",
  "./content/14.js",
  "./content/15.js",
  "./content/16.js",
  "./content/17.js",
  "./content/18.js",
  "./content/19.js",
  "./content/20.js",
  "./content/21.js",
  "./content/22.js",
  "./content/23.js",
  "./content/24.js",
  "./content/25.js",
  "./content/26.js",
  "./content/27.js",
  "./content/28.js",
  "./content/29.js",
  "./content/30.js",
  "./content/31.js",
  "./content/32.js",
  "./content/33.js",
  "./content/34.js",
  "./content/35.js",
  "./content/_index.js",
  "./index.html",
  "./manifest.webmanifest",
  "./site-config.js"
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>/^fallacies-v[345]-/.test(key)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)))}return response}).catch(async()=>{
  const hit=await caches.match(event.request,{ignoreSearch:true});
  if(hit)return hit;
  if(event.request.mode==='navigate')return caches.match(new URL('index.html',scope).href);
  return Response.error();
 }));
});
