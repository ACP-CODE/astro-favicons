<div align="center">

**Latest Updates! 🎉 See the [change log](./CHANGELOG.md) for details.**

# astro-favicons
A Multi-platform, All Browser Favicon generator for [Astro](https://astro.build/) Project.


[Features](#features) · [Installation](#installation) · [Usage](#usage) · [Configuration](#configuration) · [Change Log](/CHANGELOG.md)

</div>

## Key Features

- Generates and inserts standard-compliant favicon link tags.
- Automatically creates favicon assets for different environments using one source file.
- Simplify or optimize communication between teams to avoid missing files.


## Installation

> This package is compatible with Astro 2.0 and above, which support the Integrations API.

```sh
npm install astro-favicons
```

## Usage

<details>

<summary>Adding the configuration for Integration.</summary>

To use this integration, add it to your `astro.config.*` file using the integrations property:

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import robots from "astro-favicons"; // Add code manually

export default defineConfig({
  compressHTML: import.meta.env.PROD,

  integrations: [
    favicons({
      // masterPicture: "./src/favicon.svg",
      // emitAssets: true,

      // You should adjust the following options accordingly
      appName: "",
      appShortName: "",
      appDescription: "",
      // dir:"auto",
      lang: "en-US",
      // display: "standalone",
      // orientation: "any",
      // start_url: "/?homescreen=1",
      background: "#fff",
      theme_color: "#fff",
      // appleStatusBarStyle: "black-translucent",

      //....
    }),
  ],
});
```

</details>

<details>

<summary>Generate favicons from masterPicture. </summary>

1. Provide a `favicon.svg` image in the `src` directory.

2. Run `npm run dev` or `npm run build` in terminal.<br>
   Following HTML Code will **automatically insert** in the `head` section of all pages.

```html
<!-- Astro Favicons v0.2.0 - https://github.com/ACP-CODE/astro-favicons -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#fff" />
<meta name="application-name" content="Your Application Name" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta ame="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
<meta name="apple-mobile-web-app-title" content="Application Name" />
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#fff" />
<meta name="msapplication-TileColor" content="#fff" />
<meta name="msapplication-config" content="/browserconfig.xml" />
<link rel="yandex-tableau-widget" href="/yandex-browser-manifest.json" />
<!--  Astro Favicons -->
```

> If [compressHTML](https://docs.astro.build/en/reference/configuration-reference/#compresshtml) default, it will be compressed

3. Emit or not emit assets by `emitAssets` options.

```sh
npm run build
```

```sh
/
├── public/
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── browserconfig.xml
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon-48x48.png
│   ├── favicon.ico
│   ├── manifest.webmanifest
│   ├── mstile-150x150.png
│   ├── safari-pinned-tab.svg
│   ├── yandex-browser-50x50.png
│   └── yandex-browser-manifest.json
├── src/
│   └── faicon.svg
└── package.json
```

> The default output is a total of **13 files**, which will reach **61 files** in full configuration

</details>

## Configuration

 ### Base Options

This is the underlying API of the plugin `masterPicture` and `emitAssets`

```ts
export default defineConfig({
  integrations: [
    favicons({
      masterPicture: "./src/favicon.svg",
      emitAssets: true,
    }),
  ],
});
```

### Core Options

Since FaviconConfig extends FaviconOptions, please refer to [favicons](https://www.npmjs.com/package/favicons) or JSDOc of favicons-lib for other available interfaces.

> **Difference：** I simply added the `Safari` platform on top of favcions to support `safari-pinned-tab.svg` generation and tag logging.

Future upgrades of the core may be spent more on the favicons-lib library 

## Need Help or Feedback?

Submit your issues or feedback on our [GitHub](https://github.com/ACP-CODE/astro-favicons/issues) channel.

## Changelog

Check out the [CHANGELOG.md](CHANGELOG.md) file for a history of changes to this integration.
