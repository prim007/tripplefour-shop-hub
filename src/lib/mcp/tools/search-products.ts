import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { catalog, productUrl } from "../catalog";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Full-text search over Tripplefour products by name, description, or category. Returns matching products in ZAR.",
  inputSchema: {
    query: z.string().min(1).describe("Search text, e.g. 'vape', 'edible', 'cherry'."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase();
    const items = catalog
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, limit ?? 10)
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price_zar: p.price,
        description: p.description,
        url: productUrl(p.id),
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { results: items, count: items.length },
    };
  },
});