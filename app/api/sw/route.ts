import { NextResponse } from 'next/server'

const SW_CODE = `
const CACHE_NAME='rv-v1';const EMERGENCY_CACHE='rv-emergency-v1';
const EMERGENCY_PATHS=['/notfall','/api/emergency/','/api/risk/'];
const STATIC_EXT=['.js','.css','.png','.svg','.ico','.woff','.woff2'];
const NETWORK_ONLY=['/api/news','/news'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(['/','/dashboard','/notfall'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME&&x!==EMERGENCY_CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
if(NETWORK_ONLY.some(p=>u.pathname.startsWith(p))){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));return}
if(EMERGENCY_PATHS.some(p=>u.pathname.startsWith(p))){e.respondWith(caches.open(EMERGENCY_CACHE).then(c=>c.match(e.request).then(m=>{const f=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>m);return m||f})));return}
if(STATIC_EXT.some(x=>u.pathname.endsWith(x))){e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok){const cl=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cl))}return r})));return}
e.respondWith(fetch(e.request).then(r=>{if(r.ok&&(r.headers.get('content-type')||'').includes('text/html')){const cl=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cl))}return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match('/'))))});
`

export async function GET() {
  return new NextResponse(SW_CODE, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache',
      'Service-Worker-Allowed': '/',
    },
  })
}
