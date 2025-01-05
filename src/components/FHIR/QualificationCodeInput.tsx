import { useTranslation } from "@/i18n";
import { degreeLicenseCertificate } from "@/types";
import { MultiSelect } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { FC, useEffect, useState } from "react";

interface Props {
  form: UseFormReturnType<any, (values: any) => any>;
  path: string;
}

const QualificationCodeInput: FC<Props> = ({ form, path = "code" }) => {
  const formPath = form.getInputProps(path).value;
  const [value, setValue] = useState<string[]>([]);
  const { t } = useTranslation("fhir");

  useEffect(() => {
    if (formPath.coding?.length > 0) {
      setValue(formPath.coding.map((coding) => coding.code));
    }
  }, []);

  useEffect(() => {
    if (value.length > 0) {
      form.setFieldValue(
        `${path}.coding`,
        value.map((code) => Object.values(degreeLicenseCertificate[code]).at(0))
      );
    } else {
      form.setFieldValue(`${path}.coding`, []);
    }
  }, [value]);

  return (
    <MultiSelect
      w={"100%"}
      data={Object.keys(degreeLicenseCertificate).map((key) => ({
        value: key,
        label: t(`qualification.type.${key}`)
      }))}
      value={value}
      onChange={setValue}
      label={t("type")}
      miw={194}
    />
  );
};

export default QualificationCodeInput;
