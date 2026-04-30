/**
 * Project pages: hide the fixed site header when scrolling down, show when scrolling up.
 */
(function () {
    var header = document.querySelector(".main.main--project .site-header");
    if (!header) return;

    var lastY = window.scrollY || document.documentElement.scrollTop || 0;
    /** Show bar within this px of viewport top */
    var topRevealPx = 40;
    /** Min px movement (1px) to count as scroll direction; ignores sub-1px jitter */
    var directionThresholdPx = 1;

    function onScroll() {
        var y = window.scrollY || document.documentElement.scrollTop || 0;
        var delta = y - lastY;

        if (y <= topRevealPx) {
            header.classList.remove("site-header--hidden");
        } else if (delta >= directionThresholdPx) {
            header.classList.add("site-header--hidden");
        } else if (delta <= -directionThresholdPx) {
            header.classList.remove("site-header--hidden");
        }
        lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
})();
