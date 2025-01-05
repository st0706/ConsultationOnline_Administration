import { useTranslation } from "@/i18n";
import { Flex, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  showPeriodStart?: boolean;
  showPeriodEnd?: boolean;
}

const TelecomInput: <T>(props: Props<T>) => React.ReactNode = ({
  form,
  path,
  label,
  description,
  showPeriodStart,
  showPeriodEnd
}) => {
  const { t } = useTranslation("fhir");

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
        <Select
          w={"100%"}
          label={t("system")}
          data={[
            { label: t("telecom.system.phone"), value: "phone" },
            { label: t("telecom.system.fax"), value: "fax" },
            { label: t("telecom.system.email"), value: "email" },
            { label: t("telecom.system.url"), value: "url" },
            { label: t("telecom.system.sms"), value: "sms" },
            { label: t("telecom.system.other"), value: "other" }
          ]}
          searchable
          {...form.getInputProps(`${path}.system`)}
        />
        <Select
          w={"100%"}
          label={t("use")}
          data={[
            { label: t("telecom.use.home"), value: "home" },
            { label: t("telecom.use.work"), value: "work" },
            { label: t("telecom.use.temp"), value: "temp" },
            { label: t("telecom.use.old"), value: "old" },
            { label: t("telecom.use.mobile"), value: "mobile" }
          ]}
          searchable
          {...form.getInputProps(`${path}.use`)}
        />
        <TextInput w={"100%"} label={t("value")} {...form.getInputProps(`${path}.value`)} />
        {showPeriodStart && (
          <DateInput
            w={"100%"}
            valueFormat="l"
            clearable
            label={t("telecom.periodStart")}
            {...form.getInputProps(`${path}.period.start`)}
          />
        )}
        {showPeriodEnd && (
          <DateInput
            w={"100%"}
            valueFormat="l"
            clearable
            label={t("telecom.periodEnd")}
            {...form.getInputProps(`${path}.period.end`)}
          />
        )}
      </Flex>
    </div>
  );
};
export default TelecomInput;
