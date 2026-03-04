// GA4 custom event tracking helper
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean>;

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

// Pre-defined events
export const Analytics = {
  chatInitiated: () => trackEvent("chat_initiated", { method: "cuddles_ai" }),
  chatMessageSent: (message: string) =>
    trackEvent("chat_message_sent", {
      message_length: message.length,
    }),
  recommendationGiven: () => trackEvent("recommendation_given", { source: "cuddles_ai" }),
  promptStarterClicked: (prompt: string) =>
    trackEvent("prompt_starter_clicked", { prompt_text: prompt }),
  addToCart: (itemId: string, itemName: string, price: number) =>
    trackEvent("add_to_cart", {
      currency: "ZAR",
      value: price,
      item_id: itemId,
      item_name: itemName,
    }),
  viewItem: (itemId: string, itemName: string, price: number) =>
    trackEvent("view_item", {
      currency: "ZAR",
      value: price,
      item_id: itemId,
      item_name: itemName,
    }),
  beginCheckout: (value: number) =>
    trackEvent("begin_checkout", { currency: "ZAR", value }),
  purchase: (transactionId: string, value: number) =>
    trackEvent("purchase", {
      currency: "ZAR",
      transaction_id: transactionId,
      value,
    }),
  blogChatOpened: (slug: string) =>
    trackEvent("blog_chat_opened", { blog_slug: slug }),
};
