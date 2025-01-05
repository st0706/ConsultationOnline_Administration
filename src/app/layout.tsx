import { detectLanguage, useServerTranslation } from "@/i18n/server";
import { themeAnPhat } from "@/theme";
import { TRPCReactProvider } from "@/trpc/react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { dir } from "i18next";
import { Open_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";

import "@mantine/carousel/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import "./global.css";
import "@mantine/charts/styles.css";
import "mantine-react-table/styles.css"; //import MRT styles
// If loading a variable font, you don't need to specify the font weight
const openSans = Open_Sans({
  subsets: ["vietnamese"],
  display: "swap"
});

export default async function RootLayout({ children }: PropsWithChildren) {
  const lang = detectLanguage();
  const { t } = await useServerTranslation("common");

  return (
    <html lang={lang} dir={dir(lang)}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.desc")} />
        <ColorSchemeScript />
      </head>
      <body className={openSans.className}>
        <MantineProvider theme={themeAnPhat} defaultColorScheme="auto">
          <Notifications position="bottom-right" zIndex={1000} />
          <TRPCReactProvider cookies={cookies().toString()}>
            <ModalsProvider>{children}</ModalsProvider>
          </TRPCReactProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
