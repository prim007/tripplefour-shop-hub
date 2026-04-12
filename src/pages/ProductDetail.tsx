import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { getProductById, products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Analytics } from "@/lib/analytics";
import { trackFunnel } from "@/lib/funnel";
import ProductCard from "@/components/ProductCard";
import TrustBadges from "@/components/TrustBadges";
import SocialProof from "@/components/SocialProof";
import StickyAddToCart from "@/components/StickyAddToCart";
import SocialShare from "@/components/SocialShare";
import { useCartDrawer } from "@/context/CartDrawerContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addItem } = useCart();
  const { open: openDrawer } = useCartDrawer();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      Analytics.viewItem(product.id, product.name, product.price);
      trackFunnel("view_product", product.id, { name: product.name, price: product.price });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold">Product not found</h1>
            <Button asChild className="mt-4"><Link to="/shop">Back to Shop</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id && !p.comingSoon)
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, qty);
    Analytics.addToCart(product.id, product.name, product.price * qty);
    trackFunnel("add_to_cart", product.id, { name: product.name, quantity: qty, value: product.price * qty });
    toast({ title: "Added to cart", description: `${qty}x ${product.name} added.` });
    openDrawer();
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    Analytics.addToCart(product.id, product.name, product.price * qty);
    navigate("/checkout");
  };

  const pageTitle = `Buy ${product.name} Online South Africa — R${product.price} | Tripplefour`;
  const pageDesc = `${product.description} From R${product.price}. Fast delivery across South Africa — Johannesburg, Cape Town, Durban & nationwide.`;
  const pageUrl = `https://tripplefourshophub.online/product/${product.id}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": { "@type": "Brand", "name": "Tripplefour" },
    "offers": {
      "@type": "Offer",
      "url": pageUrl,
      "priceCurrency": "ZAR",
      "price": product.price,
      "availability": product.comingSoon ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Tripplefour" },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "ZA" },
        "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "d" } }
      }
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tripplefourshophub.online/" },
      { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://tripplefourshophub.online/shop" },
      { "@type": "ListItem", "position": 3, "name": product.name, "item": pageUrl }
    ]
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="ZAR" />
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <Button asChild variant="ghost" size="sm" className="mb-4 gap-1">
            <Link to="/shop"><ArrowLeft className="h-4 w-4" /> Back to Shop</Link>
          </Button>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              {product.comingSoon && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-muted-foreground">{product.category}</p>
              <h1 className="mt-1 font-display text-3xl font-bold">Buy {product.name} Online</h1>
              <SocialShare
                url={`/product/${product.id}`}
                title={`${product.name} — R${product.price}`}
                campaign="product_share"
                className="mt-2"
              />
              <p className="mt-3 text-muted-foreground">{product.description}</p>
              <p className="mt-1 text-sm text-primary font-medium">✅ In stock — order now for fast delivery across South Africa (Joburg, Cape Town, Durban & more)</p>

              {!product.comingSoon && (
                <div className="mt-3">
                  <SocialProof productId={product.id} />
                </div>
              )}

              <p className="mt-4 text-3xl font-bold text-primary">
                {product.comingSoon ? "Price TBA" : `R${product.price.toLocaleString()}`}
              </p>

              {!product.comingSoon && (
                <>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-lg border p-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(Math.max(1, qty - 1))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{qty}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(qty + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="lg" className="gap-2" onClick={handleAdd}>
                      <ShoppingCart className="h-5 w-5" /> Add to Cart
                    </Button>
                  </div>
                  <Button size="lg" className="mt-3 w-full gap-2 font-semibold groovy-gradient text-white hover:opacity-90 border-0" onClick={handleBuyNow}>
                    <Zap className="h-5 w-5" /> Purchase Now — R{(product.price * qty).toLocaleString()}
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground text-center">🚚 Free delivery on orders over R500 · Pay by EFT or Cash</p>
                </>
              )}

              <div className="mt-6">
                <TrustBadges compact />
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display text-xl font-bold">Related Products</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <StickyAddToCart product={product} qty={qty} onAdd={handleAdd} />

      <Footer />
    </div>
  );
}
