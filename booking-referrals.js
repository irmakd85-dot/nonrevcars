/* NonRevCars: count direct booking-engine referrals only.
 * Embedded CarRentalNet iframe interactions are not observable from this page.
 * No personal information is included in this event.
 */
(function () {
  document.addEventListener('click', function (event) {
    var anchor = event.target && event.target.closest && event.target.closest('a[href]');
    if (!anchor) return;
    var destination;
    try { destination = new URL(anchor.href, window.location.href); }
    catch (_) { return; }
    if (destination.hostname !== 'airlinecarrentals.carrentalnet.com') return;
    // The booking homepage is a new-search referral; customer support links are excluded.
    if (destination.pathname !== '/' && destination.pathname !== '') return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'booking_referral', {
      booking_partner: 'CarRentalNet',
      referral_page: window.location.pathname,
      booking_link_label: (anchor.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80)
    });
  }, true);
}());
