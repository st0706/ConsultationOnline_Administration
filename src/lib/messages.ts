import packageInfo from "package.json";

export function metaTitle(title: string) {
  return `${title} - ${packageInfo.title}`;
}
