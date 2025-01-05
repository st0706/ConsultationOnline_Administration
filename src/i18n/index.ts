"use client";

import { getCookie } from "cookies-next";
import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import { cookieLang, defaultLang, getOptions } from "./settings";

// on client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: getCookie(cookieLang) || defaultLang,
    detection: {
      order: ["cookie", "htmlTag"],
      caches: ["cookie"]
    }
  });

export const useTranslation = useTranslationOrg;
