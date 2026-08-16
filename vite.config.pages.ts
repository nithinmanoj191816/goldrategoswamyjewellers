// Static (no-server) build config used only for GitHub Pages.
// Run with: bun run build:pages
// The default vite.config.ts (Lovable / TanStack Start SSR) is untouched.
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const outDir = resolve(import.meta.dirname, "dist");

// GitHub Pages has no server-side routing, so a deep link like
// /goldrategoswamyjewellers/admin 404s. GitHub Pages serves 404.html for those,
// and an identical copy of index.html lets the client router take over.
const spaFallback: Plugin = {
  name: "gh-pages-spa-fallback",
  closeBundle() {
    const index = resolve(outDir, "index.html");
    if (existsSync(index)) copyFileSync(index, resolve(outDir, "404.html"));
  },
};

export default defineConfig({
  base: "/goldrategoswamyjewellers/",
  root: resolve(import.meta.dirname, "static"),
  publicDir: resolve(import.meta.dirname, "public"),
  plugins: [react(), tailwindcss(), tsConfigPaths(), spaFallback],
  // Flags the client-only build so the root route skips the SSR document shell.
  define: { "import.meta.env.VITE_STATIC_PAGES": JSON.stringify("1") },

  resolve: {
    alias: { "@": resolve(import.meta.dirname, "src") },
  },
  build: {
    outDir,
    emptyOutDir: true,
  },
});
