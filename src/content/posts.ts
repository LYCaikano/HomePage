import { parseMarkdownDocument } from "./markdown";

export interface BlogPostSummary {
  body: string;
  date?: string;
  html: string;
  slug: string;
  summary?: string;
  tags: string[];
  title: string;
}

const postModules = import.meta.glob<string>("./posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

export const blogPosts: BlogPostSummary[] = Object.entries(postModules)
  .map(([filePath, source]) => {
    const slug = filePath.split("/").pop()?.replace(/\.md$/, "") ?? "post";
    const document = parseMarkdownDocument(source, filePath);
    return {
      slug,
      body: document.body,
      html: document.html,
      title: typeof document.meta.title === "string" ? document.meta.title : slug,
      date: typeof document.meta.date === "string" ? document.meta.date : undefined,
      summary: typeof document.meta.summary === "string" ? document.meta.summary : undefined,
      tags: Array.isArray(document.meta.tags)
        ? document.meta.tags
        : typeof document.meta.tags === "string"
          ? [document.meta.tags]
          : [],
    };
  })
  .sort((left, right) => (right.date ?? "").localeCompare(left.date ?? ""));
