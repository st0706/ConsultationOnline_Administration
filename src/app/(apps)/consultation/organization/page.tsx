"use client";
import { PageHeader } from "@/components/layout";
import { useTranslation } from "@/i18n";
import { Center, Paper, SegmentedControl, Stack, rem } from "@mantine/core";
import { IconList, IconSitemap } from "@tabler/icons-react";
import { useState } from "react";
import DataGridViewOrganizations from "./DataGridViewOrganizations";
import TreeViewOrganizations from "./TreeViewOrganizations";

const Organizations = () => {
  const [value, setValue] = useState("grid");
  const { t } = useTranslation("system");

  return (
    <Stack>
      <PageHeader
        title={t("organization.manageOrg")}
        breadcrumbs={[t("resource.organization")]}
        actions={
          <SegmentedControl
            value={value}
            onChange={setValue}
            data={[
              {
                value: "grid",
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconList style={{ width: rem(16), height: rem(16) }} />
                    <span>{t("listView")}</span>
                  </Center>
                )
              },
              {
                value: "tree",
                label: (
                  <Center style={{ gap: 10 }}>
                    <IconSitemap style={{ width: rem(16), height: rem(16) }} />
                    <span>{t("treeView")}</span>
                  </Center>
                )
              }
            ]}
          />
        }
      />
      <Paper>{value === "tree" ? <TreeViewOrganizations /> : <DataGridViewOrganizations />}</Paper>
    </Stack>
  );
};

export default Organizations;
