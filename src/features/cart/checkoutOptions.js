export const CHECKOUT_PAYMENT_METHOD = "WHATSAPP";

export const CHECKOUT_PAYMENT_OPTIONS = Object.freeze([
    {
        value: CHECKOUT_PAYMENT_METHOD,
        title: "Order through WhatsApp",
        description: "Open WhatsApp with your order details ready to send.",
    },
]);

// Checkout must always open the business WhatsApp chat directly.
export const CHECKOUT_WHATSAPP_NUMBER = "971562637379";

export function buildWhatsAppCheckoutMessage({ orderId, address = {}, items = [], total }) {
    const itemLines = items.map((item) => {
        const variant = item.variant_size !== null && item.size
            ? `, ${item.unit_type || "Option"}: ${item.size}`
            : "";
        return `- ${item.product_name}${variant} x ${item.quantity}`;
    });

    return [
        "Hello Team,",
        "",
        `I placed an order via WhatsApp. Order: ORD-${String(orderId).padStart(6, "0")}`,
        "",
        "Items:",
        ...itemLines,
        "",
        `Total: AED ${Number(total || 0).toFixed(2)}`,
        "",
        "Delivery address:",
        address.full_name,
        address.phone,
        address.address_line,
        `${address.city || ""}${address.emirate ? `, ${address.emirate}` : ""}${address.postal_code ? `, ${address.postal_code}` : ""}`,
        address.country,
    ].join("\n");
}

export function buildWhatsAppCheckoutUrl({ orderId, address, items, total }) {
    if (!CHECKOUT_WHATSAPP_NUMBER) {
        throw new Error("WhatsApp checkout is not configured.");
    }

    const message = buildWhatsAppCheckoutMessage({ orderId, address, items, total });
    return `https://wa.me/${CHECKOUT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
