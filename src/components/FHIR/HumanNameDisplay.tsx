import { useTranslation } from "@/i18n";
import { HumanName } from "fhir/r5";
import { FC } from "react";

interface Props {
  readonly name?: HumanName[];
  fw?: boolean;
}

export const HumanNameDisplay: FC<Props> = ({ name, fw }) => {
  const { t } = useTranslation("fhir");

  return name?.map((x, i) => {
    const use = x.use ? ` (${t("humanName.type." + x.use)})` : "";
    const given = x.given && x.given.length > 0 ? (x.family ? " " : "") + x.given[0] : "";
    return <div style={{ fontWeight: fw ? "bold" : "normal" }} key={i}>{`${x.family}${given}${use}`}</div>;
  });
};
