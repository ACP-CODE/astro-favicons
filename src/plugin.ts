import type { AstroConfig, AstroIntegrationLogger } from "astro";
import type { Plugin } from "vite";
import { name, type Options } from ".";
import type { InputSource } from "./types";
import { processing } from "./core";
import { normalizePath, mime } from "./helpers";
import { formatTime } from "./utils/timer";
import { styler as $s } from "./utils/styler";

export async function create(
  source: InputSource,
  opts: Options,
  isRestart: boolean,
  logger: AstroIntegrationLogger,
): Promise<Plugin> {
  let base = normalizePath(opts.output?.assetsPrefix);

  const virtualModuleId = `virtual:${name}`;
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const startAt = performance.now();
  const data = await processing(source, opts);
  const processedTime = performance.now() - startAt;

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
    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const html = ${JSON.stringify(data.html)}; export const opts = ${JSON.stringify(opts)}`;
      }
    },

    async configureServer(server) {
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
        } catch (error) {
          console.error("Error in middleware:", error);
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      });
    },

    async generateBundle() {
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
      } catch (error) {
        throw error;
      }
    },
  };
}
