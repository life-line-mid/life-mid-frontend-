import { describe, expect, it } from "vitest";
import {
    buildWhatsAppCheckoutMessage,
    buildWhatsAppCheckoutUrl,
    CHECKOUT_PAYMENT_METHOD,
    CHECKOUT_PAYMENT_OPTIONS,
    CHECKOUT_WHATSAPP_NUMBER,
} from "./checkoutOptions";

describe("WhatsApp-only checkout", () => {
    it("exposes WhatsApp as the only checkout method", () => {
        expect(CHECKOUT_PAYMENT_METHOD).toBe("WHATSAPP");
        expect(CHECKOUT_PAYMENT_OPTIONS.map((option) => option.value)).toEqual(["WHATSAPP"]);
    });

    it("uses the fixed WhatsApp number and includes customer details", () => {
        const address = {
            full_name: "Azhar",
            phone: "+971 50 000 0000",
            address_line: "Al Nahda",
            city: "Dubai",
            emirate: "Dubai",
            postal_code: "00000",
            country: "UAE",
        };
        const items = [{ product_name: "Nitrile Gloves", quantity: 2, variant_size: null }];

        const message = buildWhatsAppCheckoutMessage({
            orderId: 12,
            address,
            items,
            total: "25.50",
        });
        const url = buildWhatsAppCheckoutUrl({ orderId: 12, address, items, total: "25.50" });

        expect(CHECKOUT_WHATSAPP_NUMBER).toBe("971562637379");
        expect(url).toContain("https://wa.me/971562637379?text=");
        expect(message).toContain("Azhar");
        expect(message).toContain("Al Nahda");
        expect(message).toContain("Dubai, Dubai, 00000");
        expect(decodeURIComponent(url)).toContain("Nitrile Gloves");
    });
});
