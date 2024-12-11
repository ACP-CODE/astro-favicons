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
import { name, version, homepage } from "../config/packge";
import capo from "./capo";

const banner = `Made by \`${name}\` v${version} - ${homepage}`;

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
  const tags = html
    .map((line) =>
      line.replace(
        /(name="(application-name|apple-mobile-web-app-title)")\scontent="[^"]*"/,
        `name="$2" content="${useLocaleName(locale)}"`,
      ),
    )
    .join("\n");

  return `<!--${banner}-->${tags}<!--/Total ${html.length} tag(s)-->`;
};

function injectToHead(ast: ElementNode, locale?: string): boolean {
  let hasInjected = false;

  walkSync(ast, (node) => {
    if (node.type === ELEMENT_NODE && node.name === "head") {
      const alreadyInjected = node.children.some(
        (child) => child.type === COMMENT_NODE && child.value.trim() === banner,
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
