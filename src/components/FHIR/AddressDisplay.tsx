import { useTranslation } from "@/i18n";
import { Address } from "fhir/r5";
import { FC } from "react";

interface Props {
  readonly value?: Address;
}

export const AddressDisplay: FC<Props> = ({ value }) => {
  const { t } = useTranslation("fhir");

  if (!value) return null;

  const use = value.use ? `${t("address.purpose." + value.use)}: ` : "";
  const parts: string[] = (value.line || []).filter((x) => !!x); // Remove empty lines
  if (value.district) parts.push(value.district);
  if (value.city) parts.push(value.city);
  if (value.country) parts.push(value.country);

  return <div>{`${use}${parts.join(", ")}`}</div>;
};
