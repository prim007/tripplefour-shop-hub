import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Terms of Service | Tripplefour — CBD Infused Products South Africa</title>
        <meta name="description" content="Review Tripplefour's terms of service for purchasing CBD infused products online in South Africa. Age requirements, payment terms & delivery policies." />
        <link rel="canonical" href="https://tripplefourshophub.online/terms-of-service" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <h1 className="font-display text-3xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</p>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">1. Age Requirement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You must be 21 years of age or older to access and use this website and to purchase products from Tripplefour. By using this site, you confirm that you meet this age requirement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">2. Products & Availability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All products listed on our website are subject to availability. We reserve the right to modify, discontinue, or update product listings, prices, and descriptions at any time without prior notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">3. Orders & Payment</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>All orders must be paid via EFT before processing begins</li>
              <li>Orders without payment will not be fulfilled</li>
              <li>Use your order reference number as your payment reference</li>
              <li>We reserve the right to cancel any order at our discretion</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">4. Delivery</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We aim to deliver within 24–48 hours of payment confirmation. Delivery fees are calculated based on your distance from our dispatch location. You or an authorised representative must be available to receive the delivery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">5. Refunds & Returns</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Due to the nature of our products, we do not accept returns. Refunds are only issued if we are unable to fulfil your order. Please contact us if you have any issues with your delivery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">6. Responsible Use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CBD products may impair your ability to drive or operate machinery. Use responsibly. Keep all products out of reach of children. Products are not recommended for pregnant or breastfeeding women.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">7. Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tripplefour shall not be held liable for any damages arising from the use or misuse of products purchased from our store. By placing an order, you accept full responsibility for the use of the products.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">8. Sponsorship &amp; Partnerships</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tripplefour offers advertising and sponsorship placements on its website. All partnerships are governed by our Partnership Terms &amp; Conditions available on the <a href="/partners" className="text-primary underline hover:no-underline">Partners</a> page. Sponsorship fees are non-refundable once a campaign is live. Tripplefour is not responsible for the products, services, or claims made by partner brands featured on our site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">9. Marketplace Partner &amp; Supplier Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The following clauses apply to all businesses, suppliers, advertisers, and fulfilment partners (collectively, “Partners”) that list products, place advertising, or supply inventory through the Tripplefour platform and supply chain ecosystem.
            </p>

            <h3 className="font-display text-base font-semibold mt-4">9.1 Compliance &amp; Licensing Warranties</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Partners warrant that they hold and will maintain all valid local, provincial, and national licences, permits, and regulatory approvals (including SAHPRA, health, trade, and tax registrations) required to manufacture, distribute, advertise, or sell their products in South Africa. If any such licence lapses, is suspended, or is revoked, the Partner must immediately notify Tripplefour and self-suspend their catalogue. Partners fully indemnify and hold Tripplefour harmless against any fines, penalties, claims, or regulatory action arising from non-compliance with their licensing obligations.
            </p>

            <h3 className="font-display text-base font-semibold mt-4">9.2 Supply Chain &amp; Fulfilment SLAs</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Partners must accept or reject orders within 24 hours, package goods to industry standard, and hand shipments to the nominated courier within 48 hours of acceptance. In any dispute involving short, damaged, incorrect, or undelivered shipments, Tripplefour acts as a neutral arbitrator. Final financial liability for fulfilment errors, defective product, or non-delivery rests with the supplying Partner, including refunds, replacements, and reasonable courier costs.
            </p>

            <h3 className="font-display text-base font-semibold mt-4">9.3 Fees, Escrow &amp; Payout Cycles</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Partner payouts are processed on a Net-7 cycle from the date an order is marked delivered, less the agreed platform commission and transaction fees. Funds may be held in escrow during the dispute window. Tripplefour reserves the right to withhold, delay, or reverse payouts where an account is flagged for fraud, chargebacks, unfulfilled orders, regulatory concerns, or breach of these Terms. Split payments between multiple suppliers on a single order are reconciled per line item.
            </p>

            <h3 className="font-display text-base font-semibold mt-4">9.4 Third-Party Gateways &amp; Logistics</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By partnering with Tripplefour, Partners also agree to be bound by the terms of service of any third-party payment gateway (e.g. PayFast) and logistics or courier provider engaged to process payments or fulfil orders through the platform.
            </p>

            <h3 className="font-display text-base font-semibold mt-4">9.5 Off-Boarding, Termination &amp; Record Retention</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Either party may terminate the partnership for convenience on 30 days’ written notice. Tripplefour may terminate immediately for breach, regulatory risk, or reputational harm. Upon termination, the Partner’s active listings will be hidden from the storefront, but historical transaction records, invoices, and tax documents will be retained by Tripplefour for a minimum of 5 years (or longer where required by SARS or applicable law) for tax, audit, and regulatory purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">10. Contact</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For any questions regarding these terms, please contact us via WhatsApp at +27 64 543 6734.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
