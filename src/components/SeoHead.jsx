import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://lifelinemedsup.com";
const DEFAULT_TITLE = "Lifeline Medical Supplies | Trust. Quality. Reliable supply.";
const DEFAULT_DESCRIPTION = "Medical supplies, made easier to source. Contact Lifeline Medical Supplies for product availability and quotations.";
const SHARE_IMAGE = `${SITE_URL}/lifeline-social-card.jpg`;

const routeMeta = [
    { match: /^\/$/, title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
    { match: /^\/(shop|products)\/?$/, title: "Medical Supplies & Healthcare Products | Lifeline Medical Supplies", description: "Browse healthcare supplies and medical products from Lifeline Medical Supplies." },
    { match: /^\/about\/?$/, title: "About Lifeline Medical Supplies", description: "Learn how Lifeline Medical Supplies helps organisations source dependable healthcare supplies." },
    { match: /^\/offers\/?$/, title: "Medical Supply Offers | Lifeline Medical Supplies", description: "Explore current medical supply offers from Lifeline Medical Supplies." },
    { match: /^\/contact\/?$/, title: "Contact Lifeline Medical Supplies", description: "Contact Lifeline Medical Supplies for product availability, quotations, and supply enquiries." },
    { match: /^\/single\//, title: "Healthcare Product Details | Lifeline Medical Supplies", description: "View product information, variants, pricing, and availability from Lifeline Medical Supplies." },
];

function setMeta(attribute, value, content) {
    let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
}

function SeoHead() {
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname || "/";
        const metadata = routeMeta.find((route) => route.match.test(pathname)) || {
            title: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
        };
        const canonicalUrl = `${SITE_URL}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;

        document.title = metadata.title;
        setMeta("name", "description", metadata.description);
        setMeta("property", "og:title", metadata.title);
        setMeta("property", "og:description", metadata.description);
        setMeta("property", "og:url", canonicalUrl);
        setMeta("property", "og:image", SHARE_IMAGE);
        setMeta("name", "twitter:title", metadata.title);
        setMeta("name", "twitter:description", metadata.description);
        setMeta("name", "twitter:image", SHARE_IMAGE);

        let canonical = document.head.querySelector("link[rel=canonical]");
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;
    }, [location.pathname]);

    return null;
}

export default SeoHead;
