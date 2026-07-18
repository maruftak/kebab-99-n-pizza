/* Contact form — client-side validation + confirmation. No backend;
   the submitted name is echoed with textContent only (never innerHTML). */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var nameEl = document.getElementById("cf-name");
    var emailEl = document.getElementById("cf-email");
    var msgEl = document.getElementById("cf-message");
    var emailErr = document.getElementById("cf-email-err");
    var sent = document.getElementById("cf-sent");
    var sentName = document.getElementById("cf-sent-name");

    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    emailEl.addEventListener("input", function () {
      emailErr.hidden = !(emailEl.value.length && !EMAIL.test(emailEl.value.trim()));
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = nameEl.value.trim();
      var email = emailEl.value.trim();
      var message = msgEl.value.trim();
      if (name.length < 2 || !EMAIL.test(email) || message.length < 1) {
        emailErr.hidden = EMAIL.test(email);
        if (name.length < 2) nameEl.focus();
        else if (!EMAIL.test(email)) emailEl.focus();
        else msgEl.focus();
        return;
      }
      sentName.textContent = name.slice(0, 80);
      form.hidden = true;
      sent.hidden = false;
    });
  });
})();
