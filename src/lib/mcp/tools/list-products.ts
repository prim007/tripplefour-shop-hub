import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { catalog, productUrl } from "../catalog";

export default defineTool({
  name: "list_products",
  title: "List products",
  description:
    "List all Tripplefour shop products in South African Rands (ZAR). Optionally filter by category (Edibles, Vapes, Dab, Accessories, CBD Products).",
  inputSchema: {
    category: z
      .string()
      .optional()
      .describe("Optional category filter, case-insensitive."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const items = catalog
      .filter((p) => !category || p.category.toLowerCase() === category.toLowerCase())
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price_zar: p.price,
        description: p.description,
        coming_soon: p.comingSoon ?? false,
        url: productUrl(p.id),
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { products: items, count: items.length },
    };
  },
});