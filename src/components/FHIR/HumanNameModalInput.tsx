"use client";
import { useCustomTable } from "@/hooks/useCustomTable";
import { useTranslation } from "@/i18n";
import { Button, Checkbox, Flex, Select, Stack, TextInput } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { HumanName } from "fhir/r5";
import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_HUMAN_NAME } from ".";
import { TableRowActions } from "../table";
interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  showPrefix?: boolean;
  showSuffix?: boolean;
  parentData: any;
}
const HumanNameModalInput: <T>(props: Props<T>) => React.ReactNode = ({
  form,
  path,
  showPrefix = true,
  showSuffix,
  parentData
}) => {
  const [inputValues, setInputValues] = useState(DEFAULT_HUMAN_NAME);

  const [data, setData] = useState<HumanName[]>(form.getInputProps(path).value || []);
  const [index, setIndex] = useState<number | null>(null);
  const { t, i18n } = useTranslation("fhir");
  const [useParentData, setUseParentData] = useState(false);
  const humanForm = useForm({
    initialValues: DEFAULT_HUMAN_NAME,
    validate: {},
    validateInputOnChange: true
  });
  useEffect(() => {
    if (useParentData) setData(parentData.contact.at(0).name);
  }, [useParentData]);
  const columns = useMemo<MRT_ColumnDef<HumanName>[]>(
    () => [
      {
        accessorKey: "use",
        header: t("type"),
        Cell: ({ renderedCellValue }) => {
          return t(`humanName.type.${renderedCellValue}`);
        }
      },
      {
        accessorKey: "prefix.0",
        header: t("humanName.prefix")
      },
      {
        accessorKey: "family",
        header: t("humanName.family")
      },
      {
        accessorKey: "given.0",
        header: t("humanName.given")
      }
    ],
    [i18n.language]
  );
  useEffect(() => {
    form.setFieldValue(path, data as any);
  }, [data]);
  const table = useCustomTable<HumanName>(
    {
      columns,
      data: data,
      rowCount: data.length,
      renderRowActions: ({ row }) => (
        <TableRowActions
          onUpdate={() => {
            setIndex(Number(row.id));
            humanForm.setValues(data[Number(row.id)]!);
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
            placeholder={t("type")}
            data={[
              { label: t("humanName.type.usual"), value: "usual" },
              { label: t("humanName.type.official"), value: "official" },
              { label: t("humanName.type.temp"), value: "temp" },
              { label: t("humanName.type.nickname"), value: "nickname" },
              { label: t("humanName.type.anonymous"), value: "anonymous" },
              { label: t("humanName.type.old"), value: "old" },
              { label: t("humanName.type.maiden"), value: "maiden" }
            ]}
            searchable
            {...humanForm.getInputProps("use")}
          />
          {showPrefix && (
            <TextInput w={"100%"} {...humanForm.getInputProps("prefix.0")} placeholder={t("humanName.prefix")} />
          )}
          <TextInput w={"100%"} placeholder={t("humanName.family")} {...humanForm.getInputProps("family")} />
          <TextInput w={"100%"} placeholder={t("humanName.given")} {...humanForm.getInputProps("given.0")} />
          {showSuffix && (
            <TextInput w={"100%"} placeholder={t("humanName.suffix")} {...humanForm.getInputProps("suffix")} />
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
          disabled={!humanForm.isDirty() || !humanForm.isValid()}
          onClick={() => {
            if (typeof index !== "number") {
              setData((prev) => [...prev, humanForm.values]);
              humanForm.reset();
            } else {
              let updatedData = [...data];
              updatedData[index] = inputValues;
              setData(updatedData);
              humanForm.reset();
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

export default HumanNameModalInput;
