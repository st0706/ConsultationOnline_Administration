import { useTranslation } from "@/i18n";
import { Identifier } from "fhir/r5";
import { FC } from "react";

interface Props {
  readonly value?: Identifier;
}

export const IdentifierDisplay: FC<Props> = ({ value }) => {
  const { t } = useTranslation("fhir");

  if (!value) return null;

  const typeCoding = value.type?.coding;
  const typeCode = typeCoding && typeCoding.length > 0 ? typeCoding[0]?.code : undefined;
  const type = typeCode ? `${t("identifier.type." + typeCode)}: ` : "";

  return <div>{`${type}${value.value}`}</div>;
};
