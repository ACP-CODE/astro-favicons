import type { Options } from "astro-favicons";

declare module "virtual:astro-favicons" {
  export const html: string[];
  export const opts: Options;
}
