// ============================================================
// DigiCraft Store — Premium Digital Product Store
// ============================================================
// Complete launch-ready storefront with AI Chatbot & Admin Panel
// ============================================================

import { useEffect } from 'react';
import { StoreProvider, useStore } from './store';
import { applySeo } from './seo';

import Header from './components/Header';
import CartSidebar from './components/CartSidebar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import StatsBar from './components/StatsBar';
import CountdownBanner from './components/CountdownBanner';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ProductListing from './components/ProductListing';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import ThankYou from './components/ThankYou';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Contact from './components/Contact';
import LegalPage from './components/LegalPages';
import ExitPopup from './components/ExitPopup';
import CookieConsent from './components/CookieConsent';
import Notification from './components/Notification';
import LaunchReadiness from './components/LaunchReadiness';
import AIChatbot from './components/AIChatbot';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedProducts />
      <Categories />
      <StatsBar />
      <CountdownBanner />
      <LaunchReadiness />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  );
}

function PageRouter() {
  const { state } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.currentPage]);

  // Admin pages
  if (state.currentPage === 'admin') {
    if (!state.isAdminAuthenticated) {
      return <AdminLogin />;
    }
    return <AdminPanel />;
  }

  switch (state.currentPage) {
    case 'home':
      return <HomePage />;
    case 'products':
      return <ProductListing />;
    case 'product-detail':
      return <ProductDetail />;
    case 'checkout':
      return <Checkout />;
    case 'thank-you':
      return <ThankYou />;
    case 'dashboard':
      return <Dashboard />;
    case 'about':
      return <About />;
    case 'contact':
      return <Contact />;
    case 'terms':
      return <LegalPage type="terms" />;
    case 'privacy':
      return <LegalPage type="privacy" />;
    case 'refund':
      return <LegalPage type="refund" />;
    default:
      return <HomePage />;
  }
}

function AppContent() {
  const { state, dispatch } = useStore();

  useEffect(() => {
    applySeo(state.currentPage, state.selectedProductId);
  }, [state.currentPage, state.selectedProductId]);

  useEffect(() => {
    let hasShown = false;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && state.cart.length === 0 && state.currentPage !== 'admin') {
        dispatch({ type: 'SHOW_EXIT_POPUP' });
        hasShown = true;
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [dispatch, state.cart.length, state.currentPage]);

  // Don't show normal layout for admin
  if (state.currentPage === 'admin') {
    return (
      <>
        <PageRouter />
        <Notification />
        <AIChatbot />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <PageRouter />
      </main>
      <Footer />

      <CartSidebar />
      <ExitPopup />
      <CookieConsent />
      <Notification />
      <AIChatbot />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
