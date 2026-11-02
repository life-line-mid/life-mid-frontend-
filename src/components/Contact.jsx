import { useState } from "react";
import "./../Contact.css"
import { getAuthValue } from "../features/auth/authUtils";
import { WHATSAPP_NUMBER } from "../config/contact";

const ContactUs = () => {
    const [formData, setFormData] = useState(() => ({
        name: getAuthValue("first_name"),
        email: getAuthValue("email"),
        phone: "",
        subject: "",
        message: "",
    }));

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const sendWhatsApp = (e) => {
        e.preventDefault();

        const { name, email, phone, subject, message } = formData;

        if (!name || !email || !phone || !subject || !message) {
            alert("Please fill in all fields.");
            return;
        }

        if (!WHATSAPP_NUMBER) {
            alert("WhatsApp contact is not configured yet.");
            return;
        }

        const text = `Hello Team,

Name: ${name}

Email: ${email}

Phone: ${phone}

Subject: ${subject}

Message:
${message}

Thank you.`;

        const messageWindow = window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
            "_blank",
            "noopener,noreferrer"
        );
        if (messageWindow) messageWindow.opener = null;
    };

    return (
        <div className="contact-page">

            <div className="contact-header">

                <span className="contact-tag">
                    CONTACT US
                </span>

                <h1>
                    Enquire about medical supplies
                </h1>

                <p>
                    Contact our team to enquire about availability,
                    product information and quotations.
                    Fill out the form below and send us
                    a message directly on WhatsApp.
                </p>

            </div>

            <div className="contact-container">

                {/* Left */}

                <div className="contact-info">

                    <h2>Contact our team</h2>

                    <div className="info-box">

                        <h4>Enquiries</h4>

                        <p>
                            Availability and quotations
                        </p>

                        <p>
                            Share the products or categories you need.
                        </p>

                    </div>

                    <div className="info-box">

                        <h4>What to include</h4>

                        <p>
                            Include quantities, preferred specifications and any timing requirements when known.
                        </p>

                    </div>

                    <div className="info-box">

                        <h4>Product details</h4>

                        <p>
                            Send us a WhatsApp message and our team will follow up with practical next steps.
                        </p>

                    </div>

                </div>

                {/* Right */}

                <form
                    className="contact-form"
                    onSubmit={sendWhatsApp}
                >

                    <div className="input-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />



                    </div>

                    <div className="input-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>
                            Subject
                        </label>

                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select a Subject
                            </option>

                            <option>
                                Product Enquiry
                            </option>

                            <option>
                                Availability enquiry
                            </option>

                            <option>
                                Quotation request
                            </option>

                            <option>
                                Product information
                            </option>

                            <option>
                                Supply support
                            </option>

                            <option>
                                General enquiry
                            </option>

                        </select>

                    </div>

                    <div className="input-group">

                        <label>
                            Message
                        </label>

                        <textarea
                            rows="6"
                            name="message"
                            placeholder="Write your message..."
                            value={formData.message}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        className="whatsapp-btn"
                        type="submit"
                    >

                        Send via WhatsApp →

                    </button>

                </form>

            </div>

        </div>
    );
};

export default ContactUs;
