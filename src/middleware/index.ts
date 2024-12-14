import { html, opts } from "virtual:astro-favicons";
import { defineMiddleware, sequence } from "astro/middleware";
import { formatedName, version, homepage } from "../config/packge";
import capo from "./capo";

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

  return html
    .map((line) =>
      line.replace(namePattern, `name="$2" content="${useLocaleName(locale)}"`),
    )
    .join("\n");
};

const withCapo = defineMiddleware(async (ctx, next) => {
  console.log(html)
  if (html.length === 0) return next();
  
  const res = await next();
  if (!res.headers.get("Content-Type").includes("text/html")) {
    return next();
  }

  const doc = await res.text();

  const locale = ctx.currentLocale;
  const favicons = localizedHTML(locale);
  const headIndex = doc.indexOf("</head>");
  const isInjected = doc.includes(favicons);
  if (headIndex === -1) return next();

  const document = `${doc.slice(0, headIndex)}\n${!isInjected ? favicons : ""}\n${doc.slice(headIndex)}`;

  return new Response(opts.withCapo ? capo(document) : document, {
    status: res.status,
    headers: res.headers,
  });
});

export const onRequest = sequence(withCapo);
