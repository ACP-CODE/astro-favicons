import type { AstroIntegrationLogger } from "astro";
import type { Plugin, ResolvedConfig } from "vite";
import { name, type Options } from ".";
import { fetch } from "./core";
import { getInput, normalizePath, mime } from "./helpers";
import { formatTime } from "./utils/timer";
import { styler as $s } from "./utils/styler";

type Params = {
  isRestart: boolean;
  logger: AstroIntegrationLogger;
};

export async function handleAssets(
  opts: Options,
  params: Params,
): Promise<Plugin> {
  const virtualModuleId = `virtual:${name}`;
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  let sources = getInput(opts);

  const startAt = performance.now();
  const { images, files, html } = await fetch(sources, opts);
  const processedTime = performance.now() - startAt;

  const { isRestart, logger } = params;
  let base = normalizePath(opts.output?.assetsPrefix);
  //
  logger.info(
    `${files.length} file(s), ${images.length} image(s)` +
      $s(
        `${!isRestart ? " \u2713 Completed in" : ""} ${formatTime(processedTime)}.`,
        [`${!isRestart ? "FgGreen" : "Dim"}`],
      ),
  );

  // let config: ResolvedConfig;

  return {
    name,
    enforce: "pre",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const html = ${JSON.stringify(html)}; export const opts = ${JSON.stringify(opts)}`;
      }
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const reqUrl = decodeURIComponent(req.url || ""); // 解码整个路径
          const fileName = reqUrl.split("?")[0].split("/").pop(); // 去除参数并获取最后的文件名

          const resource =
            images.find((img) => img.name === fileName) ||
            files.find((file) => file.name === fileName);

          if (resource && req.url?.startsWith(`/${base}${resource?.name}`)) {
            const mimeType = mime(fileName);
            res.setHeader("Content-Type", mimeType);
            res.setHeader("Cache-Control", "no-cache");
            res.end(resource.contents);
            return;
          }

          next(); // 未找到资源时，继续下一个中间件
        } catch (err) {
          console.error("Error in middleware:", err);
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      });
    },

    generateBundle() {
      try {
        const emitFile = (file: {
          name: string;
          contents: Buffer | string;
        }) => {
          const fileId = this.emitFile({
            type: "asset",
            fileName: base + file.name,
            source: file.contents,
          });
        };
        images.forEach((image) => emitFile(image));
        files.forEach((file) => emitFile(file));
      } catch (err) {
        throw err;
      }
    },
  };
}
