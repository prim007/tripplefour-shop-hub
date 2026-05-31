import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  PRODUCT_BY_HANDLE_QUERY,
  ShopifyProduct,
  storefrontApiRequest,
} from "@/lib/shopifyLefLabs";
import { useLefLabsCart } from "@/stores/lefLabsCart";
import LefLabsCartDrawer from "@/components/leflabs/LefLabsCartDrawer";

export default function LefLabsProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantId, setVariantId] = useState<string | null>(null);
  const addItem = useLefLabsCart((s) => s.addItem);
  const setOpen = useLefLabsCart((s) => s.setOpen);
  const isLoading = useLefLabsCart((s) => s.isLoading);

  useEffect(() => {
    if (!handle) return;
    (async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        const p = data?.data?.product;
        setProduct(p);
        setVariantId(p?.variants?.edges?.[0]?.node?.id || null);
      } finally {
        setLoading(false);
      }
    })();
  }, [handle]);

  const variant = product?.variants.edges.find((v) => v.node.id === variantId)?.node;

  const handleAdd = async () => {
    if (!product || !variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    setOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>{product ? `${product.title} — Lëf Labs` : "Lëf Labs Product"}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <Link
              to="/partners/lef-labs"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Lëf Labs
            </Link>
            <LefLabsCartDrawer />
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !product ? (
            <p className="py-24 text-center text-muted-foreground">Product not found.</p>
          ) : (
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="aspect-square overflow-hidden rounded-xl border-2 border-border bg-secondary/30">
                {product.images.edges[0] ? (
                  <img
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText || product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold md:text-4xl">{product.title}</h1>
                <p className="mt-2 font-mono text-xl">
                  {product.priceRange.minVariantPrice.currencyCode}{" "}
                  {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>
                <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">
                  {product.description}
                </p>

                {product.variants.edges.length > 1 && (
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Variant
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.variants.edges.map(({ node: v }) => (
                        <button
                          key={v.id}
                          onClick={() => setVariantId(v.id)}
                          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                            variantId === v.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary"
                          }`}
                        >
                          {v.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  size="lg"
                  className="mt-8 w-full gap-2"
                  onClick={handleAdd}
                  disabled={!variant || isLoading}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}