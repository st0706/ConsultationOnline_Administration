"use client";

import { useTranslation } from "@/i18n";
import { Flex, Select, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  index?: number;
  disabledType?: boolean;
}

const DeviceDefinitionName: <T>(props: Props<T>) => React.ReactNode = ({
  form,
  path,
  label,
  description,
  index,
  disabledType
}) => {
  const { t } = useTranslation("fhir");

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
        <Select
          w={"100%"}
          placeholder={t("deviceName.type.placeholder")}
          data={[
            { label: t("deviceName.type.registeredName"), value: "registered-name" },
            { label: t("deviceName.type.userFriendlyName"), value: "user-friendly-name" },
            { label: t("deviceName.type.patientReportedName"), value: "patient-reported-name" }
          ]}
          defaultValue={index === 0 ? "registered-name" : undefined}
          disabled={disabledType}
          {...form.getInputProps(`${path}.type`)}
        />
        <TextInput w={"100%"} placeholder={t("deviceName.name")} {...form.getInputProps(`${path}.name`)} />
      </Flex>
    </div>
  );
};

export default DeviceDefinitionName;
