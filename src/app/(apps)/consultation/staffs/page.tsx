"use client";

import { HumanNameDisplay, IdentifierDisplay } from "@/components/FHIR";
import { PageHeader } from "@/components/layout";
import { TableRowActions, TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { localeDate } from "@/lib/datetime";
import { api } from "@/trpc/react";
import { Practitioner } from "@/types";
import { Anchor, Paper, Stack } from "@mantine/core";
import { HumanName, Identifier } from "fhir/r5";
import { MRT_ColumnDef, MRT_PaginationState, MantineReactTable } from "mantine-react-table";
import "mantine-react-table/styles.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type customOrganization = {
  id: string;
  name: string | null;
};

type customPractitioner = Omit<Practitioner, "organizationIds"> & {
  organizationIds: customOrganization[] | null;
};

export default function StaffPage() {
  const utils = api.useUtils();
  const { notifyResult } = useNotify();
  const { confirmDelete } = useModal();
  const [globalFilter, setGlobalFilter] = useState("");
  const { t, i18n } = useTranslation("hrm");
  const STAFF = t("staff.name");
  const router = useRouter();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const { data, isLoading, isFetching, isError } = api.practitioner.get.useQuery({
    search: globalFilter || "",
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });

  const { mutateAsync: deleteStaff, isLoading: isDeleting } = api.practitioner.delete.useMutation({
    onSuccess: async () => {
      await utils.practitioner.invalidate();
      notifyResult(Action.Delete, STAFF, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, STAFF, false, e.message);
    }
  });

  const handleDelete = async (staff: customPractitioner) => {
    if (!staff) return;
    await deleteStaff({ id: staff.id });
  };

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

  const table = useCustomTable<customPractitioner>(
    {
      columns,
      data: data?.data ?? [],
      rowCount: data?.count ?? 0,
      state: {
        isLoading,
        isSaving: isDeleting,
        globalFilter,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching
      },
      onGlobalFilterChange: setGlobalFilter,
      onPaginationChange: setPagination,
      getRowId: (row) => row && row.id,
      renderRowActions: ({ row }) => (
        <TableRowActions
          onUpdate={() => router.push(`staffs/${row.id}`)}
          onDelete={() => confirmDelete(STAFF, () => handleDelete(row.original), "")}
        />
      ),
      renderTopToolbar: () => <TableToolbar table={table} onCreate={() => router.push(`staffs/create`)} />
    },
    i18n.language
  );

  return (
    <Stack>
      <PageHeader title={t("staff.title")} breadcrumbs={[STAFF]} />

      <Paper>
        <MantineReactTable table={table} />
      </Paper>
    </Stack>
  );
}
