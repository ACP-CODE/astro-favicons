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
  const namePattern =
    /(name="(application-name|apple-mobile-web-app-title)")\scontent="[^"]*"/;

  const tags = html
    .map((line) =>
      line.replace(namePattern, `name="$2" content="${useLocaleName(locale)}"`),
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

  const isInjected = doc.includes(flag);
  const locale = ctx.currentLocale;
  const document = `${doc.slice(0, headIndex)}\n${!isInjected ? localizedHTML(locale) : ""}\n${doc.slice(headIndex)}`;

  return new Response(document, {
    status: res.status,
    headers: res.headers,
  });
});

export const onRequest = sequence(withCapo);
