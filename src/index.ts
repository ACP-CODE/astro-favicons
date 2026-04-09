import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import type { FaviconOptions, Input } from "./types";
import { defaults } from "./config/defaults";
import { handleAssets } from "./plugin";
import { name } from "./config/packge";

export interface Options extends FaviconOptions {
  /**
   * Specify the source image(s) used to generate platform-specific assets.
   * @default `public/favicon.svg`.
   * @example
   * ```js
   * input: {
   *  yandex: ["public/favicon.svg", await readFile("path/to/pixel.png")]
   * }
   * ```
   */
  input?: Input;
  /**
   * Powered by `astro-capo`, it keeps the `<head>` content well-organized and tidy.
   * @default config.compressHTML `true`
   */
  withCapo?: boolean;
}

export default function createIntegration(options?: Options): AstroIntegration {
  const opts = { ...defaults, ...options };
  const middlewareEntry = fileURLToPath(new URL("./middleware.mjs", import.meta.url));

  return {
    name,
    hooks: {
      "astro:config:setup": async ({
        config,
        isRestart,
        command: cmd,
        updateConfig,
        logger,
        addMiddleware,
      }) => {
        opts.withCapo = opts.withCapo ?? config.compressHTML;
        if (cmd === "build" || cmd === "dev") {
          if (!isRestart) {
            logger.info(`Processing source...`);
          }
          updateConfig({
            vite: {
              plugins: [await handleAssets(opts, { isRestart, logger })],
              resolve: {
                // Cloudflare's workerd dev pipeline can prebundle bare package
                // subpath imports before the virtual module is registered.
                alias: {
                  [`${name}/middleware`]: middlewareEntry,
                },
              },
              ssr: {
                noExternal: [name, `${name}/middleware`],
              },
            },
          });
        }
        addMiddleware({
          entrypoint: `${name}/middleware`,
          order: "pre",
        });
      },
    },
  };
}
