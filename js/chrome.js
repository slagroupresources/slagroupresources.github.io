// Shared page behavior: header dropdowns, the phone menu, and sharing the site.
(function () {
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var SITE = 'https://www.slagroupresources.com/';

  // Dropdowns: click to open, close on outside click or Escape
  var dds = $$('.dd');
  function closeMenus(except) {
    dds.forEach(function (d) { if (d !== except) { d.classList.remove('open'); d.querySelector('button').setAttribute('aria-expanded', 'false'); } });
  }
  dds.forEach(function (d) {
    var b = d.querySelector('button');
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !d.classList.contains('open');
      closeMenus(d); d.classList.toggle('open', open); b.setAttribute('aria-expanded', String(open));
    });
    d.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { closeMenus(); }); });
  });
  document.addEventListener('click', function () { closeMenus(); });

  // Phone menu
  var toggle = document.querySelector('.menu-toggle'), panel = document.getElementById('mobile-menu');
  function setPanel(open) { if (!toggle) return; panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close' : 'Menu'; }
  if (toggle) {
    toggle.addEventListener('click', function (e) { e.stopPropagation(); setPanel(panel.hidden); });
    panel.addEventListener('click', function (e) { e.stopPropagation(); if (e.target.closest('a')) setPanel(false); });
  }

  // Escape closes any open menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenus(); setPanel(false); }
  });

  // Share the site: phone share sheet where available, otherwise copy the link
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200);
  }
  function copyLink() {
    var done = function () { toast('Link copied'); };
    if (navigator.clipboard) navigator.clipboard.writeText(SITE).then(done, function () { toast(SITE); }); else toast(SITE);
  }
  $$('[data-share]').forEach(function (b) { b.addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    if (navigator.share) navigator.share({ title: 'SLA Group Resources', text: 'Free, private resources for sex addiction recovery and healing after betrayal', url: SITE }).catch(function () {});
    else copyLink();
  }); });
  $$('[data-copy]').forEach(function (b) { b.addEventListener('click', copyLink); });
})();
