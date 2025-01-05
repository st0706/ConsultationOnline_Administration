"use client";
import { PageHeader } from "@/components/layout";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { Paper, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import StaffForm from "../StaffForm";

const CreateStaff = () => {
  const { notifyResult } = useNotify();
  const router = useRouter();
  const { t } = useTranslation("hrm");
  const STAFF = t("staff.name");

  const { mutateAsync: create, isLoading: isCreating } = api.practitioner.create.useMutation({
    onSuccess: () => {
      notifyResult(Action.Create, STAFF, true);
      router.back();
    }
  });
  const handleSubmit = (values) => {
    create(values);
  };

  return (
    <Stack>
      <PageHeader mb="10" title={t("addNewTitle", { object: STAFF })} breadcrumbs={[STAFF]} />

      <Paper p={{ base: "md", md: "lg", xl: 24 }}>
        <StaffForm handleSubmit={handleSubmit} isLoading={isCreating} />
      </Paper>
    </Stack>
  );
};

export default CreateStaff;
