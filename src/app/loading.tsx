import { useServerTranslation } from "@/i18n/server";
import { Center, Loader, Stack, Text } from "@mantine/core";

export default async function LoadingPage() {
  const { t } = await useServerTranslation("common");

  return (
    <Center pt={80}>
      <Stack align="center">
        <Loader />
        <Text>{t("loading")}...</Text>
      </Stack>
    </Center>
  );
}
