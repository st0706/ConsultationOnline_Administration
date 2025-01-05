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
  disabledType?: boolean;
  showPrefix?: boolean;
  showSuffix?: boolean;
  index?: number;
}

const HumanNameInput: <T>(props: Props<T>) => React.ReactNode = ({
  index,
  form,
  path,
  label,
  description,
  showPrefix,
  showSuffix,
  disabledType
}) => {
  const { t } = useTranslation("fhir");

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
        <Select
          w={"100%"}
          placeholder={t("type")}
          disabled={disabledType}
          data={[
            { label: t("humanName.type.usual"), value: "usual" },
            { label: t("humanName.type.official"), value: "official", disabled: true },
            { label: t("humanName.type.temp"), value: "temp" },
            { label: t("humanName.type.nickname"), value: "nickname" },
            { label: t("humanName.type.anonymous"), value: "anonymous" },
            { label: t("humanName.type.old"), value: "old" },
            { label: t("humanName.type.maiden"), value: "maiden" }
          ]}
          searchable
          defaultValue={index === 0 ? "official" : undefined}
          {...form.getInputProps(`${path}.use`)}
        />
        {showPrefix && (
          <TextInput w={"100%"} placeholder={t("humanName.prefix")} {...form.getInputProps(`${path}.prefix.0`)} />
        )}
        <TextInput w={"100%"} placeholder={t("humanName.family")} {...form.getInputProps(`${path}.family`)} />
        <TextInput w={"100%"} placeholder={t("humanName.given")} {...form.getInputProps(`${path}.given.0`)} />
        {showSuffix && (
          <TextInput w={"100%"} placeholder={t("humanName.suffix")} {...form.getInputProps(`${path}.suffix.0`)} />
        )}
      </Flex>
    </div>
  );
};

export default HumanNameInput;
