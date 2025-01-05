"use client";
import { useCustomTable } from "@/hooks/useCustomTable";
import { useTranslation } from "@/i18n";
import { Button, Flex, Select, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm, UseFormReturnType } from "@mantine/form";
import { ContactPoint } from "fhir/r5";
import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_CONTACT_POINT } from ".";
import { TableRowActions } from "../table";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  showPeriodStart?: boolean;
  showPeriodEnd?: boolean;
}
const TelecomModalInput: <T>(props: Props<T>) => React.ReactNode = ({ form, path, showPeriodStart, showPeriodEnd }) => {
  const [inputValues, setInputValues] = useState(DEFAULT_CONTACT_POINT);
  const [data, setData] = useState<ContactPoint[]>(form.getInputProps(path).value || []);
  const [index, setIndex] = useState<number | null>(null);
  const { t, i18n } = useTranslation("fhir");
  const teleForm = useForm({
    initialValues: DEFAULT_CONTACT_POINT,
    validate: {
      system: isNotEmpty(t("message.required", { name: t("system") })),
      use: isNotEmpty(t("message.required", { name: t("use") })),
      value: isNotEmpty(t("message.required", { name: t("value") }))
    },
    validateInputOnChange: true
  });
  const columns = useMemo<MRT_ColumnDef<ContactPoint>[]>(
    () => [
      {
        accessorKey: "system",
        header: t("system"),
        Cell: ({ renderedCellValue }) => {
          return t(`telecom.system.${renderedCellValue}`);
        }
      },
      {
        accessorKey: "use",
        header: t("use"),
        Cell: ({ renderedCellValue }) => {
          return t(`telecom.use.${renderedCellValue}`);
        }
      },
      {
        accessorKey: "value",
        header: t("value")
      }
    ],
    [i18n.language]
  );
  useEffect(() => {
    form.setFieldValue(path, data as any);
  }, [data]);
  const table = useCustomTable<ContactPoint>(
    {
      columns,
      data: data,
      rowCount: data.length,
      renderRowActions: ({ row }) => (
        <TableRowActions
          onUpdate={() => {
            setIndex(Number(row.id));
            teleForm.setValues(data[Number(row.id)]!);
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
            withAsterisk
            w={"100%"}
            placeholder={t("system")}
            data={[
              { label: t("telecom.system.phone"), value: "phone" },
              { label: t("telecom.system.fax"), value: "fax" },
              { label: t("telecom.system.email"), value: "email" },
              { label: t("telecom.system.url"), value: "url" },
              { label: t("telecom.system.sms"), value: "sms" },
              { label: t("telecom.system.other"), value: "other" }
            ]}
            searchable
            {...teleForm.getInputProps("system")}
          />
          <Select
            withAsterisk
            w={"100%"}
            placeholder={t("use")}
            data={[
              { label: t("telecom.use.home"), value: "home" },
              { label: t("telecom.use.work"), value: "work" },
              { label: t("telecom.use.temp"), value: "temp" },
              { label: t("telecom.use.old"), value: "old" },
              { label: t("telecom.use.mobile"), value: "mobile" }
            ]}
            searchable
            {...teleForm.getInputProps("use")}
          />
          <TextInput withAsterisk w={"100%"} placeholder={t("value")} {...teleForm.getInputProps("value")} />
          {showPeriodStart && (
            <DateInput
              w={"100%"}
              valueFormat="l"
              clearable
              placeholder={t("telecom.periodStart")}
              {...teleForm.getInputProps("period.start")}
            />
          )}
          {showPeriodEnd && (
            <DateInput
              w={"100%"}
              valueFormat="l"
              clearable
              placeholder={t("telecom.periodEnd")}
              {...teleForm.getInputProps("period.end")}
            />
          )}
        </Flex>
        <Button
          style={{ alignSelf: "end" }}
          w={{ base: "30%", md: "20%" }}
          disabled={!teleForm.isDirty() || !teleForm.isValid()}
          onClick={() => {
            if (typeof index !== "number") {
              setData((prev) => [...prev, teleForm.values]);
              teleForm.reset();
            } else {
              let updatedData = [...data];
              updatedData[index] = inputValues;
              setData(updatedData);
              teleForm.reset();
              setIndex(null);
            }
          }}>
          {t("submit")}
        </Button>
        <MantineReactTable table={table} />
      </Stack>
    </div>
  );
};

export default TelecomModalInput;
