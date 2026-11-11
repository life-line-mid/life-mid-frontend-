import React, { useEffect, useRef } from "react";
import '../styles/About.css';

import brandLogo from "../../../assets/lifeline-logo-optimized.png";

import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();

    const pillars = [
        {
            title: "Reliable sourcing",
            text: "We organise healthcare supplies with clear product information so teams can make practical sourcing decisions."
        },
        {
            title: "Practical service",
            text: "Our team provides a straightforward route to product enquiries, availability checks and quotations."
        },
        {
            title: "Quality-minded",
            text: "We aim to present dependable medical supplies accurately and communicate what we can support."
        }
    ];

    return (
        <div className="about-modern-wrapper">
            
            {/* Hero Section */}
            <section className="about-modern-hero about-fade">
                <div className="hero-text-content">
                    <span className="hero-eyebrow">LIFELINE MEDICAL SUPPLIES</span>
                    <h1 className="hero-display">
                        Medical supplies,<br />
                        <span className="hero-italic">made easier to source.</span>
                    </h1>
                    <p className="hero-subtext">
                        A dependable supply partner focused on quality, trust and practical service.
                    </p>
                    <button className="hero-modern-btn" onClick={() => navigate('/shop')}>
                        Browse categories <span className="arrow">→</span>
                    </button>
                </div>
                <div className="hero-image-content">
                    <div className="image-frame">
                        <img src={brandLogo} alt="Lifeline Medical Supplies" className="about-brand-image" />
                    </div>
                </div>
            </section>

            {/* Split Story Section */}
            <section className="about-modern-story about-fade">
                <div className="story-left">
                    <div className="story-sticky">
                        <h2>Built around <i>dependable supply</i>.</h2>
                        <p>
                            Lifeline Medical Supplies is positioned as a practical healthcare-supplies
                            distributor and sourcing partner for organisations that value clarity and consistency.
                        </p>
                        <p>
                            We keep the experience focused: organised categories, useful product information
                            and a clear route to an enquiry or quotation.
                        </p>

                        <div className="story-highlights">
                            <div className="highlight-box">
                                <span className="highlight-title">Clear categories</span>
                                <span className="highlight-text">Find the supply areas relevant to your organisation without unnecessary clutter.</span>
                            </div>
                            <div className="highlight-box">
                                <span className="highlight-title">Straightforward enquiries</span>
                                <span className="highlight-text">Contact our team to ask about availability and quotations.</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="story-right">
                    <img src={brandLogo} alt="Lifeline Medical Supplies" className="story-vibe-img about-brand-image" />
                </div>
            </section>

            {/* Values / Pillars - Humanized Grid */}
            <section className="about-human-values about-fade">
                <div className="values-header">
                    <h2>Our Philosophy</h2>
                    <p>Trust, quality and reliable supply guide our service.</p>
                </div>
                <div className="values-grid">
                    {pillars.map((pillar, index) => (
                        <div className="value-card" key={index}>
                            <h3>{pillar.title}</h3>
                            <p>{pillar.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Editorial Quote */}
            <section className="about-modern-quote about-fade">
                <blockquote>
                    "Trust. Quality. Reliable supply."
                </blockquote>
                <div className="quote-author">— Lifeline Medical Supplies</div>
            </section>

        </div>
    );
};

export default About;
