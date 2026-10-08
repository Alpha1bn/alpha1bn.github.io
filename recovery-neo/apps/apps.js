/* Apps by ATOLL — shared script for /recovery-neo/apps/ (all 10 locale pages).
 *
 * SINGLE TOGGLE — Recovery Neo on Google Play (new package com.atoll.recovery_neo)
 * ----------------------------------------------------------------------------
 * Flip `recoveryNeoAndroidLive` to true once the listing is live. On every
 * page load this script then (a) removes the `.badge-soon` element inside
 * `[data-app="recovery-neo"]` and (b) shows the Android button as a normal
 * button (drops the muted `btn-soon` class and `aria-describedby`). While
 * `false`, the button is muted with the badge announced through
 * `aria-describedby`, and `href` stays set so a QR-code visitor can still tap
 * through once the store page exists (QA_v1.5.1 Q-21: no `aria-disabled` on a
 * working link). No HTML needs to change in any of the 10 pages.
 */
const RN_APPS_STATUS = { recoveryNeoAndroidLive: false };
const RN_PLAY_URL = "https://play.google.com/store/apps/details?id=com.atoll.recovery_neo";

(function () {
  "use strict";

  function applyStatus() {
    var card = document.querySelector('[data-app="recovery-neo"]');
    if (!card) return;
    var link = card.querySelector('a[data-store="android"]');
    var badge = card.querySelector(".badge-soon");
    if (link && !link.getAttribute("href")) link.setAttribute("href", RN_PLAY_URL);
    if (link) link.removeAttribute("aria-disabled");
    if (RN_APPS_STATUS.recoveryNeoAndroidLive) {
      if (badge) badge.parentNode.removeChild(badge);
      if (link) {
        link.classList.remove("btn-soon");
        link.removeAttribute("aria-describedby");
        link.setAttribute("href", RN_PLAY_URL);
      }
    } else if (link) {
      link.classList.add("btn-soon");
      if (badge && badge.id) link.setAttribute("aria-describedby", badge.id);
    }
  }

  /* Language auto-select: English root page only (<html data-locale="en"
   * data-auto-redirect="1">). Runs once per browser session, skipped when the
   * URL carries ?lang=keep (the English link in every language nav). */
  var LOCALES = ["ko", "ja", "zh-CN", "de", "es", "fr", "ru", "hi", "sw"];
  function pickLocale(langs) {
    for (var i = 0; i < langs.length; i++) {
      var tag = String(langs[i] || "").toLowerCase();
      if (!tag) continue;
      if (tag === "en" || tag.indexOf("en-") === 0) return null;
      if (tag.indexOf("zh") === 0) return "zh-CN";
      var two = tag.split("-")[0];
      for (var k = 0; k < LOCALES.length; k++) {
        if (LOCALES[k].toLowerCase() === two) return LOCALES[k];
      }
    }
    return null;
  }
  function autoRedirect() {
    var root = document.documentElement;
    if (root.getAttribute("data-locale") !== "en") return;
    if (root.getAttribute("data-auto-redirect") !== "1") return;
    if (/[?&]lang=keep(&|$)/.test(location.search)) return;
    var KEY = "rn-apps-lang-redirected";
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch (e) { return; }
    var langs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];
    var loc = pickLocale(langs);
    try { sessionStorage.setItem(KEY, "1"); } catch (e) { /* ignore */ }
    if (loc) location.replace(loc + "/");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { applyStatus(); autoRedirect(); });
  } else {
    applyStatus();
    autoRedirect();
  }
})();
