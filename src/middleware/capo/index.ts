import type { ElementNode } from "ultrahtml";
import { parse, renderSync, ELEMENT_NODE } from "ultrahtml";
import { getWeight } from "./rules.ts";

export default function capo(html: string): string {
  const { headHtml, beforeHead, afterHead } = extractHeadContent(html);

  if (!headHtml) return html;

  // 解析并处理 <head> 的内容
  const headAst = parse(headHtml);
  const headNode = headAst.children.find(
    (node: ElementNode) => node.type === ELEMENT_NODE && node.name === "head",
  );

  if (!headNode) return html; // 安全检查，避免解析错误

  const updatedHead = processHead(headNode);

  // 渲染处理后的 <head> 内容
  const renderedHead = renderSync(updatedHead);

  // 重新组合 HTML
  return `${beforeHead}${renderedHead}${afterHead}`;
}

function extractHeadContent(html: string): {
  headHtml: string | null;
  beforeHead: string;
  afterHead: string;
} {
  const headStart = html.indexOf("<head>");
  const headEnd = html.indexOf("</head>") + "</head>".length;

  if (headStart === -1 || headEnd === -1) {
    return { headHtml: null, beforeHead: html, afterHead: "" };
  }

  const beforeHead = html.slice(0, headStart);
  const headHtml = html.slice(headStart, headEnd);
  const afterHead = html.slice(headEnd);

  return { headHtml, beforeHead, afterHead };
}

function processHead(head: ElementNode): ElementNode {
  const weightedChildren = head.children
    .map((node) => {
      if (node.type === ELEMENT_NODE) {
        const weight = getWeight(node);
        return [weight, node];
      }
    })
    .filter(Boolean) as [number, ElementNode][];

  const sortedChildren = weightedChildren
    .sort((a, b) => b[0] - a[0])
    .map(([_, element]) => element);

  return { ...head, children: sortedChildren };
}
