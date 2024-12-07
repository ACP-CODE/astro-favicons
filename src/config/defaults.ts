import type { FaviconOptions } from "../types";

export const defaults: FaviconOptions = {
  name: "Astro Favicons",
  short_name: "Favicons",
  icons: {
    android: ["android-chrome-192x192.png", "android-chrome-512x512.png"],
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
  capo: true,
};
