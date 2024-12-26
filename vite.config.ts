import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
import { glob } from "glob";
import globalContext from "./pages-data/globalContext";
import pagesConfig from "./pages.config";

export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/main.js`,
        chunkFileNames: `assets/main.js`,
        assetFileNames: `assets/main.[ext]`,
      },
      input: glob.sync("*.html").map((file) => path.resolve(__dirname, file)),
    },
  },
  server: {
    host: true,
  },
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/icons")],
      symbolId: "[name]",
    }),
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
      helpers: {
        times: (n, block) => {
          var accum = "";
          for (var i = 0; i < n; ++i) accum += block.fn(i);
          return accum;
        },
      },
      context(pagePath) {
        return {
          ...globalContext,
          ...pagesConfig[pagePath],
        };
      },
    }),
  ],
};
