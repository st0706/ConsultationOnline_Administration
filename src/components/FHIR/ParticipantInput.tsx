"use client";

import { useTranslation } from "@/i18n";
import { Flex, Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const ParticipantInput: <T>(props: Props<T>) => React.ReactNode = ({ form, path, label, description }) => {
  const { t } = useTranslation("consultation");

  return (
    <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }}>
      <Select
        data={[
          {
            label: t("appointment.participant.type.ADMIN"),
            value: "ADMIN"
          },
          {
            label: t("appointment.participant.type.participant"),
            value: "participant"
          }
        ]}
        w={"100%"}
        label={t("appointment.participant.type.name")}
        {...form.getInputProps(`${path}.type.0.text`)}
      />
      <Select
        data={[
          {
            label: t("appointment.participant.accepted"),
            value: "Accepted"
          },
          {
            label: t("appointment.participant.declined"),
            value: "Declined"
          },
          {
            label: t("appointment.participant."),
            value: "Pending"
          }
        ]}
        w={"100%"}
        defaultValue={""}
        label={t("appointment.participant.status")}
        {...form.getInputProps(`${path}.status`)}
      />
    </Flex>
  );
};

export default ParticipantInput;
