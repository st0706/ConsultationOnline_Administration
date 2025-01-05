import { Button, Group, Paper, rem, Text, TextInput, Title, UnstyledButton } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./page.module.css";
import { useServerTranslation } from "@/i18n/server";
import { metaTitle } from "@/lib/messages";

async function Page() {
  const { t } = await useServerTranslation("auth");

  return (
    <>
      <title>{metaTitle(t("reset.metaTitle"))}</title>
      <Title ta="center">{t("reset.title")}</Title>
      <Text ta="center">{t("reset.subtitle")}</Text>

      <Paper className={classes.card}>
        <TextInput label={t("email")} placeholder={t("email.hint")} required />
        <Group justify="space-between" mt="lg" className={classes.controls}>
          <UnstyledButton component={Link} href="/auth/signin" color="dimmed" className={classes.control}>
            <Group gap={2} align="center">
              <IconChevronLeft stroke={1.5} style={{ width: rem(14), height: rem(14) }} />
              <Text size="sm" ml={5}>
                {t("reset.signin")}
              </Text>
            </Group>
          </UnstyledButton>
          <Button component={Link} href="/">
            {t("reset.button")}
          </Button>
        </Group>
      </Paper>
    </>
  );
}

export default Page;
