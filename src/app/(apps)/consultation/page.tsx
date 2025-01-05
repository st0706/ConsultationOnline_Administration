"use client";
import { FilterDateMenu } from "@/components/common";
import { PageHeader } from "@/components/layout";
import { useTranslation } from "@/i18n";
import { ActionIcon, Flex, Stack } from "@mantine/core";

import { IconRefresh } from "@tabler/icons-react";

export default function System() {
  const { t } = useTranslation("consultation");

  return (
    <Stack>
      <PageHeader
        title={t("dashboard")}
        actions={
          <Flex align="center" gap="sm">
            <ActionIcon size="lg" radius="xl" variant="light" color="gray">
              <IconRefresh size={16} />
            </ActionIcon>
            <FilterDateMenu />
          </Flex>
        }
      />
    </Stack>
  );
}
