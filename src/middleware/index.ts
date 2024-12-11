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
import { name } from "..";
import capo from "./capo";

const banner = `${html.length} Tag(s) made by ${name}`;

const useLocaleName = (locale?: string) => {
  if (!locale) return opts.name;
  const localized = opts.name_localized?.[locale];
  return localized
    ? typeof localized === "string"
      ? localized
      : localized.value
    : opts.name;
};

export const useLocaleHTML = (locale?: string) => {
  const tags = html
    .map((line) =>
      line.replace(
        /(name="(application-name|apple-mobile-web-app-title)")\scontent="[^"]*"/,
        `name="$2" content="${useLocaleName(locale)}"`,
      ),
    )
    .join("\n");

  return `<!--${banner}-->\n${tags}\n<!--/${banner}-->`;
};

function injectToHead(ast: ElementNode, locale?: string): boolean {
  let hasInjected = false;
  const injectedHTML = useLocaleHTML(locale);

  walkSync(ast, (node) => {
    if (node.type === ELEMENT_NODE && node.name === "head") {
      const alreadyInjected = node.children.some(
        (child) => child.type === COMMENT_NODE && child.value.trim() === banner,
      );
      if (!alreadyInjected) {
        const injectedNodes = parse(injectedHTML).children;
        node.children.push(...injectedNodes); // 直接插入为子节点
        hasInjected = true;
      }
    }
  });
  return hasInjected;
}

export const withCapo = defineMiddleware(async (context, next) => {
  const res = await next();
  if (!res.headers.get("Content-Type").includes("text/html")) {
    return next();
  }

  const doc = await res.text();
  const ast = parse(doc);

  injectToHead(ast, context.currentLocale);

  const document = renderSync(ast);

  return new Response(opts.capo ? capo(document) : document, {
    status: res.status,
    headers: res.headers,
  });
});

export const onRequest = sequence(withCapo);
