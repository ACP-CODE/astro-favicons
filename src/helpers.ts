import path from "path";
import type { InputSource, PlatformName, Source, Input } from "./types";
import { defaultSource as defaults } from "./config/defaults";

function isSource(value: any): value is Source {
  return (
    typeof value === "string" ||
    Buffer.isBuffer(value) ||
    (Array.isArray(value) &&
      value.every((item) => typeof item === "string" || Buffer.isBuffer(item)))
  );
}

export function getInput(input: Input): InputSource {
  const icons: InputSource = {
    favicons: defaults,
    android: defaults,
    appleIcon: defaults,
    appleStartup: defaults,
    windows: defaults,
    yandex: defaults,
  };

  // 如果 input 为空，直接返回 icons
  if (!input) {
    return icons;
  }

  // 如果 input 是单一 Source 类型，返回一个包含所有默认值的对象
  if (isSource(input)) {
    return Object.fromEntries(
      Object.keys(icons).map((key) => [key, input]),
    ) as InputSource;
  }

  // 合并已定义的值
  const unionSource: Source = [
    ...new Set(
      Object.entries(input)
        .filter(([_, value]) => value !== undefined) // 过滤掉未定义的值
        .map(([_, value]) => value) // 获取有效值
        .flat(),
    ),
  ];

  // 创建结果对象并确保未定义的键使用 unionSource
  const result: InputSource = {} as InputSource;

  for (const key of Object.keys(icons) as Array<PlatformName>) {
    result[key] =
      input[key] !== undefined
        ? input[key]!
        : unionSource.length === 1
          ? unionSource[0]
          : unionSource; // 如果 unionSource 长度为1，使用单个值
  }

  return result;
}

export function normalizePath(prefix: string | undefined): string {
  if (!prefix) return "";

  const regex = /^\/+|\/+$/g;
  try {
    const url = new URL(prefix);
    return url.pathname.replace(regex, "") + "/";
  } catch {
    return prefix.replace(regex, "") + "/";
  }
}

export function mime(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase().slice(1); // 获取文件扩展名并转小写

  const contentTypes: Record<string, string> = {
    ico: "image/x-icon",
    png: "image/png",
    svg: "image/svg+xml",
    json: "application/json",
    xml: "application/xml",
    webmanifest: "application/manifest+json",
  };

  return contentTypes[ext] || "application/octet-stream";
}
