"use client";

import { useTranslation } from "@/i18n";
import { Flex, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}
const UdiDeviceIdentifierInput: <T>(props: Props<T>) => React.ReactNode = ({ form, path, label, description }) => {
  const { t } = useTranslation("fhir");
  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Flex gap={"xs"} direction={"column"}>
        <TextInput
          withAsterisk
          label={t("udiDeviceIdentifier.deviceIdentifier.label")}
          {...form.getInputProps(`${path}.deviceIdentifier`)}
        />
        <TextInput
          withAsterisk
          label={t("udiDeviceIdentifier.issuer.label")}
          {...form.getInputProps(`${path}.issuer`)}
        />
        <TextInput
          label={t("udiDeviceIdentifier.jurisdiction.label")}
          {...form.getInputProps(`${path}.jurisdiction`)}
        />
      </Flex>
    </div>
  );
};
export default UdiDeviceIdentifierInput;
