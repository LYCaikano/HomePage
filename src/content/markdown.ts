import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({
  breaks: true,
  html: false,
  linkify: true,
  typographer: true,
});

const staticAssetModules = import.meta.glob<string>(
  ["../assets/**/*.{png,jpg,jpeg,webp,avif,svg,gif,ico}", "./**/*.{png,jpg,jpeg,webp,avif,svg,gif,ico}"],
  {
    eager: true,
    import: "default",
  },
);

function isExternalUrl(value: string) {
  return /^(https?:)?\/\//.test(value) || value.startsWith("mailto:") || value.startsWith("data:");
}

function resolveRelativePath(basePath: string, targetPath: string) {
  const segments = basePath.split("/");
  segments.pop();

  for (const segment of targetPath.split("/")) {
    if (!segment || segment === ".") {
      continue;
    }

    if (segment === "..") {
      segments.pop();
      continue;
    }

    segments.push(segment);
  }

  return segments.join("/");
}

function resolveAssetSource(source: string, basePath: string) {
  if (!source || isExternalUrl(source) || source.startsWith("/")) {
    return source;
  }

  const resolvedPath = resolveRelativePath(basePath, source);
  return staticAssetModules[resolvedPath] ?? source;
}

const defaultLinkOpen =
  markdown.renderer.rules.link_open ??
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx]?.attrGet("href") ?? "";
  const basePath = typeof env?.basePath === "string" ? env.basePath : "./about.md";
  const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");

  if (isExternal) {
    tokens[idx]?.attrSet("target", "_blank");
    tokens[idx]?.attrSet("rel", "noopener noreferrer");
  } else if (href.endsWith(".md")) {
    const resolvedPath = resolveRelativePath(basePath, href);
    if (resolvedPath === "./about.md") {
      tokens[idx]?.attrSet("href", "/about.html");
    }
  }

  return defaultLinkOpen(tokens, idx, options, env, self);
};

const defaultImageRender =
  markdown.renderer.rules.image ??
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

markdown.renderer.rules.image = (tokens, idx, options, env, self) => {
  const basePath = typeof env?.basePath === "string" ? env.basePath : "./about.md";
  const source = tokens[idx]?.attrGet("src") ?? "";
  tokens[idx]?.attrSet("src", resolveAssetSource(source, basePath));
  tokens[idx]?.attrSet("loading", "lazy");
  tokens[idx]?.attrSet("decoding", "async");
  return defaultImageRender(tokens, idx, options, env, self);
};

export interface MarkdownMeta {
  [key: string]: string | string[] | undefined;
}

export interface MarkdownDocument<TMeta extends MarkdownMeta = MarkdownMeta> {
  body: string;
  html: string;
  meta: TMeta;
}

function normalizeMetaValue(value: string) {
  if (value.includes(",")) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value.trim();
}

export function parseMarkdownDocument<TMeta extends MarkdownMeta = MarkdownMeta>(
  source: string,
  basePath = "./about.md",
): MarkdownDocument<TMeta> {
  const trimmed = source.trimStart();

  if (!trimmed.startsWith("---\n")) {
    return {
      body: source.trim(),
      html: markdown.render(source, { basePath }),
      meta: {} as TMeta,
    };
  }

  const endIndex = trimmed.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return {
      body: source.trim(),
      html: markdown.render(source, { basePath }),
      meta: {} as TMeta,
    };
  }

  const frontmatterBlock = trimmed.slice(4, endIndex).trim();
  const body = trimmed.slice(endIndex + 5).trim();
  const meta = frontmatterBlock
    .split("\n")
    .reduce<Record<string, string | string[]>>((accumulator, line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      if (!key || !value) {
        return accumulator;
      }

      accumulator[key] = normalizeMetaValue(value);
      return accumulator;
    }, {});

  return {
    body,
    html: markdown.render(body, { basePath }),
    meta: meta as TMeta,
  };
}

export function renderMarkdown(source: string, basePath = "./about.md") {
  return markdown.render(source, { basePath });
}
