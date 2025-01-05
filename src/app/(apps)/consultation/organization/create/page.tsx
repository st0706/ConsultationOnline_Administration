"use client";

import { PageHeader } from "@/components/layout";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { Paper, Stack } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import OrganizationForm from "../OrganizationForm";

const Create = () => {
  const { t } = useTranslation("system");
  const ORGANIZATION = t("resource.organization");
  const router = useRouter();
  const searchParams = useSearchParams();
  const organizationId = searchParams.get("organizationId")?.length === 0 ? null : searchParams.get("organizationId");
  const { notifyResult } = useNotify();
  const context = api.useUtils();

  const { mutateAsync: createOrganization, isLoading } = api.organization.create.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Create, ORGANIZATION, true);
      router.back();
    },
    onError: (e) => {
      notifyResult(Action.Create, ORGANIZATION, false, e.message);
    }
  });

  const handleSubmit = async (values: any) => {
    await createOrganization(values);
  };

  return (
    <Stack>
      <PageHeader
        mb="10"
        title={t("addNewTitle", { object: ORGANIZATION })}
        breadcrumbs={[t("resource.organization")]}
      />

      <Paper p={{ base: "md", md: "lg", xl: 24 }}>
        <OrganizationForm isSubmitting={isLoading} partOfId={organizationId} onSubmit={handleSubmit} />
      </Paper>
    </Stack>
  );
};
export default Create;
