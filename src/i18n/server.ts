import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { getCookie } from "cookies-next";
import { initReactI18next } from "react-i18next/initReactI18next";
import { cookieLang, defaultLang, getOptions } from "./settings";

const initI18next = async (lng, ns) => {
  // on server side we create a new instance for each render, because during compilation everything seems to be executed in parallel
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`)))
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export function detectLanguage() {
  const language = getCookie(cookieLang);
  return language || defaultLang;
}

export async function useServerTranslation(ns, options: any = {}) {
  const lang = detectLanguage();
  const i18nextInstance = await initI18next(lang, ns);
  return {
    t: i18nextInstance.getFixedT(lang, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance
  };
}
