"use client";

import { PageHeader } from "@/components/layout";
import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/trpc/react";
import { Paper, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AppointmentForm from "../AppointmentForm";
import { useAuthStore } from "@/components/auth/AuthContext";
import { isValidRole } from "@/lib/common";
import { AppointmentRole } from "@/types/enums";
import ErrorPage from "@/app/error";

const CreateAppointmentPage = () => {
  const { t } = useTranslation("consultation");
  const APPOINTMENT = t("appointment.name");
  const context = api.useUtils();
  const { notifyResult } = useNotify();
  const router = useRouter();

  const { mutateAsync: create, isLoading } = api.appointment.create.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Create, APPOINTMENT, true);
      router.back();
    },
    onError: (e) => {
      notifyResult(Action.Create, APPOINTMENT, false, e.message);
    }
  });

  const handleSubmit = async (value) => {
    await create(value);
  };

  const userRole = useAuthStore()((state) => state.authUser?.session?.access_token?.user_role);

  if (!isValidRole(userRole, [AppointmentRole.Admin, AppointmentRole.Moderator])) {
    return <ErrorPage error={new Error(t("FORBIDDEN"))} />;
  }

  return (
    <Stack>
      <PageHeader mb="10" title={t("addNewTitle", { object: APPOINTMENT })} breadcrumbs={[APPOINTMENT]} />
      <Paper p={{ base: "md", md: "lg", xl: 24 }}>
        <AppointmentForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </Paper>
    </Stack>
  );
};

export default CreateAppointmentPage;
