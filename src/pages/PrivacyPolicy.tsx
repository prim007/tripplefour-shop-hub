import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Privacy Policy | Tripplefour — Cannabis Infused Products South Africa</title>
        <meta name="description" content="Read Tripplefour's privacy policy. Learn how we handle your personal information when you order cannabis infused products online in South Africa." />
        <link rel="canonical" href="https://tripplefourshophub.online/privacy-policy" />
        <meta name="robots" content="noindex, follow" />
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
              We use Google Analytics to understand how visitors interact with our website. This service may use cookies to collect anonymous usage data. No personally identifiable information is shared with analytics providers.
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
            <h2 className="font-display text-xl font-semibold">8. Changes to This Policy</h2>
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
