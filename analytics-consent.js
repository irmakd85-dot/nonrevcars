/* NonRevCars draft analytics consent controller.
 * Basic consent mode: no GA network request before opt-in.
 * IMPORTANT: Does not gate MailerLite or CarRentalNet iframe integrations.
 * Deployment remains blocked pending a full third-party consent review.
 */
(function () {
  'use strict';
  var id = 'G-VC3NBFLV23';
  var key = 'nrc-analytics-consent-v1';
  var choice = null;
  try { choice = localStorage.getItem(key); } catch (_) {}
  function loadAnalytics() {
    if (window.__nrcAnalyticsLoaded) return;
    window.__nrcAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted'
    });
    window.gtag('js', new Date());
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('config', id);
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
  }
  if (choice === 'accepted') loadAnalytics();
  function saveChoice(value) {
    try { localStorage.setItem(key, value); } catch (_) {}
    // A reload applies withdrawal before any Google tag can execute on the new page.
    location.reload();
  }
  function create(tag, attrs, content) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) { el.setAttribute(key, attrs[key]); });
    if (content != null) el.textContent = content;
    return el;
  }
  function init() {
    var css = create('style', {}, [
      '.nrc-privacy-settings{position:fixed;bottom:12px;left:12px;z-index:2147483000;font:600 12px system-ui,sans-serif;padding:9px 12px;border-radius:20px;background:#0A1626;color:#fff;border:1px solid #E0A93E;cursor:pointer}',
      '.nrc-consent{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:2147483001;width:min(640px,calc(100vw - 32px));padding:20px;border-radius:14px;box-shadow:0 12px 45px #0006;border:1px solid #E0A93E;background:#fff;color:#12202E;font:15px/1.5 system-ui,sans-serif}',
      '.nrc-consent h2{font:700 19px/1.3 system-ui,sans-serif;margin:0 0 9px;color:#12202E}',
      '.nrc-consent p{margin:0 0 12px}',
      '.nrc-consent a{color:#114b79;text-decoration:underline}',
      '.nrc-consent-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}',
      '.nrc-consent-actions button{flex:1 1 145px;border-radius:22px;padding:10px 12px;border:1px solid #0A1626;font:600 14px system-ui,sans-serif;cursor:pointer}',
      '.nrc-accept{background:#E0A93E;color:#0A1626}',
      '.nrc-reject{background:white;color:#0A1626}'
    ].join(''));
    document.head.appendChild(css);
    var panel = create('section', { class: 'nrc-consent', role: 'dialog', 'aria-label': 'Analytics preferences', 'aria-modal': 'false' });
    panel.appendChild(create('h2', {}, 'Your privacy choices'));
    var description = create('p', {}, 'We would like to use optional Google Analytics cookies to understand site visits and booking-link clicks. You can accept or reject analytics without affecting access to our website. ');
    var link = create('a', { href: '/privacy.html' }, 'Read our privacy notice');
    description.appendChild(link);
    panel.appendChild(description);
    var controls = create('div', { class: 'nrc-consent-actions' });
    var reject = create('button', { type: 'button', class: 'nrc-reject' }, 'Reject analytics');
    var accept = create('button', { type: 'button', class: 'nrc-accept' }, 'Accept analytics');
    reject.addEventListener('click', function () { saveChoice('rejected'); });
    accept.addEventListener('click', function () { saveChoice('accepted'); });
    controls.appendChild(reject);controls.appendChild(accept);panel.appendChild(controls);
    var settings = create('button', { type: 'button', class: 'nrc-privacy-settings', 'aria-label': 'Change analytics privacy preferences' }, 'Privacy settings');
    settings.addEventListener('click', function () { panel.hidden = !panel.hidden; });
    panel.hidden = choice === 'accepted' || choice === 'rejected';
    document.body.appendChild(panel);
    document.body.appendChild(settings);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
