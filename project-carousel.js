/**
 * Project page horizontal carousels: keyboard, half-width click to step,
 * drag vs click, custom arrow cursors. Binds each `.project-page .project-carousel .media-carousel`.
 *
 * Markup: put `class="row project-carousel"` on the <section> (see other.html).
 * Cursor art: `assets/cursor/arrow_left.svg` & `arrow_right.svg` (relative to page URL).
 */
(function () {
    function isMousePointer(e) {
        return e.pointerType === "mouse" || e.pointerType === "" || e.pointerType == null;
    }

    function initTrack(track) {
        if (!track || track.getAttribute("data-project-carousel-init") === "1") {
            return;
        }
        track.setAttribute("data-project-carousel-init", "1");

        var curLeft = 'url("assets/cursor/arrow_left.svg") 11 4, auto';
        var curRight = 'url("assets/cursor/arrow_right.svg") 11 4, auto';

        function getStep() {
            var first = track.querySelector(".media-carousel__slide");
            if (!first) return 0;
            var gap = parseFloat(getComputedStyle(track).getPropertyValue("--media-strip-gap")) || 20;
            return first.offsetWidth + gap;
        }

        function maxScroll() {
            return track.scrollWidth - track.clientWidth;
        }

        var pointerDownX = 0;
        var pointerDownY = 0;
        var wasDrag = false;
        var dragThreshold = 6;
        var lastPointer = null;

        function setCursorFromEvent(e) {
            if (!isMousePointer(e)) return;
            var rect = track.getBoundingClientRect();
            if (rect.width < 1) return;
            var x = e.clientX - rect.left;
            var half = rect.width / 2;
            var m = maxScroll();
            var sl = track.scrollLeft;
            if (x < 0 || x > rect.width) {
                track.style.cursor = "default";
                return;
            }
            if (x < half) {
                track.style.cursor = sl > 1 ? curLeft : "default";
            } else {
                track.style.cursor = m > 0 && sl < m - 1 ? curRight : "default";
            }
        }

        track.addEventListener("keydown", function (e) {
            var step = getStep();
            if (step === 0) return;
            if (e.key === "ArrowRight") {
                e.preventDefault();
                track.scrollBy({ left: step, behavior: "smooth" });
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                track.scrollBy({ left: -step, behavior: "smooth" });
            }
        });

        track.addEventListener("pointerdown", function (e) {
            if (!isMousePointer(e)) return;
            pointerDownX = e.clientX;
            pointerDownY = e.clientY;
            wasDrag = false;
        });
        track.addEventListener("pointermove", function (e) {
            if (isMousePointer(e)) {
                lastPointer = { clientX: e.clientX, clientY: e.clientY, pointerType: e.pointerType };
            }
            if (isMousePointer(e) && e.buttons) {
                if (
                    Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY) > dragThreshold
                ) {
                    wasDrag = true;
                }
            }
            setCursorFromEvent(e);
        });
        track.addEventListener("mouseleave", function () {
            lastPointer = null;
            track.style.cursor = "";
        });
        track.addEventListener("scroll", function () {
            if (!lastPointer) return;
            setCursorFromEvent(lastPointer);
        });
        track.addEventListener("click", function (e) {
            if (!isMousePointer(e)) return;
            if (wasDrag) {
                wasDrag = false;
                return;
            }
            var step = getStep();
            if (step === 0) return;
            var rect = track.getBoundingClientRect();
            if (rect.width < 1) return;
            var x = e.clientX - rect.left;
            var half = rect.width / 2;
            var m = maxScroll();
            var sl = track.scrollLeft;
            if (x < half) {
                if (sl > 1) track.scrollBy({ left: -step, behavior: "smooth" });
            } else {
                if (m > 0 && sl < m - 1) track.scrollBy({ left: step, behavior: "smooth" });
            }
        });
    }

    function initAll() {
        document
            .querySelectorAll(".project-page .project-carousel .media-carousel")
            .forEach(initTrack);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }
})();
