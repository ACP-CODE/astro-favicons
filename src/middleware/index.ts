import { html, opts } from "virtual:astro-favicons";
import { defineMiddleware, sequence } from "astro/middleware";
import capo from "./capo";

const useLocaleName = (locale?: string) => {
  if (!locale) return opts.name;

  const localized = opts.name_localized?.[locale];
  if (!localized) return opts.name;

  return typeof localized === "string" ? localized : localized.value;
};

export const localizedHTML = (locale?: string) => {
  const namePattern =
    /(name="(application-name|apple-mobile-web-app-title)")\scontent="[^"]*"/;

  const tags = html
    .map((line) =>
      line.replace(namePattern, `name="$2" content="${useLocaleName(locale)}"`),
    )
    .join("\n");

  return tags;
};

const withCapo = defineMiddleware(async (ctx, next) => {
  let originalResponse;
  try {
    if (html.length === 0) return next();

    const originalResponse = await next();
    if (!originalResponse.headers.get("Content-Type")?.includes("text/html")) {
      return originalResponse;
    }

    const doc = await originalResponse.text();
    const headIndex = doc.indexOf("</head>");

    const htmlSet = new Set(html);
    const isInjected = [...htmlSet].some((line) => doc.includes(line));
    if (headIndex === -1 || (!opts.withCapo && isInjected)) return originalResponse;

    const document = `${doc.slice(0, headIndex)}\n${!isInjected ? localizedHTML(ctx.currentLocale) : ""}\n${doc.slice(headIndex)}`;

    return new Response(opts.withCapo ? capo(document) : document, {
      status: originalResponse.status,
      headers: originalResponse.headers,
    });
  } catch (e) {
    if (e !== "done") {
      console.error("Error in withCapo middleware:", e);
    }
    return originalResponse || next();
  }
});

export const onRequest = sequence(withCapo);
