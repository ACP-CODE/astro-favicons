/**
 * @author Junlin
 * @license MIT
 *
 * Custom middleware for localized app name handling
 */
// @ts-ignore
import { html, opts } from "virtual:astro-favicons";
import { defineMiddleware } from "astro/middleware";
import capo from "./capo";

const getLocalizedName = (locale) => {
  const localized = opts.name_localized?.[locale];
  if (!localized) return opts.name; // If not defined, returns the default value
  return typeof localized === "string" ? localized : localized.value;
};

// Only `onRequest` name can be used
export const onRequest = defineMiddleware(async (context, next) => {
  const locale = context.currentLocale;
  const localizedName = getLocalizedName(locale);

  const res = await next();
  const resHtml = await res.text();

  const headIndex = resHtml.indexOf("</head>");
  const updatedHtml =
    resHtml.slice(0, headIndex) +
    html
      .map((line) => {
        // Dynamically replace the content of `application-name` and `apple-mobile-web-app-title`
        if (line.includes('name="application-name"')) {
          return line.replace(/content="[^"]*"/, `content="${localizedName}"`);
        }
        if (line.includes('name="apple-mobile-web-app-title"')) {
          return line.replace(/content="[^"]*"/, `content="${localizedName}"`);
        }
        return line; // The lines that do not need to be replaced are kept
      })
      .join("\n") +
    resHtml.slice(headIndex);

  return new Response(opts.capo ? capo(updatedHtml) : updatedHtml, {
    status: res.status,
    headers: res.headers,
  });
});
