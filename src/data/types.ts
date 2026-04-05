import type { Component } from "vue";

export type ThemeMode = "light" | "dark";

export interface ProfileInfo {
  name: string;
  role: string;
  tagline: string;
  introduction: string;
}

export interface HeroPhoto {
  src: string;
  alt: string;
  tone: string;
}

export interface LinkItem {
  label: string;
  href: string;
  description: string;
  icon: Component;
  featured?: boolean;
  external?: boolean;
}

export interface FooterInfo {
  filingLabel: string;
  filingHref: string;
}
