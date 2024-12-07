import type { AstroIntegration } from "astro";
import type { FaviconOptions, Input, InputSource } from "./types";
import { defaults } from "./config/defaults";
import { getInput } from "./helpers";
import { create } from "./plugin";

export const name = "astro-favicons";
export interface Options extends FaviconOptions {
  /**
   * @description
   * Specify the source image(s) used to generate platform-specific assets.
   * @default `public/favicon.svg`.
   * @example
   * ```js
   * input: {
   *  yandex: ["public/favicon.svg", readFile("src/favicons/pixel.png")]
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
  let sources: InputSource;
  const opts = { ...defaults, ...options };

  return {
    name,
    hooks: {
      "astro:config:setup": async ({
        isRestart: ir,
        command: cmd,
        updateConfig,
        logger,
        addMiddleware,
      }) => {
        sources = getInput(opts?.input);
        if (cmd==='build' || cmd==='dev') {
          if (!ir) {
            logger.info(`Processing source...`);
          }
          updateConfig({
            vite: {
              plugins: [await create(sources, opts, ir, logger)],
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
