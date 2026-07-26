import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { catalog, productUrl } from "../catalog";

export default defineTool({
  name: "get_product",
  title: "Get product",
  description: "Get full details for a single Tripplefour product by its ID.",
  inputSchema: {
    id: z.string().min(1).describe("Product ID, e.g. 'acc-t444-cones'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const p = catalog.find((x) => x.id === id);
    if (!p) {
      return {
        content: [{ type: "text", text: `No product found with id '${id}'.` }],
        isError: true,
      };
    }
    const item = {
      id: p.id,
      name: p.name,
      category: p.category,
      price_zar: p.price,
      description: p.description,
      coming_soon: p.comingSoon ?? false,
      url: productUrl(p.id),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(item, null, 2) }],
      structuredContent: item,
    };
  },
});