import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureRefFromUrl } from "./lib/affiliate";

captureRefFromUrl();

createRoot(document.getElementById("root")!).render(<App />);
