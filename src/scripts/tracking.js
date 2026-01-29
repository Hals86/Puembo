export function initTracking() {
    // WhatsApp Click Tracking
    document.querySelectorAll(".cta-whatsapp").forEach((button) => {
        button.addEventListener("click", () => {
            if (typeof window.gtag === "function") {
                window.gtag("event", "conversion", {
                    send_to: "AW-CONVERSION_ID/LABEL", // Note: This placeholders are usually replaced by env vars or actual values if known
                    event_category: "Lead",
                    event_label: "WhatsApp Click",
                });
            }
            if (typeof window.fbq === "function") {
                window.fbq("track", "Contact");
            }
            if (typeof window.ttq === "function" && typeof window.ttq.track === "function") {
                window.ttq.track("ClickButton");
            }
        });
    });
}
