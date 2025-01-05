import { FormActions } from "@/components/form";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { slugify } from "@/lib/common";

interface IProps {
  data?: any;
  onClose?: () => void;
}

const FileForm = (props: IProps) => {
  const supabase = createClient();
  const { t } = useTranslation("consultation");
  const { data, onClose } = props;
  const context = api.useUtils();
  const { notifyResult } = useNotify();

  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);

  const form = useForm({
    initialValues: !data.file
      ? { nameFile: data.name, documentTime: data.documentTime ? new Date(Number(data.documentTime)) : undefined }
      : {
          nameFile: data.file.name,
          documentTime: undefined
        },
    validate: {
      nameFile: isNotEmpty(t("message.required", { name: t("appointment.nameFile") }))
    }
  });

  const { mutateAsync: uploadFile } = api.appointment.uploadFile.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Upload, t("file"), true);
      modals.closeAll();
    },
    onError: (e) => {
      notifyResult(Action.Upload, t("file"), false, e.message);
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
    const name = values.nameFile;
    const documentTime = values.documentTime;

    if (data.file) {
      setIsUploadingFile(true);
      const { nodeToAction, file, appointmentId } = data;
      const fileNameToCreatePath = `${slugify(name)}-${Date.now()}${file.name.substring(file.name.lastIndexOf("."))}`;
      const path = (nodeToAction ? `${nodeToAction.path}/${fileNameToCreatePath}` : fileNameToCreatePath).replace(
        "/.emptyFolderPlaceholder",
        ""
      );
      // upload to storage
      const { error } = await supabase.storage.from("consultation").upload(path, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (error) throw error;
      const { data: resStorage } = await supabase.storage.from("consultation").getPublicUrl(path);
      await uploadFile({
        appointmentId,
        path,
        name,
        url: resStorage.publicUrl,
        documentTime,
        fileNameOriginal: file.name
      });
      setIsUploadingFile(false);
    } else await renameDocument({ id: data.id, name, documentTime });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput data-autofocus mb={"lg"} label={t("appointment.nameFile")} {...form.getInputProps("nameFile")} />
      <DateTimePicker
        mb={"xl"}
        data-autofocus
        label={t("appointment.documentTime")}
        {...form.getInputProps("documentTime")}
      />
      <FormActions
        centered
        isNew={!data || !data.id}
        isSubmitting={isUploadingFile || isRenamingDocument}
        canSubmit={form.isValid()}
        onClose={() => (onClose ? onClose() : modals.closeAll())}
      />
    </form>
  );
};

export default FileForm;
