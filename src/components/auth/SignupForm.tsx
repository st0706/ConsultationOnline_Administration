"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { AppointmentRole } from "@/types/enums";
import { signUp } from "@/utils/auth-helpers/server";
import { Button, Flex, PasswordInput, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const { t: tf } = useTranslation("fhir");
  const { notifyResult } = useNotify();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
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
      confirmPassword: "",
      role: AppointmentRole.Participant
    },
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
        val.length === 0
          ? t("message.required", { name: t("email") })
          : /^\S+@\S+$/.test(val)
            ? null
            : t("message.invalid", { name: t("email") }),
      password: (val) => (val.length === 0 ? t("message.required", { name: t("password") }) : null),
      confirmPassword: (value, values) => (value !== values.password ? t("signup.confirmPasswordFail") : null)
    }
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    delete values.confirmPassword;

    try {
      const redirectPath = await signUp(values);
      if (redirectPath) {
        notifyResult(Action.Create, t("account"), true);
        router.push(redirectPath);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Flex direction={{ base: "column", sm: "row" }} gap={{ base: "md" }}>
        <TextInput
          name="firstName"
          label={tf("humanName.family")}
          placeholder={tf("humanName.family")}
          required
          {...form.getInputProps(`name.0.family`)}
        />
        <TextInput
          name="lastName"
          label={tf("humanName.given")}
          placeholder={tf("humanName.given")}
          required
          {...form.getInputProps(`name.0.given.0`)}
        />
      </Flex>
      <TextInput
        name="email"
        label={t("email")}
        placeholder={t("email.hint")}
        required
        mt="md"
        {...form.getInputProps("email")}
      />
      <PasswordInput
        name="password"
        label={t("password")}
        placeholder={t("password.hint")}
        required
        mt="md"
        {...form.getInputProps("password")}
      />
      <PasswordInput
        name="confirmPassword"
        label={t("signup.confirmPassword")}
        placeholder={t("signup.confirmPasswordHint")}
        required
        mt="md"
        {...form.getInputProps("confirmPassword")}
      />
      <Button fullWidth mt="xl" loading={isLoading} type="submit">
        {t("signup.create")}
      </Button>
    </form>
  );
}
