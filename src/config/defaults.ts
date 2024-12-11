import type { Options, Source } from "../types";

export const defaultSource: Source = "public/favicon.svg";
export const defaults: Options = {
  name: null,
  short_name: null,
  icons: {
    android: [
      "android-chrome-192x192.png",
      {
        name: "android-chrome-512x512.png",
        sizes: [{ width: 512, height: 512 }],
        purpose: "maskable",
        transparent: true,
        rotate: false,
        offset: 13,
      },
    ],
    appleIcon: [
      "apple-touch-icon.png",
      "apple-touch-icon-precomposed.png",
      "safari-pinned-tab.svg",
    ],
    appleStartup: false,
    favicons: true,
    windows: true,
    yandex: true,
  },
};
