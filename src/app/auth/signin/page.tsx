import { SigninForm } from "@/components/auth";
import { useServerTranslation } from "@/i18n/server";
import { metaTitle } from "@/lib/messages";
import { Title } from "@mantine/core";

async function Page() {
  const { t } = await useServerTranslation("auth");

  return (
    <>
      <title>{metaTitle(t("signin.metaTitle"))}</title>
      <Title ta="center">{t("signin.title")}</Title>
      <SigninForm />
    </>
  );
}

export default Page;
