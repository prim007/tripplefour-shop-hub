// GA4 tracking helper — uses proper GA4 ecommerce schema (items[] arrays).
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventParams = Record<string, unknown>;

export const GA_MEASUREMENT_ID = "G-9WEDV6D546";

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params ?? {});
  } else if (Array.isArray(window.dataLayer)) {
    // Fallback so events aren't lost before gtag.js loads
    window.dataLayer.push(["event", eventName, params ?? {}]);
  }
}

/**
 * Send a virtual page_view to GA4 (required for SPAs — gtag config only fires once).
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title ?? document.title,
    send_to: GA_MEASUREMENT_ID,
  });
}

/**
 * Set persistent user properties (e.g. logged_in, country, has_age_token).
 */
export function setUserProperties(props: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("set", "user_properties", props);
}

export function setUserId(userId: string | null) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, { user_id: userId ?? undefined });
}

export interface GAItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_brand?: string;
  price?: number;
  quantity?: number;
  affiliation?: string;
  coupon?: string;
  discount?: number;
  index?: number;
}

const sumValue = (items: GAItem[]) =>
  items.reduce((s, it) => s + (it.price ?? 0) * (it.quantity ?? 1), 0);

// ---------- GA4 ecommerce events (proper schema) ----------
export const Analytics = {
  // Engagement
  chatInitiated: () => trackEvent("chat_initiated", { method: "cuddles_ai" }),
  chatMessageSent: (message: string) =>
    trackEvent("chat_message_sent", { message_length: message.length }),
  recommendationGiven: () =>
    trackEvent("recommendation_given", { source: "cuddles_ai" }),
  promptStarterClicked: (prompt: string) =>
    trackEvent("prompt_starter_clicked", { prompt_text: prompt }),
  blogChatOpened: (slug: string) =>
    trackEvent("blog_chat_opened", { blog_slug: slug }),
  search: (term: string) =>
    trackEvent("search", { search_term: term }),
  signUp: (method: string) => trackEvent("sign_up", { method }),
  login: (method: string) => trackEvent("login", { method }),
  ageVerified: () => trackEvent("age_verified", { method: "self_attested" }),

  // Ecommerce — full GA4 schema
  viewItemList: (listName: string, items: GAItem[]) =>
    trackEvent("view_item_list", {
      item_list_name: listName,
      items: items.map((it, i) => ({ ...it, index: i })),
    }),
  selectItem: (listName: string, item: GAItem) =>
    trackEvent("select_item", {
      item_list_name: listName,
      items: [item],
    }),
  viewItem: (itemId: string, itemName: string, price: number, category?: string) =>
    trackEvent("view_item", {
      currency: "ZAR",
      value: price,
      items: [{ item_id: itemId, item_name: itemName, item_category: category, price, quantity: 1 }],
    }),
  addToCart: (itemId: string, itemName: string, price: number, quantity = 1, category?: string) =>
    trackEvent("add_to_cart", {
      currency: "ZAR",
      value: price * quantity,
      items: [{ item_id: itemId, item_name: itemName, item_category: category, price, quantity }],
    }),
  removeFromCart: (itemId: string, itemName: string, price: number, quantity = 1) =>
    trackEvent("remove_from_cart", {
      currency: "ZAR",
      value: price * quantity,
      items: [{ item_id: itemId, item_name: itemName, price, quantity }],
    }),
  viewCart: (items: GAItem[]) =>
    trackEvent("view_cart", {
      currency: "ZAR",
      value: sumValue(items),
      items,
    }),
  beginCheckout: (items: GAItem[], value?: number, coupon?: string) =>
    trackEvent("begin_checkout", {
      currency: "ZAR",
      value: value ?? sumValue(items),
      coupon,
      items,
    }),
  addShippingInfo: (items: GAItem[], shippingTier: string, value?: number) =>
    trackEvent("add_shipping_info", {
      currency: "ZAR",
      value: value ?? sumValue(items),
      shipping_tier: shippingTier,
      items,
    }),
  addPaymentInfo: (items: GAItem[], paymentType: string, value?: number) =>
    trackEvent("add_payment_info", {
      currency: "ZAR",
      value: value ?? sumValue(items),
      payment_type: paymentType,
      items,
    }),
  purchase: (
    transactionId: string,
    value: number,
    items: GAItem[],
    extras?: { tax?: number; shipping?: number; coupon?: string },
  ) =>
    trackEvent("purchase", {
      currency: "ZAR",
      transaction_id: transactionId,
      value,
      tax: extras?.tax ?? 0,
      shipping: extras?.shipping ?? 0,
      coupon: extras?.coupon,
      items,
    }),

  // Custom (Cuddles + affiliate + sharing)
  chatProductAdded: (itemId: string, itemName: string) =>
    trackEvent("chat_product_added", {
      item_id: itemId,
      item_name: itemName,
      source: "cuddles_ai",
    }),
  chatProductViewed: (itemId: string) =>
    trackEvent("chat_product_viewed", { item_id: itemId, source: "cuddles_ai" }),
  affiliateClick: (itemId: string, itemName: string, url: string) =>
    trackEvent("affiliate_click", { item_id: itemId, item_name: itemName, link_url: url }),
  socialShare: (platform: string, contentUrl: string) =>
    trackEvent("social_share", { platform, content_url: contentUrl }),
  promoCodeApplied: (code: string, discount: number) =>
    trackEvent("promo_code_applied", { coupon: code, discount }),
  whatsappClick: (location: string) =>
    trackEvent("whatsapp_click", { location }),
};
