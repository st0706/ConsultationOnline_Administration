import { Language } from "@/types";

export const defaultLang = "vi";
export const languages = [defaultLang, "en"];
export const defaultNS = "common";
export const cookieLang = "i18next";

export function getOptions(lng = defaultLang, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    // preload: languages,
    defaultLang,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  };
}

export const languageList: Language[] = [
  {
    label: "Tiếng Việt",
    language: "vi",
    image: "https://purecatamphetamine.github.io/country-flag-icons/3x2/VN.svg"
  },
  {
    label: "English",
    language: "en",
    image: "https://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"
  }
];
