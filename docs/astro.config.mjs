import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://ryo-manba.github.io",
  base: "/data-chart/",
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
