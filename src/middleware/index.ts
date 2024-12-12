import type { ElementNode } from "ultrahtml";
import {
  parse,
  walkSync,
  renderSync,
  ELEMENT_NODE,
  COMMENT_NODE,
} from "ultrahtml";
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

// export const localizedHTML = (locale?: string) => {
//   if (html.length === 0) return;
//   const tags = html
//     .map((line) =>
//       line.replace(
//         /(name="(application-name|apple-mobile-web-app-title)")\scontent="[^"]*"/,
//         `name="$2" content="${useLocaleName(locale)}"`,
//       ),
//     )
//     .join("\n");

//   return `<!--${flag}-->\n${tags}<!--/ ${formatedName} (${html.length} tags) -->`;
// };

export const localizedHTML = (locale?: string) => {
  if (html.length === 0) return;
  const ast = parse(
    `<!--${flag}-->\n${html.join("\n")}<!--/ ${formatedName} (${html.length} tags) -->`,
  );

  walkSync(ast, (node) => {
    const meta = node.attributes;
    if (
      node.type === ELEMENT_NODE && node.name === "meta" &&
      (meta.name === "application-name" ||
        meta.name === "apple-mobile-web-app-title")
    ) {
      meta.content = useLocaleName(locale);
    }
  });
  return renderSync(ast);
};

function injectToHead(ast: ElementNode, locale?: string): boolean {
  let hasInjected = false;

  walkSync(ast, (node) => {
    if (node.type === ELEMENT_NODE && node.name === "head") {
      const alreadyInjected = node.children.some(
        (child) => child.type === COMMENT_NODE && child.value === flag,
      );
      const injectedHTML = localizedHTML(locale);
      if (!alreadyInjected) {
        const injectedNodes = parse(injectedHTML).children;
        node.children.push(...injectedNodes); // 直接插入为子节点
        hasInjected = true;
      }
    }
  });
  return hasInjected;
}

export const withCapo = defineMiddleware(async (ctx, next) => {
  if (html.length === 0) return next();

  const res = await next();
  if (!res.headers.get("Content-Type").includes("text/html")) {
    return next();
  }

  const doc = await res.text();
  const ast = parse(doc);

  injectToHead(ast, ctx.currentLocale);

  const document = renderSync(ast);

  return new Response(opts.withCapo ? capo(document) : document, {
    status: res.status,
    headers: res.headers,
  });
});

export const onRequest = sequence(withCapo);
