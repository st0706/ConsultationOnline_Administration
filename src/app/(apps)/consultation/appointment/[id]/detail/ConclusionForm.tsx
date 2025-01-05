"use client";

import { FormActions } from "@/components/form";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useParams } from "next/navigation";

interface Props {
  data?: any;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  onClose?: () => void;
}
const ConclusionForm = ({ data, onSubmit, isSubmitting, onClose }: Props) => {
  const { t } = useTranslation("consultation");
  const { id } = useParams();
  const CONCLUSION = t("appointment.conclusion.name");
  const { notifyResult } = useNotify();
  const trpcContext = api.useUtils();
  const { mutateAsync: create, isLoading: isCreating } = api.conclusion.create.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Create, CONCLUSION, true);
      modals.closeAll();
    },
    onError: (e) => {
      notifyResult(Action.Create, CONCLUSION, false, e.message);
    }
  });

  const { mutateAsync: update, isLoading: isUpdating } = api.conclusion.update.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Update, CONCLUSION, true);
    },
    onError: (e) => {
      notifyResult(Action.Update, CONCLUSION, false, e.message);
    }
  });
  const handleSubmit = async (values) => {
    if (isCreating || isUpdating) return;

    if (data && data.id) await update({ ...values, id: data?.id });
    else await create(values);
  };
  const form = useForm({
    initialValues: data
      ? data
      : {
          content: "",
          appointmentId: id
        }
  });
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Textarea
        data-autofocus
        mb={"xl"}
        label={t("appointment.conclusion.content")}
        {...form.getInputProps("content")}
      />
      <FormActions
        centered
        isNew={!data || !data.id}
        isSubmitting={isCreating || isUpdating}
        canSubmit={form.isDirty() && form.isValid()}
        onClose={() => (onClose ? onClose() : modals.closeAll())}
      />
    </form>
  );
};

export default ConclusionForm;
