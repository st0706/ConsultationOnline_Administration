"use client";
import { PageHeader } from "@/components/layout";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { Paper, Stack } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import OrganizationForm from "../OrganizationForm";

let UpdateOrganizationModal = () => {
  const { t } = useTranslation("system");
  const ORGANIZATION = t("resource.organization");
  const router = useRouter();
  const { notifyResult } = useNotify();
  const searchParams = useSearchParams();
  const organizationId = searchParams.get("organizationId");
  const context = api.useUtils();

  const { data: organization } = api.organization.get.useQuery({
    id: organizationId
  });
  const { mutateAsync: updateOrganization, isLoading } = api.organization.update.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Update, ORGANIZATION, true);
      router.back();
    },
    onError: (e) => {
      notifyResult(Action.Update, ORGANIZATION, false, e.message);
    }
  });

  const handleSubmit = async (values) => {
    await updateOrganization(values);
  };

  return (
    <Stack>
      <PageHeader mb="10" title={t("editTitle", { object: ORGANIZATION })} breadcrumbs={[t("resource.organization")]} />

      <Paper p={{ base: "md", md: "lg", xl: 24 }}>
        {organization && <OrganizationForm isSubmitting={isLoading} data={organization} onSubmit={handleSubmit} />}
      </Paper>
    </Stack>
  );
};

export default UpdateOrganizationModal;
