"use client";
import { useCustomTable } from "@/hooks/useCustomTable";
import { useTranslation } from "@/i18n";
import { ActionIcon, Button, Checkbox, ComboboxData, Flex, Select, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Identifier } from "fhir/r5";
import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_IDENTIFIER } from ".";
import { TableRowActions } from "../table";
import { IconCirclePlus } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { api } from "@/trpc/react";
import useNotify, { Action } from "@/hooks/useNotify";
import useModal from "@/hooks/useModal";
import SimpleOrganizationForm from "@/app/(apps)/consultation/organization/SimpleOrganizationForm";
import { DateInput } from "@mantine/dates";
interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  typeData?: ComboboxData;
  showPeriodStart?: boolean;
  showPeriodEnd?: boolean;
  parentData: any;
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
const IdentifierModalInput: <T>(props: Props<T>) => React.ReactNode = ({
  form,
  path,
  typeData,
  showPeriodStart = false,
  showPeriodEnd = false,
  parentData
}) => {
  const [inputValues, setInputValues] = useState(DEFAULT_IDENTIFIER);

  const [data, setData] = useState<Identifier[]>(form.getInputProps(path).value || []);
  const [index, setIndex] = useState<number | null>(null);
  const { t, i18n } = useTranslation("fhir");
  const [useParentData, setUseParentData] = useState(false);
  useEffect(() => {
    if (useParentData) setData(parentData.identifier.at(0));
  }, [useParentData]);
  const ORGANIZATION = t("resource.organization");
  const { actionForm } = useModal();
  const { notifyResult } = useNotify();
  const context = api.useUtils();

  // useEffect(() => {
  //   if (form.getInputProps(`identifier`).value && form.getInputProps(`identifier.code`).value) {
  //     form.setFieldValue("", identifierCodingTypes[form.getInputProps(`identifier.code`).value]);
  //   }
  // }, [form.getInputProps(`identifier.code`).value]);

  const { mutateAsync: createOrganization, isLoading: isLoadingCreate } = api.organization.create.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Create, ORGANIZATION, true);
    },
    onError: (e) => {
      notifyResult(Action.Create, ORGANIZATION, false, e.message);
    }
  });
  const { data: organizationList, isLoading: isLoadingOrganization } = api.organization.getAll.useQuery();

  const columns = useMemo<MRT_ColumnDef<Identifier>[]>(
    () => [
      {
        accessorKey: "type",
        header: t("type"),
        Cell: ({ renderedCellValue }) => {
          return t(`identifier.type.${renderedCellValue}`);
        }
      },
      {
        accessorKey: "value",
        header: t("value")
      },
      {
        accessorKey: "assigner",
        header: t("identifier.assigner"),
        Cell: ({ renderedCellValue }) => {
          return t(`${renderedCellValue}`);
        }
      }
    ],
    [i18n.language]
  );
  useEffect(() => {
    form.setFieldValue(path, data as any);
  }, [data]);
  const table = useCustomTable<Identifier>(
    {
      columns,
      data: data,
      rowCount: data.length,
      renderRowActions: ({ row }) => (
        <TableRowActions
          onUpdate={() => {
            setIndex(Number(row.id));
            setInputValues(data[Number(row.id)]!);
          }}
          onDelete={() => {
            setData((prev) => prev.filter((v, index) => index !== Number(row.id)));
          }}
        />
      )
    },
    i18n.language
  );
  return (
    <div>
      <Stack>
        <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
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
            searchable
            value={inputValues.type?.coding?.at(0)?.code}
            onChange={(value, option) => {
              setInputValues((prev: any) => {
                return { ...prev, type: value ? value : undefined };
              });
            }}
            placeholder={t("type")}
          />
          <TextInput
            w={"100%"}
            placeholder={t("value")}
            onChange={(e) => {
              setInputValues((prev) => {
                return { ...prev, value: e.currentTarget?.value };
              });
            }}
            value={inputValues.value}
          />
          <Select
            w={"100%"}
            placeholder={t("identifier.assigner")}
            data={organizationList?.map((organization) => {
              return { label: organization.name!, value: organization.id! };
            })}
            searchable
            value={inputValues!.assigner?.id}
            onChange={(value, option) => {
              setInputValues((prev: any) => {
                return { ...prev, assigner: value ? value : undefined };
              });
            }}
            rightSectionPointerEvents="visible"
            rightSection={
              <ActionIcon
                onClick={() =>
                  actionForm(
                    "create-simple-organization",
                    ORGANIZATION,
                    SimpleOrganizationForm,
                    isLoadingCreate,
                    async (values) => {
                      const res = await createOrganization(values);
                      if (res.id) modals.close("create-simple-organization");
                    }
                  )
                }
                title={t("resourceArray.add", { name: t("identifier.assigner") })}
                color="green.6">
                <IconCirclePlus size="1.25rem" />
              </ActionIcon>
            }
          />
          {showPeriodStart && (
            <DateInput
              w={"100%"}
              valueFormat="DD/MM/YYYY"
              clearable
              placeholder={t("identifier.periodStart")}
              {...form.getInputProps(`${path}.period.start`)}
            />
          )}
          {showPeriodEnd && (
            <DateInput w={"100%"} valueFormat="DD/MM/YYYY" clearable placeholder={t("identifier.periodEnd")} />
          )}
        </Flex>
        {parentData && (
          <Checkbox
            checked={useParentData}
            onChange={(e) => setUseParentData(e.currentTarget.checked)}
            label={t("parentLocationContactName")}
          />
        )}
        <Button
          style={{ alignSelf: "end" }}
          w={{ base: "30%", md: "20%" }}
          onClick={() => {
            if (typeof index !== "number") {
              setData((prev) => {
                return [...prev, inputValues];
              });
              setInputValues(DEFAULT_IDENTIFIER);
            } else {
              let updatedData = [...data];
              updatedData[index] = inputValues;
              setData(updatedData);
              setInputValues(DEFAULT_IDENTIFIER);
              setIndex(null);
            }
          }}>
          OK
        </Button>
        <MantineReactTable table={table} />
      </Stack>
    </div>
  );
};

export default IdentifierModalInput;
