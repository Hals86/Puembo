export function initScrollTracking() {
    // Header Scroll Effect (UI)
    const header = document.querySelector("header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("shadow-md");
            } else {
                header.classList.remove("shadow-md");
            }
        });
    }

    // Scroll Tracking (Analytics)
    let scrollTracked = false;
    window.addEventListener("scroll", () => {
        if (!scrollTracked) {
            const scrollPercent =
                ((window.scrollY + window.innerHeight) /
                    document.documentElement.scrollHeight) *
                100;
            if (scrollPercent >= 50) {
                scrollTracked = true;
                if (typeof window.gtag === "function") {
                    window.gtag("event", "scroll_50_percent", {
                        event_category: "Engagement",
                        event_label: "Scrolled 50%",
                    });
                }
            }
        }
    });
}
