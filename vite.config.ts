import { defineConfig } from "vite-plus"

export default defineConfig({
  pack: {
    entry: ["src/index.ts"],
    format: "esm",
    banner: { js: "#!/usr/bin/env node" },
  },
  fmt: {
    semi: false,
  },
})
