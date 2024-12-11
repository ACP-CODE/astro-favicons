import type { AstroIntegration } from "astro";
import type { FaviconOptions, Input } from "./types";
import { defaults } from "./config/defaults";
import { handleAssets } from "./plugin";

export const name = "astro-favicons";
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
   * Get the ﹤𝚑𝚎𝚊𝚍﹥ in order
   * @default true
   */
  capo?: boolean;
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
        opts.capo = opts.capo ?? config.compressHTML;
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
        addMiddleware({
          entrypoint: `${name}/middleware`,
          order: "pre",
        });
      },
    },
  };
}
