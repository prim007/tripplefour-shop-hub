import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PRODUCTS_QUERY,
  ShopifyProduct,
  storefrontApiRequest,
} from "@/lib/shopifyLefLabs";
import { useLefLabsCart } from "@/stores/lefLabsCart";

export default function LefLabsStorefront() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useLefLabsCart((s) => s.addItem);
  const setOpen = useLefLabsCart((s) => s.setOpen);
  const isLoading = useLefLabsCart((s) => s.isLoading);

  useEffect(() => {
    (async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 50, query: null });
        const edges = data?.data?.products?.edges || [];
        setProducts(edges);
      } catch (e) {
        console.error(e);
        setError("Could not load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-sm text-destructive py-12">{error}</p>;
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border bg-secondary/20 p-12 text-center">
        <p className="font-display text-lg font-bold">No products found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Lëf Labs has no Shopify products live yet. Ask the chat to create one — e.g.
          "Add Animal Runtz indoor flower at R120/g".
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const img = product.node.images?.edges?.[0]?.node;
        const price = product.node.priceRange.minVariantPrice;
        return (
          <div
            key={product.node.id}
            className="group overflow-hidden rounded-xl border-2 border-border bg-card transition-all hover:border-primary hover:-translate-y-1"
          >
            <Link to={`/partners/lef-labs/product/${product.node.handle}`}>
              <div className="relative aspect-square overflow-hidden bg-secondary/30">
                {img ? (
                  <img
                    src={img.url}
                    alt={img.altText || product.node.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>
            </Link>
            <div className="p-3">
              <Link to={`/partners/lef-labs/product/${product.node.handle}`}>
                <p className="font-display text-sm font-bold leading-tight line-clamp-2 hover:text-primary">
                  {product.node.title}
                </p>
              </Link>
              <p className="mt-1 font-mono text-sm">
                {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
              </p>
              <Button
                size="sm"
                className="mt-3 w-full gap-2"
                onClick={() => handleAdd(product)}
                disabled={isLoading}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}