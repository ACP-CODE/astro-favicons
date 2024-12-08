import type { PlatformName } from "favilib";

export type {
  FaviconOptions,
  NamedIconOptions,
  PlatformName,
  FaviconResponse,
  FaviconFile,
  FaviconImage,
} from "favilib";

export type Source = string | Buffer | (string | Buffer)[];
export type InputSource = Record<PlatformName, Source>;
export type Input = Source | Partial<InputSource>;

export type { ManifestFile } from "./ManifestFile";
