import { FormActions } from "@/components/form";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { slugify } from "@/lib/common";
import { api } from "@/trpc/react";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";

interface IProps {
  data?: any;
  onSubmit?: () => void;
  onClose?: () => void;
}

const FolderForm = (props: IProps) => {
  const { data, onClose } = props;
  const { notifyResult } = useNotify();
  const context = api.useUtils();
  const { t } = useTranslation("consultation");

  const form = useForm({
    initialValues: data?.name
      ? { name: data.name }
      : {
          name: ""
        }
  });

  const { mutateAsync: createFolder, isLoading: isCreatingFolder } = api.appointment.createFolder.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Create, t("folder"), true);
      modals.closeAll();
    },
    onError: (e) => {
      notifyResult(Action.Create, t("folder"), false, e.message);
    }
  });

  const { mutateAsync: renameDocument, isLoading: isRenamingDocument } = api.appointment.rename.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Update, t("document"), true);
      modals.closeAll();
    },
    onError: (e) => {
      notifyResult(Action.Update, t("document"), false, e.message);
    }
  });

  const handleSubmit = async (values) => {
    const path =
      (data?.path
        ? `${data?.path}/${slugify(values.name)}-${Date.now()}`
        : `${slugify(values.name)}-${Date.now()}`
      ).replace("/.emptyFolderPlaceholder", "") + "/.emptyFolderPlaceholder";
    if (isCreatingFolder || isRenamingDocument) return;
    if (data?.name) await renameDocument({ ...values, id: data?.id });
    else await createFolder({ appointmentId: data?.appointmentId, path, name: values.name });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput data-autofocus mb={"xl"} label="Tên thư mục" {...form.getInputProps("name")} />
      <FormActions
        centered
        isNew={!data?.name}
        isSubmitting={isCreatingFolder || isRenamingDocument}
        canSubmit={form.isDirty() && form.isValid()}
        onClose={() => (onClose ? onClose() : modals.closeAll())}
      />
    </form>
  );
};

export default FolderForm;
