/**
 * @author Junlin
 * @license MIT
 *
 * Custom middleware for localized app name handling
 */
import { html, opts } from "virtual:astro-favicons";
import { defineMiddleware, sequence } from "astro/middleware";
import capo from "./capo";

const getLocalizedName = (locale: string) => {
  const localized = opts.name_localized?.[locale];
  if (!localized) return opts.name; // If not defined, returns the default value
  return typeof localized === "string" ? localized : localized.value;
};

export const withCapo = defineMiddleware(async (context, next) => {
  const res = await next();
  if (!res.headers.get("Content-Type").includes("text/html")) {
    return next();
  }

  const document = await res.text();
  const headIndex = document.indexOf("</head>");

  if (headIndex === -1) return next();

  const locale = context.currentLocale;
  const localizedName = getLocalizedName(locale);

  const updatedHtml =
    document.slice(0, headIndex) +
    html
      .map((line) =>
        line.replace(
          /(name="(application-name|apple-mobile-web-app-title)")\scontent="[^"]*"/,
          `name="$2" content="${localizedName}"`,
        ),
      )
      .join("\n") +
    document.slice(headIndex);

  return new Response(opts.capo ? capo(updatedHtml) : updatedHtml, {
    status: res.status,
    headers: res.headers,
  });
});

export const onRequest = sequence(withCapo);
