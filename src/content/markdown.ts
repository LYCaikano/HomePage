import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({
  breaks: true,
  html: false,
  linkify: true,
  typographer: true,
});

const defaultLinkOpen =
  markdown.renderer.rules.link_open ??
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx]?.attrGet("href") ?? "";
  const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");

  if (isExternal) {
    tokens[idx]?.attrSet("target", "_blank");
    tokens[idx]?.attrSet("rel", "noopener noreferrer");
  }

  return defaultLinkOpen(tokens, idx, options, env, self);
};

const defaultImageRender =
  markdown.renderer.rules.image ??
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

markdown.renderer.rules.image = (tokens, idx, options, env, self) => {
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
): MarkdownDocument<TMeta> {
  const trimmed = source.trimStart();

  if (!trimmed.startsWith("---\n")) {
    return {
      body: source.trim(),
      html: markdown.render(source),
      meta: {} as TMeta,
    };
  }

  const endIndex = trimmed.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return {
      body: source.trim(),
      html: markdown.render(source),
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
    html: markdown.render(body),
    meta: meta as TMeta,
  };
}

export function renderMarkdown(source: string) {
  return markdown.render(source);
}
