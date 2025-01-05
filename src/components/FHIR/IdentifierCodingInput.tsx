import { useTranslation } from "@/i18n";
import { ComboboxData, Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { FC, useEffect } from "react";

interface Props {
  form: UseFormReturnType<any, (values: any) => any>;
  typeData?: ComboboxData;
  path?: string;
}

const identifierCodingTypes = {
  CI: {
    code: "CI",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Citizen Identification"
  },
  BA: {
    code: "BA",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Bank Account"
  },
  SI: {
    code: "SI",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Social Insurance"
  },
  DL: {
    code: "DL",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Driver's license number"
  },
  PPN: {
    code: "PPN",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Passport number"
  },
  BRN: {
    code: "BRN",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Breed Registry Number"
  },
  MR: {
    code: "MR",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Medical record number"
  },
  MCN: {
    code: "MCN",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Microchip Number"
  },
  EN: {
    code: "EN",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Employer number"
  },
  TAX: {
    code: "TAX",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Tax ID number"
  },
  NIIP: {
    code: "NIIP",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "National Insurance Payor Identifier (Payor)"
  },
  PRN: {
    code: "PRN",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Provider number"
  },
  MD: {
    code: "MD",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Medical License number"
  },
  DR: {
    code: "DR",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Donor Registration Number"
  },
  ACSN: {
    code: "ACSN",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Accession ID"
  },
  UDI: {
    code: "UDI",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Universal Device Identifier"
  },
  SNO: {
    code: "SNO",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Serial Number"
  },
  SB: {
    code: "SB",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Social Beneficiary Identifier"
  },
  PLAC: {
    code: "PLAC",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Placer Identifier"
  },
  FILL: {
    code: "FILL",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Filler Identifier"
  },
  JHN: {
    code: "JHN",
    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
    display: "Jurisdictional health number"
  }
};
const IdentifierCodingInput: FC<Props> = ({ form, path, typeData }) => {
  const { t } = useTranslation("fhir");

  useEffect(() => {
    if (path && form.getInputProps(path).value && form.getInputProps(`${path}.code`).value) {
      form.setFieldValue(path, identifierCodingTypes[form.getInputProps(`${path}.code`).value]);
    }
  }, [form.getInputProps(`${path}.code`).value]);

  return (
    <Select
      w={"100%"}
      data={
        typeData || [
          { value: "DL", label: t("identifier.type.DL") },
          { value: "PPN", label: t("identifier.type.PPN") },
          { value: "BRN", label: t("identifier.type.BRN") },
          { value: "MR", label: t("identifier.type.MR") },
          { value: "MCN", label: t("identifier.type.MCN") },
          { value: "EN", label: t("identifier.type.EN") },
          { value: "TAX", label: t("identifier.type.TAX") },
          { value: "NIIP", label: t("identifier.type.NIIP") },
          { value: "PRN", label: t("identifier.type.PRN") },
          { value: "MD", label: t("identifier.type.MD") },
          { value: "DR", label: t("identifier.type.DR") },
          { value: "ACSN", label: t("identifier.type.ACSN") },
          { value: "UDI", label: t("identifier.type.UDI") },
          { value: "SNO", label: t("identifier.type.SNO") },
          { value: "SB", label: t("identifier.type.SB") },
          { value: "PLAC", label: t("identifier.type.PLAC") },
          { value: "FILL", label: t("identifier.type.FILL") },
          { value: "JHN", label: t("identifier.type.JHN") }
        ]
      }
      {...form.getInputProps(`${path}.code`)}
      placeholder={t("type")}
    />
  );
};

export default IdentifierCodingInput;
