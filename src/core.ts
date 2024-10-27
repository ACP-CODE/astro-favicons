import favicons from "favicons-lib";
import type { FaviconOptions } from "favicons-lib";
import fs from "fs/promises";
import { performance } from "perf_hooks";
import type { AstroIntegrationLogger } from "astro";

interface ManifestLog {
  id: number;
  name: string;
  contents: Buffer<ArrayBufferLike> | string;
  filePath: string;
  startedAt: string;
  excutionTime: number;
}

export const defaultConfig: FaviconOptions = {
  path: "/",
  appName: null,
  appDescription: null,
  dir: "auto",
  lang: "en-GB",
  background: "#fff",
  theme_color: "#fff",
  orientation: "any",
  display: "standalone",
  display_override: ["window-controls-overlay", "standalone"],
  pixel_art: false,
  loadManifestWithCredentials: false,
  manifestRelativePaths: false,
  manifestMaskable: false,
  icons: {
    android: [
      "android-chrome-192x192.png",
      "android-chrome-512x512.png",
    ],
    appleIcon: [
      {
        name: "apple-touch-icon.png",
        sizes: [{ width: 180, height: 180 }],
        rotate: false,
        transparent: false,
        offset: 16
      },
      "safari-pinned-tab.svg",
    ],
    appleStartup: false,
    favicons: true,
    windows: [
      "mstile-150x150.png"
    ],
    yandex: true,
  },
  faviconsDarkMode: false,
};

export function timeMsg(time: Date = new Date()) {
  const now = time || new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `\x1b[2m${hours}:${minutes}:${seconds}\x1b[22m`;
}

export function logInfo(logs: ManifestLog[], totalTime: number, url: URL) {
  console.log(`\n\x1B[42m\x1B[30m generating static assets \x1B[39m\x1B[49m`);
  console.log(`${timeMsg()} \x1B[32m\u25B6\x1B[0m directory: \x1b[34m${url.pathname}\x1b[0m `);
  logs.forEach((log, idx) => {
    let symbol: string = '\u2514\u2500';
    if (idx === logs.length - 1) {
      symbol = '\u2514\u2500';
    } else {
      symbol = '\u251C\u2500'
    }
    console.log(`${log.startedAt}   \x1b[34m${symbol}\x1b[0m \x1B[2m/${log.filePath} (${log.excutionTime.toFixed()}ms)\x1B[22m`)
  });

  console.log(`${timeMsg()} \x1B[32m\u2713 Completed in ${totalTime.toFixed(2)}s.\x1B[39m\n`);
}

function fixOutPath(path: string): string {
  path = path
    // 去除开头结尾多余的 `/` 和 `..`
    .replace(/(?:^\/?)|(?:\/+$)|(?:\.{2}\/)/g, '')
    // 将多个空格替换为单个 `/`
    .replace(/\s+/g, '/')
    // 将开头多个 `/` 替换为空
    .replace(/^\/+/, '');

  if (!path) {
    path = '';
  } else if (!path.endsWith('/')) {
    path += '/';
  }
  return path;
}

export async function createFiles(
  src: string,
  dist: URL,
  options: FaviconOptions,
  logger: AstroIntegrationLogger,
): Promise<{ manifestLogs: ManifestLog[]; totalTime: number; html: string[] }> {
  const startedAt = performance.now();
  let manifestLogs: ManifestLog[] = [];

  let path = fixOutPath(options.path || "/");
  const dest = new URL(path, dist);
  await fs.mkdir(dest, { recursive: true });

  const response = await favicons(src, options);

  logger.info("Parsing options...");
  // logger.info(`emitAssets: \x1b[34m${dest.pathname}\x1b[0m`);

  // Create images
  await Promise.all(
    response.images.map(async (image, index) => {
      const startedAt = performance.now();
      await fs.writeFile(new URL(image.name, dest), image.contents);
      const completedAt = performance.now();
      const excutionTime = completedAt - startedAt;
      manifestLogs.push({
        id: index + manifestLogs.length,
        name: image.name,
        contents: image.contents,
        filePath: `${fixOutPath(options.path || "/")}${image.name}`,
        startedAt: timeMsg(),
        excutionTime,
      })
    }),
  );

  // Create files
  await Promise.all(
    response.files.map(async (file, index) => {
      const startedAt = performance.now();
      await fs.writeFile(new URL(file.name, dest), file.contents);
      const completedAt = performance.now();
      const excutionTime = completedAt - startedAt;
      manifestLogs.push({
        id: index + manifestLogs.length,
        name: file.name,
        contents: file.contents,
        filePath: `${fixOutPath(options.path || "/")}${file.name}`,
        startedAt: timeMsg(),
        excutionTime,
      })
    }),
  );

  const totalTime = (performance.now() - startedAt) / 1000;
  manifestLogs.sort((a, b) => a.id - b.id);
  //
  logInfo(manifestLogs, totalTime, dest);
  logger.info(`${manifestLogs.length} file(s) built in \x1b[1m${totalTime.toFixed(2)}s\x1b[m`);

  const html = response.html;

  return { manifestLogs, totalTime, html };
};

export async function vitePluginFavicons(src: string, options: FaviconOptions, compressHTML: boolean) {
  const response = await favicons(src, options);
  let htmlTags: string;

  if (compressHTML) {
    htmlTags = `${response.html.join('').replaceAll('\n', '')}`;
  } else {
    htmlTags = `\\n\\n\\n${response.html.join('\\n').replace(/(?<!\\n)\\n\\n+(?!\\n)/g, '\n')}\\n\\t`;
  }
  return {
    name: 'vite-plugin-favicons',
    enforce: 'pre' as 'pre',
    transform(html: string) {
      try {
        // console.log(html)
        const regex = /"/g;
        return html.replace('</head>', `${htmlTags.replace(regex, '\\"')}</head>`);
      } catch (error) {
        throw error;
      }
    }
  }
};
