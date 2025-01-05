"use client";

import { useTranslation } from "@/i18n";
import { metaTitle } from "@/lib/messages";
import { Button, Center, Group, Stack, Text, Title } from "@mantine/core";
import { IconHome2, IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import classes from "./error.module.css";

function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  const { t } = useTranslation("system");
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <title>{metaTitle(t("error.metaTitle"))}</title>
      <Center className={classes.root}>
        <Stack>
          <div className={classes.label}>400</div>
          <Title className={classes.title}>{t("error.title")}</Title>
          <Text fz="md" ta="center" className={classes.description}>
            {error.toString()}
          </Text>
          <Group justify="center" mt="md">
            <Button leftSection={<IconRefresh size={18} />} variant="subtle" onClick={() => window.location.reload()}>
              {t("error.refresh")}
            </Button>
            <Button variant="subtle" leftSection={<IconHome2 size={18} />} onClick={() => router.push("/")}>
              {t("takeMeHome")}
            </Button>
          </Group>
        </Stack>
      </Center>
    </>
  );
}

export default ErrorPage;
