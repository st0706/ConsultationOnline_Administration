"use client";

import { LetterAvatar } from "@/components/common";
import { FormActions } from "@/components/form";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { languageList } from "@/i18n/settings";
import { slugify } from "@/lib/common";
import { api } from "@/trpc/react";
import { createClient } from "@/utils/supabase/client";
import { Button, Checkbox, FileButton, Flex, Group, PasswordInput, Select, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { FC, useEffect, useState } from "react";
import { getOfficialName } from "@/lib/common";
import { HumanName } from "fhir/r5";

export type User = {
  id?: string;
  name: any;
  email: string;
  password: string | null;
  image?: string | null;
};

interface Props {
  data?: any;
  onSubmit?: () => void;
  onClose?: () => void;
}

const UserForm: FC<Props> = ({ data, onSubmit, onClose }) => {
  const supabase = createClient();
  const { t } = useTranslation("system");
  const { t: tf } = useTranslation("fhir");
  const { notifyResult } = useNotify();
  const trpcContext = api.useUtils();

  const form = useForm<User>({
    initialValues: data,
    validateInputOnBlur: true,
    validate: {
      name: {
        family: isNotEmpty(t("message.required", { name: tf("humanName.family") })),
        given: (value) => {
          return value.length == 0 || (value.length > 0 && value[0] == "")
            ? t("message.required", { name: tf("humanName.given") })
            : null;
        }
      },
      email: (val) =>
        val && val.length === 0
          ? t("message.required", { name: t("user.email") })
          : /^\S+@\S+$/.test(val)
            ? null
            : t("message.invalid", { name: t("user.email") })
    }
  });

  const { mutateAsync: update, isLoading: isUpdating } = api.account.updateAccountProfile.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      notifyResult(Action.Create, t("header.profile"), true);
      if (onClose) onClose();
    },
    onError: (e) => {
      notifyResult(Action.Create, t("header.profile"), false, e.message);
    }
  });

  const handleSubmit = async (values) => {
    if (isUpdating) return;
    else await update(values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Group justify="center" gap="xl" align="start">
          <Stack align="center">
            <LetterAvatar url={form.values.image} name={getOfficialName(form.values.name as HumanName[])} size={120} />
            <FileButton
              onChange={async (file) => {
                if (file) {
                  const { data, error } = await supabase.storage
                    .from("hrm")
                    .upload(`${slugify(file.name)}-${Date.now()}`, file);
                  if (error) notifyResult(Action.Upload, t("image.label"), false, error.message);
                  else {
                    let res = supabase.storage.from("hrm").getPublicUrl(data?.path!);
                    if (res) form.setFieldValue("image", res.data ? res.data.publicUrl : null);
                    notifyResult(Action.Upload, t("image.label"), true);
                  }
                }
              }}
              accept="image/png,image/jpeg">
              {(props) => <Button {...props}>{t("image.uploadAvatar")}</Button>}
            </FileButton>
          </Stack>
          <Stack>
            <Group wrap="nowrap">
              <TextInput
                style={{ display: data && data.disabledName === true && "none" }}
                w={"100%"}
                label={tf("humanName.family")}
                {...form.getInputProps(`name.0.family`)}
              />
              <TextInput
                style={{ display: data && data.disabledName === true && "none" }}
                w={"100%"}
                label={tf("humanName.given")}
                {...form.getInputProps(`name.0.given.0`)}
              />
            </Group>
            <TextInput withAsterisk label={t("user.email")} {...form.getInputProps("email")} />
            <PasswordInput withAsterisk label={t("user.password")} {...form.getInputProps("password")} />
          </Stack>
        </Group>
        <FormActions
          isNew={!data || !data.id}
          isSubmitting={isUpdating}
          canSubmit={form.isDirty() && form.isValid()}
          onClose={() => (onClose ? onClose() : modals.closeAll())}
        />
      </Stack>
    </form>
  );
};

export default UserForm;
