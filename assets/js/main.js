/* Shared UI: mobile nav toggle + live cart-badge sync. Runs on every page. */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // --- cart badge (text only, no HTML injection) ---
    var badges = document.querySelectorAll("[data-cart-badge]");
    if (window.Cart && badges.length) {
      window.Cart.subscribe(function () {
        var c = window.Cart.count();
        var label = c > 0 ? " (" + c + ")" : "";
        badges.forEach(function (el) {
          el.textContent = label;
        });
      });
    }

    // --- mobile nav toggle ---
    var toggle = document.querySelector("[data-nav-toggle]");
    var links = document.querySelector("[data-nav-links]");
    if (toggle && links) {
      var mq = window.matchMedia("(max-width: 720px)");
      var sync = function () {
        if (mq.matches) {
          links.hidden = true;
          toggle.setAttribute("aria-expanded", "false");
        } else {
          links.hidden = false;
        }
      };
      sync();
      (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(sync);
      toggle.addEventListener("click", function () {
        var open = links.hidden;
        links.hidden = !open;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      links.addEventListener("click", function (e) {
        if (mq.matches && e.target.closest("a")) {
          links.hidden = true;
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  });
})();
