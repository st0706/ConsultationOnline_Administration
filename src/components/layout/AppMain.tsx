"use client";

import { FooterNav, HeaderNav, Navigation } from "@/components/layout";
import { useTranslation } from "@/i18n";
import { AppShell, Box, Container, rem, useMantineTheme } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { FC, PropsWithChildren, useEffect, useMemo } from "react";
import classes from "./AppMain.module.css";
import { TLinkList } from "./Navigation";
import { usePathname } from "next/navigation";
import ErrorPage from "@/app/error";

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

type Props = {
  links?: TLinkList;
} & PropsWithChildren;

const AppMain: FC<Props> = ({ links, children }) => {
  const { i18n } = useTranslation();
  const { t } = useTranslation("consultation");
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery("(max-width: 768px)");
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const currentPathname = usePathname();

  const isForbidden = useMemo(() => {
    return links?.at(1)?.links?.some((link) => link.url === currentPathname && link.isValidRole === false);
  }, [links, currentPathname]);

  if (isForbidden) return <ErrorPage error={new Error(t("FORBIDDEN"))} />;

  return (
    <AppShell
      layout="alt"
      header={{ height: 64 }}
      navbar={
        links
          ? {
              width: 240,
              breakpoint: "md",
              collapsed: { mobile: !mobileOpened, desktop: !desktopOpened }
            }
          : undefined
      }
      padding={0}>
      <AppShell.Header
        style={{
          height: rem(64),
          border: "none",
          boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm
        }}>
        <Container fluid py="sm" px="lg">
          <HeaderNav
            hasNav={!!links}
            desktopOpened={desktopOpened}
            mobileOpened={mobileOpened}
            toggleDesktop={toggleDesktop}
            toggleMobile={toggleMobile}
          />
        </Container>
      </AppShell.Header>
      {links && (
        <AppShell.Navbar
          style={{
            border: "none",
            boxShadow: "0px 0px 35px 0px hsla(215,9%,64%,.15)"
          }}>
          <Navigation links={links} onClose={toggleMobile} />
        </AppShell.Navbar>
      )}
      <AppShell.Main>
        <Box px={{ md: "md" }} py="lg" className={classes.main}>
          <Container fluid>
            <DatesProvider settings={{ locale: i18n.language }}>{children}</DatesProvider>
          </Container>
        </Box>
        <Container fluid px="lg" py="xs">
          <FooterNav />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default AppMain;
