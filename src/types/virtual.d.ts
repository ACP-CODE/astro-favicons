import type { Options } from "..";

declare module "virtual:astro-favicons" {
  export const html: string[];
  export const opts: Options;
}
