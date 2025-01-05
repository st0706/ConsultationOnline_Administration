"use client";

import { useTranslation } from "@/i18n";
import { metaTitle } from "@/lib/messages";
import { Button, Center, Group, Stack, Text, Title } from "@mantine/core";
import { IconChevronLeft, IconHome2 } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./error.module.css";

function NotFoundPage() {
  const { t } = useTranslation("system");
  const router = useRouter();

  return (
    <>
      <title>{metaTitle(t("notFound.metaTitle"))}</title>
      <Center className={classes.root}>
        <Stack>
          <div className={classes.label}>404</div>
          <Title className={classes.title}>{t("notFound.title")}</Title>
          <Text ta="center" className={classes.description}>
            {t("notFound.description")}
          </Text>
          <Group justify="center" mt="md">
            <Button
              size="lg"
              variant="subtle"
              leftSection={<IconChevronLeft size={18} />}
              onClick={() => {
                router.back();
              }}>
              {t("notFound.goBack")}
            </Button>
            <Button size="lg" variant="subtle" component={Link} leftSection={<IconHome2 size={18} />} href="/">
              {t("takeMeHome")}
            </Button>
          </Group>
        </Stack>
      </Center>
    </>
  );
}

export default NotFoundPage;
