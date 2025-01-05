import { useTranslation } from "@/i18n";
import { Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Organization } from "fhir/r5";
import { FC } from "react";

interface Props {
  form: UseFormReturnType<Organization, (values: Organization) => Organization>;
}
const EndpointInput: FC<Props> = ({ form }) => {
  const { t } = useTranslation("hrm");
  if (!form.values.endpoint) {
    form.setFieldValue("endpoint", [
      {
        reference: "",
        type: "",
        display: ""
      }
    ]);
  }

  return <Select label={t("endPoint.name")} data={[]} />;
};

export default EndpointInput;
