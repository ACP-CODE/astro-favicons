import { html, opts } from "virtual:astro-favicons";
import { defineMiddleware, sequence } from "astro/middleware";
import capo from "./capo";

const useLocaleName = (locale?: string) => {
  if (!locale) return opts.name;
  const localized = opts.name_localized?.[locale];
  return localized
    ? typeof localized === "string"
      ? localized
      : localized.value
    : opts.name;
};

export const localizedHTML = (locale?: string) => {
  const namePattern =
    /(name="(application-name|apple-mobile-web-app-title)")\scontent="[^"]*"/;

  const tags =  html
    .map((line) =>
      line.replace(namePattern, `name="$2" content="${useLocaleName(locale)}"`),
    )
    .join("\n");

  return tags;
};

const withCapo = defineMiddleware(async (ctx, next) => {
  if (html.length === 0) return next();
  
  const res = await next();
  if (!res.headers.get("Content-Type").includes("text/html")) {
    return next();
  }

  const doc = await res.text();

  const headIndex = doc.indexOf("</head>");
  if (headIndex === -1) return next();
  
  const htmlSet = new Set(html);
  const isInjected = [...htmlSet].some((line) => doc.includes(line));
  const locale = ctx.currentLocale;

  const document = `${doc.slice(0, headIndex)}\n${!isInjected ? localizedHTML(locale) : ""}\n${doc.slice(headIndex)}`;

  return new Response(opts.withCapo ? capo(document) : document, {
    status: res.status,
    headers: res.headers,
  });
});

export const onRequest = sequence(withCapo);
