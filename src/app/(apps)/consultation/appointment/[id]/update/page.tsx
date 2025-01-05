"use client";

import { PageHeader } from "@/components/layout";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { Stack } from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import AppointmentForm from "../../AppointmentForm";
import { useAuthStore } from "@/components/auth/AuthContext";
import { isValidRole } from "@/lib/common";
import { AppointmentRole } from "@/types/enums";
import ErrorPage from "@/app/error";

const UpdateAppointment = () => {
  const userRole = useAuthStore()((state) => state.authUser?.session?.access_token?.user_role);
  const params = useParams();
  const { notifyResult } = useNotify();
  const context = api.useUtils();
  const router = useRouter();
  const { t } = useTranslation("consultation");
  const APPOINTMENT = t("appointment.name");

  const { data: data, isLoading: getDataLoading } = api.appointment.getById.useQuery(params.id as string);
  const { mutateAsync: update, isLoading: updateLoading } = api.appointment.update.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Update, APPOINTMENT, true);
      router.back();
    },
    onError: async (err: any) => {
      notifyResult(Action.Update, APPOINTMENT, false, err.message);
    }
  });

  const handleSubmit = async (values: any) => {
    await update(values);
  };

  if (!isValidRole(userRole, [AppointmentRole.Admin, AppointmentRole.Moderator])) {
    return <ErrorPage error={new Error(t("FORBIDDEN"))} />;
  }

  return (
    <Stack>
      <PageHeader mb="10" title={t("editTitle", { object: APPOINTMENT })} breadcrumbs={[APPOINTMENT]} />
      {data && <AppointmentForm AppointmentData={data} onSubmit={handleSubmit} />}
    </Stack>
  );
};

export default UpdateAppointment;
