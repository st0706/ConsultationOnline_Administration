"use client";

import { useTranslation } from "@/i18n";
import { Checkbox, Flex, Select, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const MaterialInput: <T>(props: Props<T>) => React.ReactNode = ({ form, path, label, description }) => {
  const { t } = useTranslation("fhir");

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
        <TextInput
          w={"100%"}
          withAsterisk
          placeholder={t("material.substance")}
          {...form.getInputProps(`${path}.substance.text`)}
        />
        <Checkbox
          w={"100%"}
          label={t("material.alternate.label")}
          description={t("material.alternate.description")}
          {...form.getInputProps(`${path}.alternate`, { type: "checkbox" })}
        />
        <Checkbox
          w={"100%"}
          label={t("material.allergenicIndicator.label")}
          description={t("material.allergenicIndicator.description")}
          {...form.getInputProps(`${path}.allergenicIndicator`, { type: "checkbox" })}
        />
      </Flex>
    </div>
  );
};

export default MaterialInput;
