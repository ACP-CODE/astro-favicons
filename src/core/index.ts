import favicons from "favilib";
import type {
  InputSource,
  FaviconResponse,
  Source,
  PlatformName,
} from "../types";
import type { Options } from "..";

async function generateIcons(
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
    // @ts-ignore
    icons: iconOptions,
  });
}

function mergeResponses(
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

export async function processing(
  input: InputSource,
  options: Options,
): Promise<FaviconResponse> {
  const platforms = Object.keys(options.icons) as PlatformName[];
  const results = await Promise.all(
    platforms.map(async (platform) => ({
      platform,
      response: await generateIcons(input?.[platform], options, platform),
    })),
  );
  return mergeResponses(results);
}
