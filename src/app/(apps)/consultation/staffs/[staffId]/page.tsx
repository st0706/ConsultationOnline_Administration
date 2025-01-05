"use client";

import { PageHeader } from "@/components/layout";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { Paper, Stack, Tabs } from "@mantine/core";
import { HumanName } from "fhir/r5";
import { useParams, useRouter } from "next/navigation";
import StaffForm from "../StaffForm";
import { getOfficialName } from "@/lib/common";

const UpdateStaff = () => {
  const params = useParams();
  const staffId = params.staffId as string;
  const { notifyResult } = useNotify();
  const context = api.useUtils();
  const router = useRouter();
  const { t } = useTranslation("hrm");
  const STAFF = t("staff.name");

  const { data: staffData, isLoading: getStaffDataLoading } = api.practitioner.getByStaffId.useQuery(staffId);
  const { mutateAsync: update, isLoading: isUpdating } = api.practitioner.update.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Update, STAFF, true);
      router.back();
    },
    onError: async (err: any) => {
      notifyResult(Action.Update, STAFF, false, err.message);
    }
  });

  const handleSubmit = async (values: any) => {
    await update(values);
  };

  const staffName = getOfficialName(staffData?.name as any) || staffId;

  return (
    <Stack>
      <PageHeader mb="10" title={t("editTitle", { object: STAFF })} breadcrumbs={[STAFF, staffName]} />
      <Paper p={{ base: "md", md: "lg", xl: 24 }}>
        {staffData && (
          <StaffForm staffData={staffData} handleSubmit={handleSubmit} isLoading={getStaffDataLoading || isUpdating} />
        )}
      </Paper>
    </Stack>
  );
};

export default UpdateStaff;
