/* KRIYĀ Systems · cookie and storage notice.
   No tracking or advertising cookies are set anywhere on this site. The only thing that can be
   stored is the concepts page remembering a visitor's choices, and only after they accept.
   The visitor's answer itself is kept in localStorage ("kriya_consent"); that is strictly necessary.
   Public API: KriyaConsent.allows() -> true when the visitor accepted, KriyaConsent.on(fn), KriyaConsent.open(). */
(function () {
  "use strict";
  var KEY = "kriya_consent", value = null, listeners = [], el = null;
  try { value = localStorage.getItem(KEY); } catch (e) {}

  var css =
    ".kc{position:fixed;z-index:1000;left:max(16px,env(safe-area-inset-left,0px));bottom:max(16px,env(safe-area-inset-bottom,0px));" +
    "width:min(440px,calc(100vw - 32px));padding:18px 18px 16px;border-radius:18px;background:var(--raise,#2A2722);color:var(--text,#E6DCC3);" +
    "border:1px solid var(--line,rgba(230,220,195,.14));box-shadow:0 24px 60px rgba(0,0,0,.4);font:15px/1.5 var(--display,'Syne',system-ui,sans-serif);" +
    "animation:kcIn .45s cubic-bezier(.16,1,.3,1) both}" +
    "@keyframes kcIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}" +
    ".kc h2{margin:0 0 6px;font-size:16px;font-weight:600;letter-spacing:-.01em}" +
    ".kc p{margin:0;color:var(--sub,#B3AA97);font-size:14px}" +
    ".kc-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}" +
    ".kc button{min-height:44px;padding:0 16px;border-radius:10px;font:600 14px/1 var(--display,'Syne',system-ui,sans-serif);cursor:pointer;" +
    "border:1px solid var(--line,rgba(230,220,195,.2));background:transparent;color:inherit;transition:background-color .2s,color .2s,border-color .2s,transform .1s}" +
    ".kc button:active{transform:scale(.98)}" +
    ".kc button.kc-yes{background:var(--signal,#4FB8A0);border-color:var(--signal,#4FB8A0);color:var(--on-signal,#15130F)}" +
    ".kc button.kc-yes:hover{background:var(--text,#E6DCC3);border-color:var(--text,#E6DCC3);color:var(--ground,#15130F)}" +
    ".kc button:not(.kc-yes):hover{border-color:var(--text,#E6DCC3)}" +
    ".kc button.kc-link{border:0;padding:0 4px;min-height:44px;text-decoration:underline;text-underline-offset:3px;color:var(--sub,#B3AA97)}" +
    ".kc button:focus-visible{outline:2px solid var(--signal,#4FB8A0);outline-offset:3px}" +
    ".kc-more{margin-top:12px;padding-top:12px;border-top:1px solid var(--line,rgba(230,220,195,.14));font-size:13px;color:var(--sub,#B3AA97)}" +
    ".kc-more dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:6px 12px}.kc-more dt{color:var(--text,#E6DCC3);font-weight:600}.kc-more dd{margin:0}" +
    "@media (prefers-reduced-motion: reduce){.kc{animation:none}}";

  function emit() { listeners.forEach(function (fn) { try { fn(value); } catch (e) {} }); }
  function save(v) {
    value = v;
    try { localStorage.setItem(KEY, v); if (v !== "all") localStorage.removeItem("kriya_concepts"); } catch (e) {}
    close(); emit();
  }
  function close() {
    if (!el) return;
    var had = el.contains(document.activeElement);
    el.remove(); el = null;
    if (had && document.getElementById("main")) document.getElementById("main").focus({ preventScroll: true });
  }
  function show(focus) {
    if (el) { if (focus) el.querySelector("button").focus(); return; }
    if (!document.getElementById("kc-css")) {
      var s = document.createElement("style"); s.id = "kc-css"; s.textContent = css; document.head.appendChild(s);
    }
    el = document.createElement("section");
    el.className = "kc"; el.setAttribute("aria-labelledby", "kc-t"); el.setAttribute("role", "region");
    el.innerHTML =
      '<h2 id="kc-t">Cookies and storage</h2>' +
      "<p>No tracking or advertising cookies, ever. If you say yes, the concepts page remembers your business name and choices in this browser.</p>" +
      '<div class="kc-more" id="kc-more" hidden><dl>' +
      "<dt>Your answer</dt><dd>Kept in this browser so we don’t ask again. Needed for the site to work.</dd>" +
      "<dt>Concept choices</dt><dd>Your business name, colour, team size and add-ons. Only with your yes. Never sent to us.</dd>" +
      "<dt>Fonts</dt><dd>Loaded from Google Fonts, which sees your IP address.</dd>" +
      "<dt>Photos</dt><dd>Concept photos load from Unsplash, which sees your IP address.</dd>" +
      "</dl></div>" +
      '<div class="kc-row"><button type="button" class="kc-yes" data-kc="all">Accept</button>' +
      '<button type="button" data-kc="essential">Essential only</button>' +
      '<button type="button" class="kc-link" data-kc="more" aria-expanded="false" aria-controls="kc-more">Details</button></div>';
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-kc]"); if (!b) return;
      var k = b.getAttribute("data-kc");
      if (k === "more") {
        var m = el.querySelector("#kc-more"), open = m.hidden;
        m.hidden = !open; b.setAttribute("aria-expanded", String(open)); b.textContent = open ? "Hide details" : "Details";
        return;
      }
      save(k);
    });
    document.body.appendChild(el);
    if (focus) el.querySelector("button").focus();
  }

  window.KriyaConsent = {
    get: function () { return value; },
    allows: function () { return value === "all"; },
    on: function (fn) { listeners.push(fn); },
    open: function () { show(true); }
  };
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-cookie-settings]"); if (!t) return;
    e.preventDefault(); show(true);
  });
  function boot() { if (!value) show(false); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
