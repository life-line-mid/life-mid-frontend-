import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import './../App.css';
import client from "../lib/ApiClient";
import { clearAuthSession, saveAuthSession } from "../features/auth/authUtils";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Router from './Router';
import ScrollToTop from '../components/ScrollToTop';
import SeoHead from '../components/SeoHead';

function App() {

    const location = useLocation();
    const normalizedPath = location.pathname.toLowerCase();
    const isAdminPage = normalizedPath.startsWith("/admin-dashboard") || normalizedPath.startsWith("/orderdashboard") || normalizedPath.startsWith("/order-dashboard");
    const [authState, setAuthState] = useState(() => ({ pathname: location.pathname, ready: !isAdminPage }));
    const authReady = authState.pathname === location.pathname ? authState.ready : !isAdminPage;

    useEffect(() => {
        let active = true;
        // Session restoration must never make the public storefront depend on
        // an available API connection. A temporary API outage or CORS issue
        // should show the public app after a short bounded wait.
        client.get("auth/session/", {
            params: { scope: isAdminPage ? "admin" : "customer" },
            skipAuthRefresh: true,
            skipAuthRedirect: true,
            timeout: 5000,
        })
            .then((response) => {
                if (active) saveAuthSession(response.data);
            })
            .catch((error) => {
                if (error.response?.status === 401) clearAuthSession();
            })
            .finally(() => {
                if (active) setAuthState({ pathname: location.pathname, ready: true });
            });
        return () => { active = false; };
    }, [isAdminPage, location.pathname]);

    if (!authReady) return <div aria-live="polite" aria-label="Loading application" className="app-loading"><div className="app-loading-card" aria-hidden="true"><span className="skeleton app-loading-logo" /><span className="skeleton app-loading-line wide" /><span className="skeleton app-loading-line" /></div></div>;

    return (
        <>
            <SeoHead />
            <ScrollToTop />

            {!isAdminPage && <Navbar />}

            <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Router />
            </div>

            {!isAdminPage && <Footer />}
        </>
    );
}

export default App;
