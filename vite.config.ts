import { defineConfig } from "vite";

export default defineConfig({
  base: "/tryDeploy/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        Paylux: "Paylux.html",
        SJA: "SJA.html",
        Religio: "Religio.html",
      },
    },
  },
  server: {
    host: "127.0.0.1",
    open: false,
  },
});
