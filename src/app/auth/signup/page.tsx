import { SignupForm } from "@/components/auth";
import { useServerTranslation } from "@/i18n/server";
import { metaTitle } from "@/lib/messages";
import { Center, Paper, Text, TextProps, Title } from "@mantine/core";
import Link from "next/link";
import classes from "./page.module.css";

async function Page() {
  const { t } = await useServerTranslation("auth");

  const LINK_PROPS: TextProps = {
    className: classes.link
  };

  return (
    <>
      <title>{metaTitle(t("signup.metaTitle"))}</title>
      <Title ta="center">{t("signup.title")}</Title>
      <Text ta="center">{t("signup.subtitle")}</Text>

      <Paper className={classes.card}>
        <SignupForm />
        <Center mt="md">
          <Text size="sm" component={Link} href="/auth/signin" {...LINK_PROPS}>
            {t("signup.signin")}
          </Text>
        </Center>
      </Paper>
    </>
  );
}

export default Page;
