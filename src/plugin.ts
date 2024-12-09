import type { AstroIntegrationLogger } from "astro";
import type { Plugin } from "vite";
import { name, type Options } from ".";
import { collect } from "./core";
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
  const data = await collect(sources, opts);
  const processedTime = performance.now() - startAt;

  const { isRestart, logger } = params;
  let base = normalizePath(opts.output?.assetsPrefix);
  //
  logger.info(
    `${data.files.length} file(s), ${data.images.length} image(s)` +
      $s(
        `${!isRestart ? " \u2713 Completed in" : ""} ${formatTime(processedTime)}.`,
        [`${!isRestart ? "FgGreen" : "Dim"}`],
      ),
  );

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
        return `export const html = ${JSON.stringify(data.html)}; export const opts = ${JSON.stringify(opts)}`;
      }
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const reqUrl = decodeURIComponent(req.url || ""); // 解码整个路径
          const resourceName = reqUrl.split("?")[0].split("/").pop(); // 去除参数并获取最后的文件名

          const resource =
            data.images.find((img) => img.name === resourceName) ||
            data.files.find((file) => file.name === resourceName);

          if (resource && req.url?.startsWith(`/${base}${resource?.name}`)) {
            const mimeType = mime(resourceName);
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
        const emitFile = (resource: {
          name: string;
          contents: Buffer | string;
        }) => {
          const fileId = this.emitFile({
            type: "asset",
            fileName: base + resource.name,
            source: resource.contents,
          });
        };

        data.images.forEach((image) => emitFile(image));
        data.files.forEach((file) => emitFile(file));
      } catch (err) {
        throw err;
      }
    },
  };
}
