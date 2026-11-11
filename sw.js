/* Funciona sem internet depois da primeira visita (precisa de HTTPS).
   Subir VERSAO sempre que qualquer ficheiro do site mudar. */
var VERSAO = "20261111-2";
var CACHE = "formalab-site-" + VERSAO;
var FICHEIROS = ["./", "index.html", "orcamento.html", "orcamento.css", "orcamento.mjs", "pricing.mjs", "inclui.mjs",
  "portfolio-interativo.js", "demo.html", "demo.css", "demo.mjs", "core.mjs", "manifest.webmanifest", "img/digital-lab.png", "img/formalab.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FICHEIROS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("formalab-site-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== self.location.origin) return; // serviços externos (ex.: estilos do portefólio) seguem pela rede
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(function (hit) {
    if (hit) return hit;
    var p = u.pathname.replace(/\/$/, "");
    if (p && !/\.[a-z0-9]+$/i.test(p)) return caches.match(p.replace(/^.*\//, "") + ".html"); // endereços limpos: /orcamento -> orcamento.html
    return fetch(r).catch(function () { return caches.match("index.html"); });
  }).then(function (res) { return res || fetch(r); }));
});
