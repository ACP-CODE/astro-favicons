import { html, opts } from "virtual:astro-favicons";
import { defineMiddleware, sequence } from "astro/middleware";
import { formatedName, version, homepage } from "../config/packge";
// import capo from "./capo";

const flag = ` Made by ${formatedName} v${version} - ${homepage} `;

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
  if (html.length === 0) return;
  const tags = html
    .map((line) =>
      line.replace(
        /(name="(application-name|apple-mobile-web-app-title)")\scontent="[^"]*"/,
        `name="$2" content="${useLocaleName(locale)}"`,
      ),
    )
    .join("\n");

  return `<!--${flag}-->\n${tags}\n<!--/ ${formatedName} (${html.length} tags) -->`;
};

export const withCapo = defineMiddleware(async (ctx, next) => {
  const res = await next();
  if (!res.headers.get("Content-Type").includes("text/html")) {
    return next();
  }

  const doc = await res.text();
  const headIndex = doc.indexOf("</head>");
  if (headIndex === -1) return next();

  const locale = ctx.currentLocale;
  const hasFlag = (doc: string) => doc.includes(flag);
  const document = `${doc.slice(0, headIndex)}\n${!hasFlag(doc) ? localizedHTML(locale) : ""}${doc.slice(headIndex)}`;

  return new Response(document, {
    status: res.status,
    headers: res.headers,
  });
});

export const onRequest = sequence(withCapo);
