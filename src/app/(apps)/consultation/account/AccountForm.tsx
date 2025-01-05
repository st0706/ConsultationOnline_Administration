"use client";

import { FormActions } from "@/components/form";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { AppointmentRole } from "@/types/enums";
import { Group, PasswordInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";

interface Props {
  data?: any;
  onSubmit?: (values) => void;
  onClose?: () => void;
}

const AccountForm = ({ data, onSubmit, onClose }: Props) => {
  const { t } = useTranslation("account");
  const { t: tC } = useTranslation("consultation");
  const { t: tf } = useTranslation("fhir");
  const ACCOUNT = t("account");
  const utils = api.useUtils();
  const { notifyResult } = useNotify();

  const { mutateAsync: createAccount, isLoading: isCreating } = api.account.create.useMutation({
    onSuccess: async () => {
      await utils.account.invalidate();
      notifyResult(Action.Create, ACCOUNT, true);
      modals.closeAll();
    },
    onError: (e) => {
      notifyResult(Action.Create, ACCOUNT, false, e.message);
    }
  });
  const { mutateAsync: updateAccount, isLoading: isUpdating } = api.account.update.useMutation({
    onSuccess: async () => {
      await utils.account.invalidate();
      notifyResult(Action.Update, ACCOUNT, true);
      modals.closeAll();
    },
    onError: (e) => {
      notifyResult(Action.Update, ACCOUNT, false, e.message);
    }
  });

  const handleCreate = async (values) => {
    if (isCreating || isUpdating) return;
    if (data && data.id) await updateAccount({ ...values, id: data?.id });
    else await createAccount(values);
  };

  const form = useForm({
    initialValues:
      data && data?.email
        ? {
            ...data,
            name: data.Practitioner
              ? data.Practitioner.name
              : [
                  {
                    use: "official",
                    prefix: [],
                    family: "",
                    given: [],
                    suffix: [],
                    period: {
                      start: undefined,
                      end: undefined
                    }
                  }
                ]
          }
        : {
            name: [
              {
                use: "official",
                prefix: [],
                family: "",
                given: [],
                suffix: [],
                period: {
                  start: undefined,
                  end: undefined
                }
              }
            ],
            email: "",
            password: "",
            role: AppointmentRole.Participant
          },
    validateInputOnChange: true,
    validate: {
      email: (val) =>
        val.length === 0
          ? t("message.required", { name: t("email") })
          : /^\S+@\S+$/.test(val)
            ? null
            : t("message.invalid", { name: t("email") }),
      password: (val) => {
        if (!data) return val.length === 0 ? t("message.required", { name: t("password") }) : null;
      },
      role: (val) => {
        if (!data) return val?.length === 0 ? t("message.required", { name: t("role") }) : null;
      }
    }
  });

  return (
    <form onSubmit={form.onSubmit(handleCreate)}>
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
        <TextInput hidden={true} withAsterisk={true} w={"100%"} label={t("email")} {...form.getInputProps("email")} />
        <PasswordInput
          withAsterisk={data ? false : true}
          w={"100%"}
          label={t("password")}
          {...form.getInputProps("password")}
        />
        <Select
          w={"100%"}
          withAsterisk={true}
          data={Object.values(AppointmentRole).map((role) => {
            return { label: tC(`appointment.role.${role}`), value: role };
          })}
          label={t("role")}
          {...form.getInputProps("role")}
        />
        <FormActions
          isNew={!data?.email}
          isSubmitting={isCreating || isUpdating}
          canSubmit={form.isDirty() && form.isValid()}
          onClose={() => (onClose ? onClose() : modals.closeAll())}
        />
      </Stack>
    </form>
  );
};

export default AccountForm;
