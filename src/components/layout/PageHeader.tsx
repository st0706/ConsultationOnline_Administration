"use client";

import { useTranslation } from "@/i18n";
import { Anchor, Box, BoxProps, Breadcrumbs, Flex, Stack, Text, Title } from "@mantine/core";
import { usePathname } from "next/navigation";
import { FC, Fragment } from "react";

type Props = {
  title: string;
  subTitle?: string;
  actions?: any;
  breadcrumbs?: (string | null)[];
} & BoxProps;

const PageHeader: FC<Props> = ({ title, subTitle, actions, breadcrumbs, ...others }) => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);
  const { t } = useTranslation("system");

  return (
    <Box {...others}>
      <Flex
        align="center"
        justify="space-between"
        direction={{ base: "column", sm: "row" }}
        gap={{ base: "sm", sm: 4 }}>
        {subTitle ? (
          <Stack gap={4}>
            <Title order={4} fz={20} fw={500}>
              {title}
            </Title>
            <Text>{subTitle}</Text>
          </Stack>
        ) : (
          <Title order={4} fz={20} fw={500}>
            {title}
          </Title>
        )}
        {actions}
        {pathnames.length > 1 && (
          <Breadcrumbs separator="›" separatorMargin="xs">
            {pathnames.map((path, index) => {
              let label: string | undefined;
              if (index === 0) label = t(`app.${path}`);
              else if (path === "create") label = t(path);
              else if (path === "update") {
                if (index === pathnames.length - 2 && pathnames[index + 1]?.length === 36) return null;

                label = t(path);
              } else if (breadcrumbs && index <= breadcrumbs.length) label = breadcrumbs[index - 1] || path;

              const last = index === pathnames.length - 1;
              // Is uuid
              if (path.length === 36) {
                if (last) label = t("update");
                else return null; // Ignore uuid in the middble
              }

              if (last) {
                return <Fragment key={index}>{label || title}</Fragment>;
              }

              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              return (
                <Anchor href={to} key={index}>
                  {label || path}
                </Anchor>
              );
            })}
          </Breadcrumbs>
        )}
      </Flex>
    </Box>
  );
};

export default PageHeader;
