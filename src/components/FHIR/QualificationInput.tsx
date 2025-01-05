"use client";

import { useTranslation } from "@/i18n";
import { Flex, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import React from "react";
import { DEFAULT_IDENTIFIER } from ".";
import IdentifierInput from "./IdentifierInput";
import QualificationCodeInput from "./QualificationCodeInput";
import ResourceArrayInput from "./ResourceArrayInput";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const QualificationInput: <T>(props: Props<T>) => React.ReactNode = ({ form, path, label, description }) => {
  const { t } = useTranslation("fhir");

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Stack>
        <ResourceArrayInput
          form={form}
          property={`${path}.identifier`}
          propertyDisplayName={t("resource.identifier")}
          newValue={DEFAULT_IDENTIFIER}
          renderElement={(path) => <IdentifierInput form={form} path={path} />}
        />
        <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
          <QualificationCodeInput form={form} path={`${path}.code`} />
          <DateInput
            w={{ base: "100%", sm: "30%" }}
            label={t("qualification.periodStart")}
            valueFormat="l"
            {...form.getInputProps(`${path}.period.start`)}
          />
          <DateInput
            w={{ base: "100%", sm: "30%" }}
            label={t("qualification.periodEnd")}
            valueFormat="l"
            {...form.getInputProps(`${path}.period.end`)}
          />
        </Flex>
      </Stack>
    </div>
  );
};

export default QualificationInput;
