import favicons from "favilib";
import type {
  InputSource,
  FaviconResponse,
  Source,
  PlatformName,
  NamedIconOptions,
  Options,
} from "../types";

async function buildIcons(
  input: Source,
  options: Options,
  platform: PlatformName,
): Promise<FaviconResponse> {
  const iconOptions = Object.fromEntries(
    Object.entries(options.icons).map(([key, value]) => [
      key,
      key === platform ? value : false,
    ]),
  );

  return await favicons(input, {
    ...options,
    icons: iconOptions as Record<
      PlatformName,
      boolean | (string | NamedIconOptions)[]
    >,
  });
}

function mergeResults(
  results: { platform: PlatformName; response: FaviconResponse }[],
): FaviconResponse {
  return results.reduce(
    (acc, { platform, response }) => {
      acc.images.push(
        ...response.images.map((image) => ({ ...image, platform })),
      );
      acc.files.push(...response.files.map((file) => ({ ...file, platform })));
      acc.html.push(...response.html);
      return acc;
    },
    { images: [], files: [], html: [] } as FaviconResponse,
  );
}

export async function collect(
  input: InputSource,
  options: Options,
): Promise<FaviconResponse> {
  const platforms = Object.keys(options.icons) as PlatformName[];
  const results = await Promise.all(
    platforms.map(async (platform) => ({
      platform,
      response: await buildIcons(input?.[platform], options, platform),
    })),
  );
  return mergeResults(results);
}
