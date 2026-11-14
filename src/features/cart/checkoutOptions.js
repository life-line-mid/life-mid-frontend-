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
        const variantDetails = [
            item.size ? `${item.unit_type || "Option"}: ${item.size}` : item.unit_type,
            item.color ? `Color: ${item.color}` : "",
        ].filter(Boolean);
        const variant = variantDetails.length ? ` (${variantDetails.join(", ")})` : "";
        const lineTotal = item.total_price !== null && item.total_price !== undefined
            ? ` = AED ${Number(item.total_price || 0).toFixed(2)}`
            : "";
        return `- ${item.product_name || "Product"}${variant} x ${item.quantity}${lineTotal}`;
    });

    return [
        "Hello Team,",
        "",
        orderId
            ? `I placed an order via WhatsApp. Order: ORD-${String(orderId).padStart(6, "0")}`
            : "I would like to place this order via WhatsApp.",
        "",
        "Items:",
        ...itemLines,
        "",
        `Total: AED ${Number(total || 0).toFixed(2)}`,
        "",
        "Delivery address:",
        `Name: ${address.full_name || ""}`,
        `Phone: ${address.phone || ""}`,
        `Address: ${address.address_line || ""}`,
        `City/Emirate: ${address.city || ""}${address.emirate ? `, ${address.emirate}` : ""}`,
        `Postal code: ${address.postal_code || ""}`,
        `Country: ${address.country || ""}`,
    ].join("\n");
}

export function buildWhatsAppCheckoutUrl({ orderId, address, items, total }) {
    if (!CHECKOUT_WHATSAPP_NUMBER) {
        throw new Error("WhatsApp checkout is not configured.");
    }

    const message = buildWhatsAppCheckoutMessage({ orderId, address, items, total });
    return `https://wa.me/${CHECKOUT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
