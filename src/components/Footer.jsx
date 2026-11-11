import "./../Footer.css";

import footerlogo from './../assets/lifeline-logo-optimized.webp'
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, } from "react-icons/fa";
import { CONTACT_EMAIL, WHATSAPP_DISPLAY_NUMBER, WHATSAPP_NUMBER } from "../config/contact";
function Footer() {
    const whatsappUrl = WHATSAPP_NUMBER
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello")}`
        : "#";


    return (
        <div>

            <footer className="footer">

                <div className="footer-container">

                    <div className="footer-column brand">
                        <img src={footerlogo} alt="Life-line Medical Supplies" className="footer-logo" width="900" height="332" loading="lazy" decoding="async" />
                        <p>Medical supplies, made easier to source.</p>
                    </div>

                    <div className="footer-column">
                        <h3>Quick Links</h3>

                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/shop">Categories</Link></li>
                            <li><Link to="/shop?offer=true">Offers</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Enquiries</h3>

                        <ul>
                            <li><Link to="/profile">My Account</Link></li>
                            <li><Link to="/myorders">Track Order</Link></li>
                            <li><Link to="/contact">Availability &amp; quotations</Link></li>

                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Contact Us</h3>

                        <ul className="contact">
                            {WHATSAPP_NUMBER && <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><FaPhoneAlt /> {WHATSAPP_DISPLAY_NUMBER}</a></li>}

                            <li>
                                <FaEnvelope />  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                            </li>

                            <li>
                                <FaMapMarkerAlt /> Project location to be configured
                            </li>
                        </ul>
                    </div>

                    <div className="footer-column payment">
                        <h3>Contact our team</h3>

                        <div className="payment-options">
                            <span>Product enquiries</span>
                            <span>Quotation support</span>
                        </div>
                    </div>

                </div>

            </footer>

            <div className="copyright">
                © 2026 life-line. All Rights Reserved.
            </div>

        </div>
    )
}

export default Footer

