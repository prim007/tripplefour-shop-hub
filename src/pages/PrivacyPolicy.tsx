import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Privacy Policy | Tripplefour</title>
        <meta name="description" content="Read Tripplefour's privacy policy. Learn how we handle your personal information when you order CBD infused products online in South Africa." />
        <link rel="canonical" href="https://tripplefourshophub.online/privacy-policy" />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Privacy Policy | Tripplefour" />
        <meta property="og:description" content="How Tripplefour handles your personal information." />
        <meta property="og:url" content="https://tripplefourshophub.online/privacy-policy" />
      </Helmet>
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</p>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">1. Information We Collect</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When you place an order through Tripplefour, we collect personal information necessary to fulfil your order, including your full name, email address, phone number, and delivery address. We do not collect any information beyond what is required to process and deliver your order.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>To process and fulfil your orders</li>
              <li>To communicate with you about your order status</li>
              <li>To arrange delivery to your specified address</li>
              <li>To improve our services and customer experience</li>
              <li>To train and improve Cuddles AI so it can give accurate, helpful answers</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">3. Data Protection</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We take the protection of your personal information seriously. Your data is stored securely and is only accessible to authorised personnel for order processing purposes. We comply with the Protection of Personal Information Act (POPIA) of South Africa.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">4. Sharing of Information</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your delivery details with our delivery partners solely for the purpose of fulfilling your order.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">5. Cookies & Analytics</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies to enable essential site features (such as your cart and age verification) and to understand how visitors interact with our website via Google Analytics. When you first visit Tripplefour, you will be asked to accept or decline non-essential cookies. You can change your decision at any time by clearing your browser storage for this site. No personally identifiable information is shared with analytics providers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">6. Your Rights</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Under POPIA, you have the right to access, correct, or request deletion of your personal information. To exercise these rights, please contact us via WhatsApp at +27 64 543 6734 or email us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">7. Sponsorship &amp; Partner Data</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you submit a sponsorship inquiry through our Partners page, we collect your company name, contact details, product description, and budget information. This data is used solely to evaluate and respond to your inquiry. We do not share partner inquiry data with third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">8. Partner &amp; Advertiser Vetting (SAHPRA)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every business that signs up to advertise, sponsor, or list products through Tripplefour is screened against the South African Health Products Regulatory Authority (SAHPRA) register before being approved. We verify that partner businesses are not flagged by SAHPRA for prohibited or unsafe health-product practices, and we reserve the right to decline or remove any partner who fails this check. This vetting protects our customers, but it does not constitute a SAHPRA endorsement of any specific product. Customers should always read product labels and consult a qualified healthcare professional before use.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">9. Public Catalog vs. Private Business Data</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We distinguish between <strong>public catalogue data</strong> (such as product names, descriptions, images, categories, and listed prices) which may be displayed across the Tripplefour ecosystem, search results, and marketing surfaces, and <strong>private operational data</strong> (such as a Partner&rsquo;s sales volumes, unit margins, buyer lists, and individual transaction records). Private operational data is never sold, shared with, or exposed to a Partner&rsquo;s direct competitors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">10. Data Utilisation for System Optimisation &amp; AI</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tripplefour reserves the right to aggregate and anonymise transaction, browsing, and catalogue data to train internal algorithms, improve supply-chain and inventory predictions, power Cuddles AI and smart recommendation features, and generate industry trend reports. Aggregated outputs do not identify any individual user or Partner and may be shared in summarised form. We do not sell personally identifiable information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">11. Shared Privacy Liability (Retailer &mdash; Supplier &mdash; Platform)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Where a Partner receives personal information (such as a buyer&rsquo;s name, delivery address, or contact details) in order to fulfil an order placed through Tripplefour, that Partner acts as an <strong>Independent Data Controller</strong> for that personal information. Each Partner must safeguard such data in accordance with POPIA (and GDPR where applicable), use it strictly to fulfil the order, and may not use it for independent marketing, profiling, or resale unless the end user has separately and explicitly opted in with that Partner. Partners are responsible for notifying Tripplefour and affected users of any data breach on their side without undue delay.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">12. Third-Party Processors</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We rely on vetted third-party service providers (including payment gateways such as PayFast, email delivery providers, logistics couriers, and analytics tools) to operate the platform. These processors only receive the minimum personal information required to perform their function and are contractually bound to protect it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">13. Changes to This Policy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
