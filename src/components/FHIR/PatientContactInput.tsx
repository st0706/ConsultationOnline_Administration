import { useTranslation } from "@/i18n";
import { Flex, Select, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import React from "react";
import { DEFAULT_CONTACT_POINT, DEFAULT_HUMAN_NAME, HumanNameInput, TelecomInput } from ".";
import AddressInput from "./AddressInput";
import ResourceArrayInput from "./ResourceArrayInput";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const PatientContactInput: <T>(props: Props<T>) => React.ReactNode = ({ form, path, label, description }) => {
  const { t } = useTranslation("fhir");

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Stack>
        <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
          <Select
            placeholder={t("purpose")}
            data={[
              { value: "BILL", label: t("contact.purpose.BILL") },
              { value: "ADMIN", label: t("contact.purpose.ADMIN") },
              { value: "HR", label: t("contact.purpose.HR") },
              { value: "PAYOR", label: t("contact.purpose.PAYOR") },
              { value: "PATINF", label: t("contact.purpose.PATINF") },
              { value: "PRESS", label: t("contact.purpose.PRESS") }
            ]}
            {...form.getInputProps(`${path}.purpose`)}
          />
          <DateInput
            valueFormat="l"
            placeholder={t("contact.periodStart")}
            {...form.getInputProps(`${path}.period.start`)}
            clearable
          />
          <DateInput
            valueFormat="l"
            placeholder={t("contact.periodEnd")}
            {...form.getInputProps(`${path}.period.end`)}
            clearable
          />
        </Flex>
        <ResourceArrayInput
          form={form}
          property={`${path}.name`}
          propertyDisplayName={t("name")}
          newValue={DEFAULT_HUMAN_NAME}
          renderElement={(path, index) => <HumanNameInput form={form} path={path} disabledType={index === 0} />}
        />
        <ResourceArrayInput
          form={form}
          property={`${path}.telecom`}
          propertyDisplayName={t("resource.telecom")}
          newValue={DEFAULT_CONTACT_POINT}
          renderElement={(path) => <TelecomInput form={form} path={path} />}
        />
        <AddressInput form={form} path={`${path}.address`} label={t("resource.address")} />
      </Stack>
    </div>
  );
};

export default PatientContactInput;
