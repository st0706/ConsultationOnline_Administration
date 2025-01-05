"use client";

import { HumanNameDisplay, IdentifierDisplay } from "@/components/FHIR";
import { ArrayRemoveButton } from "@/components/FHIR/ArrayRemoveButton";
import classes from "@/components/FHIR/ResourceArrayInput.module.css";
import { FormGroup } from "@/components/form";
import { TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
import { useTranslation } from "@/i18n";
import { localeDate } from "@/lib/datetime";
import { api } from "@/trpc/react";
import { Practitioner } from "@/types";
import { ActionIcon, Anchor, Button, Center, Flex, Grid, Group, Paper, Select, Stack, Tooltip } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconCircleCheck, IconCirclePlus } from "@tabler/icons-react";
import { HumanName, Identifier } from "fhir/r5";
import { MRT_ColumnDef, MRT_PaginationState, MantineReactTable } from "mantine-react-table";
import "mantine-react-table/styles.css";
import Link from "next/link";
import { useMemo, useState } from "react";

type customOrganization = {
  id: string;
  name: string | null;
};

type customPractitioner = Omit<Practitioner, "organizationIds"> & {
  organizationIds: customOrganization[] | null;
};

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  onClose: () => void;
}
const ParticipantForm: <T>(props: Props<T>) => React.ReactNode = ({ form, path, onClose }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const { t, i18n } = useTranslation("hrm");
  const { t: tC } = useTranslation("consultation");
  const [rowSelection, setRowSelection] = useState<any[]>(form.getInputProps(path).value || []);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5
  });

  const { data, isLoading, isFetching, isError } = api.practitioner.get.useQuery({
    search: globalFilter || "",
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });

  const columns = useMemo<MRT_ColumnDef<customPractitioner>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("staff.fullName"),
        Cell: ({ row, cell }) => (
          <Anchor component={Link} href={`staffs/${row.original.id}/profile`} fw={500}>
            {" "}
            <HumanNameDisplay name={cell.getValue<HumanName[]>()} />{" "}
          </Anchor>
        )
      },
      {
        accessorKey: "identifier",
        header: t("resource.identifier"),
        Cell: ({ cell }) =>
          cell.getValue<Identifier[]>()?.map((x, index) => <IdentifierDisplay key={index} value={x} />)
      },
      {
        accessorKey: "birthDate",
        header: t("staff.dOB"),
        Cell: ({ cell }) => localeDate(cell.getValue<bigint>(), i18n.language)
      },
      {
        accessorKey: "organizationIds",
        header: t("staff.organizations"),
        Cell: ({ cell }) =>
          cell.getValue<customOrganization[]>()
            ? cell
                .getValue<customOrganization[]>()
                .map((value, index) => <div key={value.id || index}>{value.name}</div>)
            : ""
      }
    ],
    [i18n.language]
  );

  const participantAdded = rowSelection.map((participant, index) => {
    return (
      <Grid.Col key={index} span={{ base: 12, xl: 6 }}>
        <Group>
          <Stack gap={"xs"} key={`staffId-${participant.staffId}`}>
            <Group>
              {<HumanNameDisplay name={participant.name} />}
              {`- ${t("profile.mainInformation.staffId")} : ${participant.staffId || "\u00A0\u00A0\u00A0\u00A0"}`}
            </Group>
            <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }}>
              <Select
                allowDeselect={false}
                data={[
                  {
                    label: tC("appointment.participant.type.ADMIN"),
                    value: "ADMIN"
                  },
                  {
                    label: tC("appointment.participant.type.participant"),
                    value: "participant"
                  },
                  {
                    label: tC("appointment.participant.type.secretary"),
                    value: "secretary"
                  }
                ]}
                w={"100%"}
                label={tC("appointment.participant.type.name")}
                value={participant.type.at(0).text}
                onChange={(value) => {
                  const updatedItems = rowSelection.map((item) =>
                    item.id === participant.id ? { ...item, type: [{ text: value }] } : item
                  );
                  setRowSelection(updatedItems);
                }}
              />
              <Select
                allowDeselect={false}
                data={[
                  {
                    label: tC("appointment.participant.accepted"),
                    value: "Accepted"
                  },
                  {
                    label: tC("appointment.participant.declined"),
                    value: "Declined"
                  },
                  {
                    label: tC("appointment.participant.pending"),
                    value: "Pending"
                  }
                ]}
                w={"100%"}
                label={tC("appointment.participant.status")}
                value={participant.status}
                onChange={(value) => {
                  const updatedItems = rowSelection.map((item) =>
                    item.id === participant.id ? { ...item, status: value } : item
                  );
                  setRowSelection(updatedItems);
                }}
              />
            </Flex>
          </Stack>
          <ArrayRemoveButton
            className={classes.removeButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setRowSelection((prev) => prev.filter((item) => item.id !== participant.id));
            }}
          />
        </Group>
      </Grid.Col>
    );
  });
  const table = useCustomTable<customPractitioner>(
    {
      columns,
      data: data?.data ?? [],
      rowCount: data?.count ?? 0,
      mantineTableContainerProps: { style: { maxHeight: "500px" } },
      getRowId: (originalRow) => originalRow.id,
      positionActionsColumn: "first",
      state: {
        isLoading,
        globalFilter,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching
      },
      onGlobalFilterChange: setGlobalFilter,
      onPaginationChange: setPagination,
      renderTopToolbar: () => <TableToolbar table={table} />,
      renderRowActions: ({ row }) => {
        const isAdded = rowSelection.find((item) => item.id === row.original.id);
        return !isAdded ? (
          <Tooltip label={t("add", { name: tC("appointment.participant.name") })}>
            <ActionIcon
              variant="subtle"
              color="green"
              onClick={(e: any) => {
                e.stopPropagation();
                setRowSelection((prev) => [
                  ...prev,
                  { ...row.original, status: "Pending", type: [{ text: "participant" }] }
                ]);
              }}>
              <IconCirclePlus size={20} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Tooltip label={t("remove", { name: tC("appointment.participant.name") })}>
            <ArrayRemoveButton
              className={classes.removeButton}
              onClick={(e: any) => {
                e.stopPropagation();
                setRowSelection((prev) => prev.filter((item) => item.id !== row.original.id));
              }}
            />
          </Tooltip>
        );
      }
    },
    i18n.language
  );

  return (
    <Stack>
      <Paper>
        <MantineReactTable table={table} />
      </Paper>
      <FormGroup label={tC("appointment.participant.name")} />
      <Grid>{participantAdded}</Grid>
      <Center pt={"xs"}>
        <Button
          onClick={() => {
            form.setFieldValue("participant", rowSelection as any);
            onClose();
          }}
          color="teal"
          leftSection={<IconCircleCheck size={18} />}>
          {t("update")}
        </Button>
      </Center>
    </Stack>
  );
};
export default ParticipantForm;
