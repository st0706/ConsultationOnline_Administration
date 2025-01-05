import { useTranslation } from "@/i18n";
import { Grid, Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { FC, useEffect, useState } from "react";

interface Props {
  form: UseFormReturnType<any, (values: any) => any>;
  typeValue: any;
  path: string;
}

const TypeInput: FC<Props> = ({ path, form, typeValue }) => {
  const { t } = useTranslation("fhir");
  const [value, setValue] = useState<string | null>("");
  const dataSelect = (Object.values(typeValue) as any[]).map(({ code }) => ({
    value: code,
    label: t(`classification.type.${code}`)
  }));
  useEffect(() => {
    if (form.values.type?.length > 0) {
      setValue(form.values.type!.map((type) => type.coding?.code));
    }
  }, []);

  useEffect(() => {
    if (value) {
      form.setFieldValue(`${path}.type`, [typeValue[value]]);
    }
  }, [value]);
  return (
    <Grid>
      <Grid.Col span={12}>
        <Select w={"100%"} data={dataSelect} value={value} onChange={setValue} label={t("type")} />
      </Grid.Col>
    </Grid>
  );
};

export default TypeInput;
