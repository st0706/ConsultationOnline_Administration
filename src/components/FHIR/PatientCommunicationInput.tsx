import { useTranslation } from "@/i18n";
import { CommunicationLanguages } from "@/types/fhir";
import { Checkbox, Flex, MultiSelect, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React, { useEffect, useState } from "react";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const PatientCommunicationInput: <T>(props: Props<T>) => React.ReactNode = ({ form, path, label, description }) => {
  const { t } = useTranslation("fhir");
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    const language = form.getInputProps(`${path}.language`).value;
    if (language && language.length > 0) {
      setValue(language.map((x) => x.coding?.code));
    }
  }, []);

  useEffect(() => {
    if (value.length > 0) {
      form.setFieldValue(`${path}.language`, value.map((code) => CommunicationLanguages[code]) as any);
    }
  }, [value]);

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }}>
        <MultiSelect
          placeholder={t("language")}
          data={[
            { value: "zh", label: "Chinese" },
            { value: "sv", label: "Swedish" },
            { value: "ru", label: "Russian" },
            { value: "pt", label: "Portuguese" },
            { value: "ko", label: "Korean" },
            { value: "ja", label: "Japanese" },
            { value: "it", label: "Italian" },
            { value: "fr", label: "French" },
            { value: "en", label: "English" },
            { value: "vn", label: "VietNam" }
          ]}
          {...form.getInputProps(`${path}.language`)}
          value={value}
          onChange={setValue}
        />
        <Checkbox
          label={t("communication.preferred")}
          {...form.getInputProps(`${path}.preferred`, { type: "checkbox" })}
        />
      </Flex>
    </div>
  );
};

export default PatientCommunicationInput;
