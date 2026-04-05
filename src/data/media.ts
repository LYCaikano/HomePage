import type { HeroPhoto } from "./types";

const autoGalleryModules = import.meta.glob<string>(
  "../assets/gallery/*.{png,jpg,jpeg,webp,avif,svg}",
  {
    eager: true,
    import: "default",
  },
);

function fileLabel(filePath: string) {
  return filePath
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()) ?? "Gallery Image";
}

const autoGalleryPhotos: HeroPhoto[] = Object.entries(autoGalleryModules)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([filePath, src]) => {
    const label = fileLabel(filePath);
    return {
      src,
      alt: `${label} example image.`,
      tone: label,
    };
  });

// Optional manual override examples:
// 1. Public folder images:
//    Place files under `public/images/` and use `/images/your-file.jpg`
// 2. Remote image URLs / image-bed direct links:
//    Use the direct URL string as `src`
// 3. Local file-system paths like `C:/...` are not browser-safe for a deployed site.
//    If you want to use local images, copy them into `src/assets/gallery/` or `public/images/`.
const manualHeroPhotos: HeroPhoto[] = [
  // { src: "/images/example-local-01.jpg", alt: "Local public folder image.", tone: "Local" },
  // { src: "https://images.example.com/hero/example-02.webp", alt: "Remote image-bed sample.", tone: "Remote" },
  // { src: "https://images.example.com/hero/example-03.jpg", alt: "Another remote sample.", tone: "Remote" },
];

export const heroPhotos: HeroPhoto[] =
  manualHeroPhotos.length > 0 ? manualHeroPhotos : autoGalleryPhotos;
