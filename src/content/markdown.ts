import MarkdownIt from "markdown-it";
import hljs from "highlight.js/lib/common";

const markdown = new MarkdownIt({
  breaks: true,
  html: false,
  linkify: true,
  typographer: true,
});

const LANGUAGE_ALIASES: Record<string, string> = {
  "c++": "cpp",
  "c#": "csharp",
  cxx: "cpp",
  cc: "cpp",
  cs: "csharp",
  hpp: "cpp",
  hxx: "cpp",
  js: "javascript",
  py: "python",
  rb: "ruby",
  ps1: "powershell",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  plaintext: "text",
};

const LANGUAGE_LABELS: Record<string, string> = {
  bash: "Bash",
  cpp: "C++",
  css: "CSS",
  go: "Go",
  html: "HTML",
  java: "Java",
  javascript: "JavaScript",
  json: "JSON",
  markdown: "Markdown",
  powershell: "PowerShell",
  python: "Python",
  ruby: "Ruby",
  rust: "Rust",
  sql: "SQL",
  text: "TEXT",
  tsx: "TSX",
  typescript: "TypeScript",
  vue: "Vue",
  xml: "XML",
  yaml: "YAML",
};

const staticAssetModules = import.meta.glob<string>(
  ["../assets/**/*.{png,jpg,jpeg,webp,avif,svg,gif,ico}", "./**/*.{png,jpg,jpeg,webp,avif,svg,gif,ico}"],
  {
    eager: true,
    import: "default",
  },
);

function normalizeModulePath(value: string) {
  const stack: string[] = [];

  for (const segment of value.split("/")) {
    if (!segment || segment === ".") {
      continue;
    }

    if (segment === "..") {
      if (stack.length > 0) {
        stack.pop();
      }
      continue;
    }

    stack.push(segment);
  }

  return `/${stack.join("/")}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeLanguage(value: string) {
  const baseLanguage = value.trim().toLowerCase();
  return LANGUAGE_ALIASES[baseLanguage] ?? baseLanguage;
}

function formatLanguageLabel(language: string) {
  if (!language) {
    return "TEXT";
  }

  return (
    LANGUAGE_LABELS[language] ??
    language
      .split(/[-_]/)
      .filter(Boolean)
      .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
      .join(" ")
  );
}

function toLanguageClassToken(language: string) {
  return language.replace(/[^a-z0-9_-]+/g, "-");
}

function highlightCode(content: string, language: string) {
  if (language && hljs.getLanguage(language)) {
    return hljs.highlight(content, {
      language,
      ignoreIllegals: true,
    }).value;
  }

  return escapeHtml(content);
}

function renderCodeBlock(content: string, rawInfo: string) {
  const languageToken = rawInfo.trim().split(/\s+/)[0] ?? "";
  const language = normalizeLanguage(languageToken);
  const languageLabel = formatLanguageLabel(language);
  const normalizedContent = content.replace(/\r\n?/g, "\n").replace(/\n$/, "");
  const lines = normalizedContent ? normalizedContent.split("\n") : [""];
  const isInitiallyExpanded = lines.length <= 30;
  const highlightedContent = highlightCode(normalizedContent, language);
  const lineNumbers = lines.map((_, index) => String(index + 1)).join("\n");
  const languageClass = language ? ` language-${toLanguageClassToken(language)}` : "";
  const encodedContent = encodeURIComponent(normalizedContent);

  return `
<details class="code-block-container"${isInitiallyExpanded ? " open" : ""}>
  <summary class="code-block-header">
    <div class="language-label">${escapeHtml(languageLabel)}</div>
    <span class="toggle-label" aria-hidden="true"></span>
    <div class="code-block-actions">
      <button class="copy-action" type="button" aria-label="复制代码">
        <span class="copy-action__label">复制</span>
        <svg class="copy-action__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 9.75A2.25 2.25 0 0 1 11.25 7.5h7.5A2.25 2.25 0 0 1 21 9.75v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5A2.25 2.25 0 0 1 9 17.25z"></path>
          <path d="M15 7.5V6.75A2.25 2.25 0 0 0 12.75 4.5h-7.5A2.25 2.25 0 0 0 3 6.75v7.5a2.25 2.25 0 0 0 2.25 2.25H6"></path>
        </svg>
      </button>
    </div>
  </summary>
  <div class="code-content">
    <div class="code-scroll">
      <div class="code-gutter" aria-hidden="true">${escapeHtml(lineNumbers)}</div>
      <pre><code class="hljs${languageClass}" data-raw-code="${encodedContent}">${highlightedContent}</code></pre>
    </div>
  </div>
</details>`.trim();
}

const normalizedAssetModules = Object.fromEntries(
  Object.entries(staticAssetModules).map(([filePath, source]) => [
    normalizeModulePath(filePath),
    source,
  ]),
);

function isExternalUrl(value: string) {
  return /^(https?:)?\/\//.test(value) || value.startsWith("mailto:") || value.startsWith("data:");
}

function resolveRelativePath(basePath: string, targetPath: string) {
  const normalizedBase = normalizeModulePath(basePath);
  const baseSegments = normalizedBase.split("/");
  baseSegments.pop();
  return normalizeModulePath(`${baseSegments.join("/")}/${targetPath}`);
}

function resolveAssetSource(source: string, basePath: string) {
  if (!source || isExternalUrl(source) || source.startsWith("/")) {
    return source;
  }

  const resolvedPath = resolveRelativePath(basePath, source);
  return normalizedAssetModules[resolvedPath] ?? source;
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

markdown.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx];
  return renderCodeBlock(token?.content ?? "", token?.info ?? "");
};

markdown.renderer.rules.code_block = (tokens, idx) => {
  const token = tokens[idx];
  return renderCodeBlock(token?.content ?? "", "");
};

export interface MarkdownMeta {
  [key: string]: string | string[] | undefined;
}

export interface MarkdownHeading {
  level: number;
  slug: string;
  text: string;
}

export interface MarkdownDocument<TMeta extends MarkdownMeta = MarkdownMeta> {
  body: string;
  containsCjk: boolean;
  headings: MarkdownHeading[];
  html: string;
  meta: TMeta;
  readingMinutes: number;
  wordCount: number;
}

function slugify(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=<>{}\[\]|\\:;"'?,./]+/g, "")
    .replace(/\s+/g, "-");

  return normalized || "section";
}

function stripMarkdownInlineSyntax(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .trim();
}

function collectHeadings(source: string) {
  const headingSlugCounts = new Map<string, number>();

  return source
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^#{2,6}\s+/.test(line))
    .map((line) => {
      const [, hashes, rawText] = line.match(/^(#{2,6})\s+(.+)$/) ?? [];
      const plainText = stripMarkdownInlineSyntax(rawText ?? "");
      const baseSlug = slugify(plainText);
      const count = headingSlugCounts.get(baseSlug) ?? 0;
      headingSlugCounts.set(baseSlug, count + 1);
      return {
        level: hashes.length,
        text: plainText,
        slug: count === 0 ? baseSlug : `${baseSlug}-${count + 1}`,
      };
    });
}

function normalizeMarkdownForReadingMetrics(source: string) {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1 ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/mailto:\S+/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/[#>*`~|[\]()]|^-+\s+/gm, " ")
    .replace(/(?:^|\s)[*-]\s+/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function analyzeReadingMetrics(source: string) {
  const normalized = normalizeMarkdownForReadingMetrics(source);
  const cjkCharacters = normalized.match(/[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/gu) ?? [];
  const latinTokens =
    normalized
      .replace(/[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/gu, " ")
      .match(/[A-Za-z0-9]+(?:[._'+-][A-Za-z0-9]+)*/g) ?? [];
  const wordCount = cjkCharacters.length + latinTokens.length;
  const estimatedMinutes =
    latinTokens.length / 220 +
    cjkCharacters.length / 300;

  return {
    containsCjk: cjkCharacters.length > 0,
    readingMinutes: wordCount > 0 ? Math.max(1, Math.ceil(estimatedMinutes)) : 0,
    wordCount,
  };
}

const defaultHeadingOpen =
  markdown.renderer.rules.heading_open ??
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

markdown.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const inlineToken = tokens[idx + 1];
  const headingText = inlineToken?.content ?? "";
  const slugState =
    typeof env?.headingSlugCounts === "object" && env.headingSlugCounts !== null
      ? (env.headingSlugCounts as Record<string, number>)
      : {};
  const baseSlug = slugify(headingText);
  const count = slugState[baseSlug] ?? 0;
  slugState[baseSlug] = count + 1;
  env.headingSlugCounts = slugState;
  tokens[idx]?.attrSet("id", count === 0 ? baseSlug : `${baseSlug}-${count + 1}`);
  return defaultHeadingOpen(tokens, idx, options, env, self);
};

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
    const headings = collectHeadings(source);
    const readingMetrics = analyzeReadingMetrics(source);
    return {
      body: source.trim(),
      containsCjk: readingMetrics.containsCjk,
      headings,
      html: markdown.render(source, { basePath }),
      meta: {} as TMeta,
      readingMinutes: readingMetrics.readingMinutes,
      wordCount: readingMetrics.wordCount,
    };
  }

  const endIndex = trimmed.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    const headings = collectHeadings(source);
    const readingMetrics = analyzeReadingMetrics(source);
    return {
      body: source.trim(),
      containsCjk: readingMetrics.containsCjk,
      headings,
      html: markdown.render(source, { basePath }),
      meta: {} as TMeta,
      readingMinutes: readingMetrics.readingMinutes,
      wordCount: readingMetrics.wordCount,
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
  const headings = collectHeadings(body);
  const readingMetrics = analyzeReadingMetrics(body);

  return {
    body,
    containsCjk: readingMetrics.containsCjk,
    headings,
    html: markdown.render(body, { basePath }),
    meta: meta as TMeta,
    readingMinutes: readingMetrics.readingMinutes,
    wordCount: readingMetrics.wordCount,
  };
}

export function renderMarkdown(source: string, basePath = "./about.md") {
  return markdown.render(source, { basePath });
}
