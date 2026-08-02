import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/context/CartContext";
import { CartDrawerProvider } from "@/context/CartDrawerContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import AgeVerification from "@/components/AgeVerification";
import CuddlesChatbot from "@/components/CuddlesChatbot";
import WelcomeDiscountPopup from "@/components/WelcomeDiscountPopup";
import CookieConsent from "@/components/CookieConsent";
import useGAPageviews from "@/hooks/useGAPageviews";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Partners from "./pages/Partners";
import PartnerDirtyVapes from "./pages/PartnerDirtyVapes";
import PartnerLefLabs from "./pages/PartnerLefLabs";
import LefLabsOrder from "./pages/LefLabsOrder";
import LefLabsOrderComplete from "./pages/LefLabsOrderComplete";
import Affiliate from "./pages/Affiliate";
import Dispensaries from "./pages/Dispensaries";
import Donations from "./pages/Donations";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Unsubscribe from "./pages/Unsubscribe";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RouteAnalytics = () => {
  useGAPageviews();
  return null;
};

const PostAuthRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!user) return;
    const target = sessionStorage.getItem("post_auth_redirect");
    if (!target) return;
    sessionStorage.removeItem("post_auth_redirect");
    if (target.startsWith("/") && target !== location.pathname) {
      navigate(target, { replace: true });
    }
  }, [user, navigate, location.pathname]);
  return null;
};

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <CartDrawerProvider>
            <Toaster />
            <Sonner />
            <AgeVerification />

            <BrowserRouter>
              <RouteAnalytics />
              <PostAuthRedirect />
              <CartDrawer />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/partners/dirty-vapes" element={<PartnerDirtyVapes />} />
                <Route path="/partners/lef-labs" element={<PartnerLefLabs />} />
                <Route path="/partners/lef-labs/order" element={<LefLabsOrder />} />
                <Route path="/partners/lef-labs/order-complete" element={<LefLabsOrderComplete />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/dispensaries" element={<Dispensaries />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CuddlesChatbot />
              <WelcomeDiscountPopup />
              <CookieConsent />
            </BrowserRouter>
          </CartDrawerProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
