interface ClearJsonOptions {
  removeIntermediateNodes?: boolean;
  morphemes?: boolean;
  lowNodes?: string[];
  importantNodes?: string[];
}
interface AstNode {
  rule?: string;
  id?: number;
  parent?: number;
  children?: AstNode[] | AstNode;
}
export function postprocessing(ast: unknown, opts: ClearJsonOptions = {}) {
  return clearJson(ast, [null, undefined, "", " "], opts);
}
function isNonEmpty(d: unknown, ignores: unknown[]) {
  return (
    !ignores.includes(d) &&
    (typeof d !== "object" || Object.keys(d as object).length > 0)
  );
}
function clearJson(
  obj: unknown,
  ignores: unknown[] = [null, undefined, "", " "],
  opts: ClearJsonOptions = {}
) {
  let nodeId = 0;
  const parsed = JSON.parse(JSON.stringify(obj), function (_key: string, v: unknown) {
    void _key;
    const node = v as AstNode;
    if (node?.rule) {
      node.id = nodeId;
      nodeId++;
    }
    if (node?.rule && opts.lowNodes?.includes(node.rule)) delete node.children;
    if (
      !opts.morphemes &&
      node?.rule &&
      /^([A-Z]+[0-9]*|comma\b|comma2\b|period\b|end\b)/.test(node.rule)
    ) {
      delete node.children;
    }
    if (node?.rule && node.rule === "end") return;
    if (Array.isArray(v)) return v.filter(Boolean).flat();
    if (node?.children && !Array.isArray(node.children)) {
      node.children = [node.children];
    }
    try {
      if (node?.children && Array.isArray(node.children)) {
        if (opts.removeIntermediateNodes) {
          while (node.children?.length === 1) {
            const first = node.children[0];
            if (!first || (opts.importantNodes ?? []).includes(first.rule ?? "")) break;
            if (!first.children) break;
            node.children = first.children as AstNode[];
          }
        }
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          if (child?.rule && node.id !== undefined) child.parent = node.id;
        }
      }
    } catch {
      // ignore
    }
    if (!isNonEmpty(node, ignores)) return;
    return node;
  }) as AstNode;
  return parsed ?? {};
}
