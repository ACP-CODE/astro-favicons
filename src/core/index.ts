import favicons from "favilib";
import type {
  InputSource,
  FaviconResponse,
  Source,
  PlatformName,
  NamedIconOptions,
  Options,
} from "../types";

type Platformed<T> = T & { platform: PlatformName };

type PlatformedResponse = {
  readonly images: Platformed<FaviconResponse["images"][number]>[];
  readonly files: Platformed<FaviconResponse["files"][number]>[];
  readonly html: FaviconResponse["html"];
};

// type PlatformedResponse = {
//   [K in keyof FaviconResponse]: Platformed<FaviconResponse[K][number]>[];
// };

type Params = {
  platform: PlatformName;
  options?: Options;
  response?: FaviconResponse;
};

async function getIconsForPlatform(
  input: Source,
  params: Params,
): Promise<FaviconResponse> {
  const { options, platform } = params;

  const offOptions = Object.fromEntries(
    Object.entries(options.icons).map(([key, value]) => [
      key,
      key === platform ? value : false, // 将其他平台设置为 false
    ]),
  );

  return await favicons(input, {
    ...options,
    icons: offOptions as Record<
      PlatformName,
      boolean | (string | NamedIconOptions)[]
    >,
  });
}

function mergeResults(results: Params[]): PlatformedResponse {
  return results.reduce(
    (acc, { platform, response: res }) => {
      acc.images.push(...res.images.map((image) => ({ ...image, platform })));
      acc.files.push(...res.files.map((file) => ({ ...file, platform })));
      acc.html.push(...res.html);
      return acc;
    },
    { images: [], files: [], html: [] } as PlatformedResponse,
  );
}

export async function fetch(
  input: InputSource,
  options: Options,
): Promise<PlatformedResponse> {
  const platforms = Object.keys(options.icons) as PlatformName[];
  const results = await Promise.all(
    platforms.map(async (platform) => ({
      platform,
      response: await getIconsForPlatform(input?.[platform], {
        platform,
        options,
      }),
    })),
  );
  return mergeResults(results);
}
