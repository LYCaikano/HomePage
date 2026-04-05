import {
  BriefcaseBusiness,
  Globe,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-vue-next";
import type { LinkItem } from "./types";

export const navigationLinks: LinkItem[] = [
  {
    label: "About",
    href: "/about.html",
    description: "A short profile page.",
    icon: UserRound,
    external: false,
  },
  {
    label: "Blog",
    href: "https://your-blog.example",
    description: "Writing and notes.",
    icon: Globe,
    featured: true,
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/your-handle",
    description: "Code and experiments.",
    icon: BriefcaseBusiness,
    featured: true,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:hello@example.com",
    description: "Direct contact.",
    icon: Mail,
    external: true,
  },
  {
    label: "Social",
    href: "https://social.example",
    description: "One more place online.",
    icon: Sparkles,
    external: true,
  },
];

export function selectLinks(labels: string[]) {
  return labels
    .map((label) => navigationLinks.find((item) => item.label === label))
    .filter((item): item is LinkItem => item !== undefined);
}
