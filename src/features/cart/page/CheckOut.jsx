import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../../lib/ApiClient";
import "../style/Checkout.css";
import { getImageUrl } from "../../../utils/imageUrl";
import showToast from "../../../utils/toast";
import { clearCouponApplication, isInactiveCouponError } from "../../coupon/couponState";
import DirhamAmount from "../../../components/DirhamAmount";
import {
    buildWhatsAppCheckoutUrl,
    CHECKOUT_PAYMENT_METHOD,
    CHECKOUT_PAYMENT_OPTIONS,
} from "../checkoutOptions";

const Checkout = () => {

    const navigate = useNavigate();
    const ORDER_REQUEST_TIMEOUT = 35000;

    const [addresses, setAddresses] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [cartSummary, setCartSummary] = useState({
        subtotal: 0,
        shipping: 0,
        total: 0,
        discount: 0,
    });

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");
    const fetchAddresses = useCallback(async () => {

        try {

            const response = await client.get("addresses/");

            setAddresses(response.data);

            if (response.data.length > 0) {

                setSelectedAddress(response.data[0].id);

            }

        } catch (error) {

            console.log(error);

        }

    }, []);

    const fetchCart = useCallback(async () => {

        try {

            const response = await client.get("cart/", { timeout: ORDER_REQUEST_TIMEOUT });

            const cartData = response.data || {};
            const inactiveItems = (Array.isArray(cartData.items) ? cartData.items : []).filter((item) => item.coupon_status === "COUPON_INACTIVE");
            inactiveItems.forEach((item) => clearCouponApplication(item.product, item.coupon_code));

            setCartItems(cartData.items || []);

            setCartSummary({
                subtotal: Number(cartData.subtotal || 0),
                shipping: Number(cartData.shipping || 0),
                total: Number(cartData.total || 0),
                discount: Number(cartData.discount || 0),
            });

            return cartData;

        } catch (error) {

            console.log(error);
            setCheckoutError("Could not refresh your cart. Please try again.");
            return null;

        }

    }, []);

    useEffect(() => {
        const loadCheckout = async () => {
            await Promise.all([
                fetchAddresses(),
                fetchCart()
            ]);

            setLoading(false);
        };

        loadCheckout();
    }, [fetchAddresses, fetchCart]);

    const placeOrder = async () => {

        if (processing) return;

        if (!selectedAddress) {

            alert("Please select delivery address");

            return;

        }

        try {

            setProcessing(true);
            setCheckoutError("");

            const latestCart = await fetchCart();
            if (!latestCart) {
                setProcessing(false);
                return;
            }

            const inactiveItems = (Array.isArray(latestCart.items) ? latestCart.items : []).filter((item) => item.coupon_status === "COUPON_INACTIVE");
            if (inactiveItems.length) {
                inactiveItems.forEach((item) => clearCouponApplication(item.product, item.coupon_code));
                setCheckoutError("This coupon is no longer active. Your cart has been updated.");
                showToast.warning("This coupon is no longer active. Your cart has been updated.");
                setProcessing(false);
                return;
            }

            // A failed checkout attempt must never reuse a key: each button
            // click represents a new user-initiated checkout operation.
            const idempotencyKey = crypto.randomUUID();

            const response = await client.post(
                "place-order/",
                {
                    address: selectedAddress,
                    payment_method: CHECKOUT_PAYMENT_METHOD,
                },
                {
                    timeout: ORDER_REQUEST_TIMEOUT,
                    headers: { "Idempotency-Key": idempotencyKey }
                }
            );

            const orderId = response.data?.order_id;
            if (!orderId) {
                throw new Error("The order could not be created.");
            }

            const selectedAddressDetails = addresses.find((address) => address.id === selectedAddress);
            const whatsappUrl = buildWhatsAppCheckoutUrl({
                orderId,
                address: selectedAddressDetails,
                items: latestCart.items || [],
                total: response.data?.grand_total || latestCart.total || cartSummary.total,
            });

            window.location.assign(whatsappUrl);

        } catch (error) {

            console.log(error);
            if (isInactiveCouponError(error)) {
                const responseData = error.response?.data || {};
                clearCouponApplication(null, responseData.coupon_code);
                setCheckoutError("This coupon is no longer active. Your cart has been updated.");
                showToast.warning("This coupon is no longer active. Your cart has been updated.");
                await fetchCart();
            } else {
                setCheckoutError(
                    error.response?.data?.message
                        || "Unable to place the order through WhatsApp. Please try again."
                );
            }

            setProcessing(false);

        }

    };

    if (loading) {

        return (

            <div className="checkout-loading">

                Loading...

            </div>

        );

    }
        return (

        <div className="life-line-checkout">

            <div className="life-line-checkout-header">

                <h1 className="life-line-checkout-title">

                    Checkout

                </h1>

                <p className="life-line-checkout-subtitle">

                    Add your delivery details, then continue directly to WhatsApp.

                </p>

                {checkoutError && <p className="coupon-inactive-warning" role="alert">{checkoutError}</p>}

            </div>

            <div className="life-line-checkout-wrapper">

                <div className="life-line-checkout-left">

                    <div className="life-line-checkout-card">

                        <div className="life-line-card-header">

                            <h2>

                                Delivery Address

                            </h2>

                            <button
                                className="life-line-add-address-btn"
                                onClick={() => navigate("/profile")}
                            >

                                + Add Address

                            </button>

                        </div>

                        {

                            addresses.length === 0 ?

                                <div className="life-line-empty-box">

                                    <p>

                                        No address found

                                    </p>

                                </div>

                                :

                                addresses.map((address) => (

                                    <div
                                        key={address.id}
                                        className={`life-line-address-card ${
                                            selectedAddress === address.id
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedAddress(address.id)
                                        }
                                    >

                                        <input
                                            type="radio"
                                            checked={
                                                selectedAddress === address.id
                                            }
                                            onChange={() =>
                                                setSelectedAddress(address.id)
                                            }
                                        />

                                        <div className="life-line-address-info">

                                            <h4>

                                                {address.full_name}

                                            </h4>

                                            <p>

                                                {address.phone}

                                            </p>

                                            <p>

                                                {address.address_line}

                                            </p>

                                            <p>

                                                {address.city}{address.emirate ? `, ${address.emirate}` : ""},{" "}
                                                {address.postal_code}

                                            </p>

                                            <p>

                                                {address.country}

                                            </p>

                                        </div>

                                    </div>

                                ))

                        }

                    </div>

                    <div className="life-line-checkout-card">

                        <h2>

                            Order Method

                        </h2>

                        <div className="life-line-payment-card">

                            <div className="life-line-payment-title">

                            Choose how to place your order

                            </div>

                            <p>

                                Your order will be confirmed through WhatsApp.

                            </p>

                            {CHECKOUT_PAYMENT_OPTIONS.map((option) => (
                                <div className="life-line-payment-option active" key={option.value}>
                                    <span>
                                        <strong>{option.title}</strong>
                                        <small>{option.description}</small>
                                    </span>
                                </div>
                            ))}

                        </div>

                    </div>

                </div>

                <div className="life-line-checkout-right">

                    <div className="life-line-checkout-card">

                        <h2>

                            Order Summary

                        </h2>

                        {

                            cartItems.length === 0 ?

                                <div className="life-line-empty-box">

                                    <p>

                                        Your cart is empty

                                    </p>

                                </div>

                                :

                                cartItems.map((item) => (

                                    <div
                                        key={item.id}
                                        className="life-line-summary-item"
                                    >

                                        <div className="life-line-summary-image">

                                            <img
                                                src={getImageUrl(item.product_image)}
                                                alt={item.product_name}
                                            />

                                        </div>

                                        <div className="life-line-summary-details">

                                            <h4>

                                                {item.product_name}

                                            </h4>

                                            {item.variant_size !== null && (
                                                <p>

                                                    {item.unit_type || "Variant Option"} : {item.size}

                                                </p>
                                            )}

                                            <p>

                                                Color : {item.color}

                                            </p>

                                            {item.coupon_status === "COUPON_INACTIVE" && (
                                                <p className="coupon-inactive-warning" role="alert">
                                                    This coupon is no longer active.
                                                </p>
                                            )}

                                            <p>

                                                Qty : {item.quantity}

                                            </p>

                                        </div>

                                        <div className="life-line-summary-price">

                                            <DirhamAmount value={Number(item.total_price)} />

                                        </div>

                                    </div>

                                ))

                        }

                        <div className="life-line-summary-total">
                                                        <div className="life-line-summary-row">

                                <span className="life-line-subtotal-label">

                                    <span>Subtotal</span>
                                    <small>Price includes 5% VAT</small>

                                </span>

                                <span>

                                            <DirhamAmount value={cartSummary.subtotal} />

                                </span>

                            </div>

                            {/* <div className="life-line-summary-row">

                                <span>

                                    Offer Discount

                                </span>

                                <span
                                    style={{
                                        color: "#1d9d55",
                                        fontWeight: "600",
                                    }}
                                >

                                    <DirhamAmount value={-cartSummary.discount} />

                                </span>

                            </div> */}

                            {cartSummary.shipping > 0 && (
                                <div className="life-line-summary-row">

                                    <span>

                                        Shipping

                                    </span>

                                    <span>

                                        <DirhamAmount value={cartSummary.shipping} />

                                    </span>

                                </div>
                            )}

                            <div className="life-line-summary-row">

                                <span>

                                    Tax

                                </span>

                                <span>

                                    Included

                                </span>

                            </div>

                            <div className="life-line-summary-divider"></div>

                            <div className="life-line-grand-total">

                                <div>

                                    <h3>

                                        Total

                                    </h3>

                                </div>

                                <h2>

                                            <DirhamAmount value={cartSummary.total} />

                                </h2>

                            </div>

                        </div>

                        <button
                            className="life-line-checkout-btn"
                            onClick={placeOrder}
                            disabled={processing || cartItems.length === 0}
                        >

                            {

                                processing

                                    ?

                                    "Placing order..."

                                    :

                                    "Continue via WhatsApp"

                            }

                        </button>

                        <p className="life-line-payment-note">

                            "Your name, phone, address, items, and total will open in WhatsApp."

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Checkout;
