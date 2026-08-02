import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import searchProducts from "./tools/search-products";
import getProduct from "./tools/get-product";
import listCategories from "./tools/list-categories";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "tripplefour-mcp",
  title: "Tripplefour Shop MCP",
  version: "0.1.0",
  instructions:
    "Tools for browsing the Tripplefour cannabis shop (South Africa). Use list_categories and list_products to explore the catalog, search_products for keyword search, and get_product for full details. All prices are in South African Rands (ZAR).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listCategories, listProducts, searchProducts, getProduct],
});