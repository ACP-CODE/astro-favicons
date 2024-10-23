import type { AstroConfig, AstroIntegration } from 'astro';
import type { FaviconOptions } from 'favicons-lib';

import { packageName } from './data/pkg-name';
import { defaultConfig, createFiles, vitePluginFavicons } from './core';

export interface FaviconConfig extends FaviconOptions {
  /**
   * @default
   * ```js
   * masterPicture: "./src/favicon.svg"
   * ```
   * @description
   * [*Required*] Provide an image (PNG, JPG, SVG...), at least 70x70. `SVG` is preferred.
   */
  masterPicture?: string;
  /**
  * @default
  * ```ts
  * emitAssets: true
  * ```
  * @description
  * [*Optional*] Make your own design. Choose auto-generation or manual image replacement.
  */
  emitAssets?: boolean;
  /**
   * @description
   * Make favicon compatible with light and dark modes
   */
  faviconsDarkMode?: boolean;
  /**
   * @default
   * ```ts
   * path: "/"
   * ```
   * @description
   * Place files (`favicon.ico`, `apple-touch-icon.png`, etc.) at the root of web site. [Recommended](../WHY.md).
   */
  path?: string;
  /**
   * @description
   * Refer to `name` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#name-member)
   */
  appName: string;
  /**
   * @description
   * Refer to `short_name` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#short_name-member-0)
   */
  appShortName?: string;
  /**
   * @description
   * Refer to `description` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#description-member)
   */
  appDescription?: string;
  /**
   * @default
   * ```js
   * dir: "auto"
   * ```
   * @description
   * Refer to `dir` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#dir-member)
   */
  dir?: "ltr" | "rtl" | "auto";
  /**
   * @default
   * ```ts
   * lang: "en-US"
   * ```
   * @description
   * Refer to `lang` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#lang-member)
   */
  lang?: string;
  /**
   * @description
   * Refer to `background_color` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#background_color-member)
   */
  background?: string;
  /**
   * Refer to `theme_color` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#theme_color-member)
   */
  theme_color?: string;
  /**
   * @example
   * ```html
   * <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
   * ```
   * @description
   * Used to control the style of the status bar in a web app added to the home screen on iOS devices.
   * - `default` - The status bar appears normally with a black background color. This is the default value.
   * - `black-translucent` - The status bar is translucent black.
   * - `black-opaque` - The status bar is solid black.
   */
  appleStatusBarStyle?: "default" | "black-translucent" | "black-opaque";
  /**
   * @default
   * ```ts
   * display: "standalone"
   * ```
   * @description
   * Refer to `display` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#display-member)
   */
  display?: FaviconOptions["display"];
  /**
   * @default
   * ```ts
   * orientation: "any"
   * ```
   * @description
   * [*Optional*] Refer to `orientation` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#orientation-member)
   */
  orientation?: "any" | "natural" | "landscape" | "portrait" | "portrait-primary" | "portrait-secondary" | "landscape-primary" | "landscape-secondary";
  /**
   * [*Optional*] Refer to `scope` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#scope-member)
   */
  scope?: string;
  /**
   * @description
   * Refer to `start_url` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#start_url-member)
   */
  start_url?: string;
  /**
   * @description
   * Refer to `related_applications` of [Web Application Manifest](https://www.w3.org/TR/appmanifest/#related_applications-member)
   */
  relatedApplications?: Application[];

  icons?: FaviconOptions["icons"];
}

/**
 * Represents a related application that is associated with a Progressive Web App (PWA).
 */
export interface Application {
  /**
   * The platform where the related application is available.
   * Common values include:
   * - "play": Google Play Store
   * - "itunes": Apple App Store
   * - "windows": Microsoft Store
   * - "webapp": A related web application
   *
   * Other custom platforms can be defined as well.
   */
  readonly platform: "play" | "itunes" | "windows" | "webapp" | string;

  /**
   * The URL where the related application can be downloaded or accessed.
   * This is typically a link to the app store or a web page for the app.
   *
   * Example: "https://play.google.com/store/apps/details?id=com.example.app"
   */
  readonly url: string;

  /**
   * A unique identifier for the application.
   * For Google Play Store, this is usually the package name (e.g., "com.example.app").
   * For iTunes, this might be the app's ID (e.g., "id123456789").
   *
   * This field is optional but recommended for precise identification.
   */
  readonly id?: string;

  /**
   * Specifies the minimum version of the related application that is supported.
   * If a user has a version lower than this, they may be prompted to update.
   *
   * Example: "2" (indicating version 2 or higher is required)
   */
  readonly min_version?: string;

  /**
   * An array of fingerprints used to verify the integrity of the application.
   * This helps ensure that the application is authentic and hasn't been tampered with.
   * Each fingerprint includes a `type` and a `value`.
   *
   * Example:
   * ```
   * fingerprints: [
   *   {
   *     type: "sha256_cert",
   *     value: "92:5A:39:05:C5:B9:EA:BC:71:48:5F:F2"
   *   }
   * ]
   * ```
   */
  readonly fingerprints?: Array<{
    /**
     * The type of fingerprint used for verification.
     * Commonly, "sha256_cert" is used to represent a SHA-256 hash of the app's signing certificate.
     *
     * Custom types can be defined if needed.
     */
    readonly type: "sha256_cert" | string;

    /**
     * The hash value used for verification.
     * This is typically a SHA-256 hash, represented as a colon-separated string of hex values.
     *
     * Example: "92:5A:39:05:C5:B9:EA:BC:71:48:5F:F2"
     */
    readonly value: string;
  }>;
}


type PlatformName = "android" | "appleIcon" | "appleStartup" | "favicons" | "windows" | "yandex";

interface IconSize {
  readonly width: number;
  readonly height: number;
}

interface IconOptions {
  readonly sizes: IconSize[];
  readonly offset?: number;
  readonly background?: string | boolean;
  readonly transparent: boolean;
  readonly rotate: boolean;
  /**
   * @description
   * Refer to `purpose` of [w3.org](https://www.w3.org/TR/appmanifest/#purpose-member)
   */
  readonly purpose?: "badge" | "maskable" | "any";
  readonly pixelArt?: boolean;
}

export default function createFaviconsIntegration(faviconConfig: FaviconConfig): AstroIntegration {
  let config: AstroConfig;

  let source: string, dest: URL, compress: boolean, emit: boolean;
  const mergedConfig = { ...defaultConfig, ...faviconConfig };

  return {
    name: packageName,
    hooks: {
      'astro:config:setup': async ({ config: cfg, updateConfig }) => {
        config = cfg;
        dest = config.publicDir;
        compress = config.compressHTML;

        source = faviconConfig?.masterPicture || "./src/favicon.svg";
        emit = faviconConfig?.emitAssets !== undefined ? faviconConfig?.emitAssets : true;

        updateConfig({ vite: { plugins: [vitePluginFavicons(source, mergedConfig, compress)] } });
      },
      'astro:server:start': async () => {

      },
      'astro:build:start': ({ logger }) => {
        if (emit) {
          createFiles(source, dest, mergedConfig, logger);
        }
      }
    },
  };
}
