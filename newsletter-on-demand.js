/* Load MailerLite only when a visitor chooses to open the newsletter form.
   This does not change independent Google Analytics preferences. */
(function () {
  'use strict';
  var ACCOUNT = '2399747';
  var loading = false;
  var loaded = false;
  var waiting = [];

  function loadMailerLite(done) {
    if (loaded) { done(true); return; }
    waiting.push(done);
    if (loading) return;
    loading = true;
    // Match MailerLite's documented bootstrap order: queue the account call
    // before the asynchronously loaded Universal script executes.
    window.ml = window.ml || function () {
      (window.ml.q = window.ml.q || []).push(arguments);
    };
    window.ml('account', ACCOUNT);
    var s = document.createElement('script');
    s.src = 'https://assets.mailerlite.com/js/universal.js';
    s.async = true;
    s.onload = function () {
      loaded = true;
      loading = false;
      waiting.splice(0).forEach(function (callback) { callback(true); });
    };
    s.onerror = function () {
      loading = false;
      waiting.splice(0).forEach(function (callback) { callback(false); });
    };
    document.head.appendChild(s);
  }

  function initialise() {
    document.querySelectorAll('.ml-embedded[data-form]').forEach(function (form) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Open newsletter signup';
      button.setAttribute('aria-label', 'Open newsletter subscription form');
      button.style.cssText = 'padding:12px 22px;border:1px solid #e0a93e;border-radius:24px;background:#e0a93e;color:#0a1626;font:600 15px system-ui;cursor:pointer;';
      var message = document.createElement('p');
      message.setAttribute('role', 'status');
      message.style.cssText = 'font:14px system-ui;margin:8px 0;';
      form.parentNode.insertBefore(button, form);
      form.parentNode.insertBefore(message, form);
      button.addEventListener('click', function () {
        button.disabled = true;
        button.textContent = 'Loading signup form…';
        message.textContent = '';
        loadMailerLite(function (ok) {
          if (ok) {
            button.hidden = true;
            message.textContent = '';
          } else {
            button.disabled = false;
            button.textContent = 'Try opening signup again';
            message.textContent = 'Could not load the signup form. Please try again.';
          }
        });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
  else initialise();
}());
