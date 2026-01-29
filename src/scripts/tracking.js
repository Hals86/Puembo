export function initTracking() {
    const GA_ID = import.meta.env.PUBLIC_GA4_ID;
    const META_ID = import.meta.env.PUBLIC_META_PIXEL_ID;
    const TIKTOK_ID = import.meta.env.PUBLIC_TIKTOK_PIXEL_ID;

    // --- Google Analytics 4 ---
    if (GA_ID) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    // --- Meta Pixel ---
    if (META_ID) {
        !(function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod
                    ? n.callMethod.apply(n, arguments)
                    : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = "2.0";
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(
            window,
            document,
            "script",
            "https://connect.facebook.net/en_US/fbevents.js",
        );
        fbq("init", META_ID);
        fbq("track", "PageView");
    }

    // --- TikTok Pixel ---
    if (TIKTOK_ID) {
        !(function (w, d, t) {
            w.TiktokAnalyticsObject = t;
            var ttq = (w[t] = w[t] || []);
            ((ttq.methods = [
                "page",
                "track",
                "identify",
                "instances",
                "debug",
                "on",
                "off",
                "once",
                "ready",
                "alias",
                "group",
                "enableCookie",
                "disableCookie",
            ]),
                (ttq.setAndDefer = function (t, e) {
                    t[e] = function () {
                        t.push(
                            [e].concat(
                                Array.prototype.slice.call(arguments, 0),
                            ),
                        );
                    };
                }));
            for (var i = 0; i < ttq.methods.length; i++)
                ttq.setAndDefer(ttq, ttq.methods[i]);
            ((ttq.instance = function (t) {
                for (
                    var e = ttq.methods[(i = 0)];
                    i < ttq.methods.length;
                    i++
                )
                    ttq.setAndDefer(t, ttq.methods[i]);
                return t;
            }),
                (ttq.load = function (e, n) {
                    var i =
                        "https://analytics.tiktok.com/i18n/pixel/events.js";
                    ((ttq._i = ttq._i || {}),
                        (ttq._i[e] = []),
                        (ttq._i[e]._u = i),
                        (ttq._t = ttq._t || {}),
                        (ttq._t[e] = +new Date()),
                        (ttq._o = ttq._o || {}),
                        (ttq._o[e] = n || {}));
                    var o = document.createElement("script");
                    ((o.type = "text/javascript"),
                        (o.async = !0),
                        (o.src = i + "?sdkid=" + e + "&lib=" + t));
                    var a = document.getElementsByTagName("script")[0];
                    a.parentNode.insertBefore(o, a);
                }));
            ttq.load(TIKTOK_ID);
            ttq.page();
        })(window, document, "ttq");
    }

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
