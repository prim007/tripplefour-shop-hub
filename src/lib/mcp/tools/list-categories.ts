import { defineTool } from "@lovable.dev/mcp-js";
import { catalog } from "../catalog";

export default defineTool({
  name: "list_categories",
  title: "List categories",
  description: "List all product categories available in the Tripplefour shop with product counts.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const counts = new Map<string, number>();
    for (const p of catalog) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    const items = [...counts.entries()].map(([category, count]) => ({ category, count }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { categories: items },
    };
  },
});