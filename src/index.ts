import type { AstroIntegration } from "astro";
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
  /**
   * Disable middleware from executing request lifecycle
   * @default true
   */
  addMiddleware?: boolean;
}

export default function createIntegration(options?: Options): AstroIntegration {
  const opts = { ...defaults, ...options };

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
        opts.addMiddleware = opts.addMiddleware ?? true;

        if (cmd === "build" || cmd === "dev") {
          if (!isRestart) {
            logger.info(`Processing source...`);
          }
          updateConfig({
            vite: {
              plugins: [await handleAssets(opts, { isRestart, logger })],
            },
          });
        }

        if (opts.addMiddleware) {
          addMiddleware({
            entrypoint: `${name}/middleware`,
            order: "pre",
          });
        }
      },
    },
  };
}
