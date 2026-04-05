import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const allowedHosts = process.env.ALLOWED_HOSTS
  ?.split(",")
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(rootDir, "index.html"),
        about: path.resolve(rootDir, "about.html"),
      },
    },
  },
  server: {
    host: true,
    port: 4173,
    allowedHosts,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts,
  },
});
