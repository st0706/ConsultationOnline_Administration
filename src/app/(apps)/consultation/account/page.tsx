"use client";

import { PageHeader } from "@/components/layout";
import { TableRowActions, TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { getOfficialName } from "@/lib/common";
import { api } from "@/trpc/react";
import { Paper, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { HumanName } from "fhir/r5";
import { MantineReactTable, MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { useMemo, useState } from "react";
import AccountForm from "./AccountForm";

const AccountPage = () => {
  const utils = api.useUtils();
  const { notifyResult } = useNotify();
  const [globalFilter, setGlobalFilter] = useState("");
  const { t, i18n } = useTranslation("account");
  const { t: tC } = useTranslation("consultation");
  const { confirmDelete, actionForm } = useModal();
  const ACCOUNT = t("account");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const { data, isLoading, isFetching, isError } = api.account.get.useQuery({
    search: globalFilter || "",
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });

  const { mutateAsync: createAccount } = api.account.create.useMutation({
    onSuccess: async () => {
      await utils.account.invalidate();
      notifyResult(Action.Delete, ACCOUNT, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, ACCOUNT, false, e.message);
    }
  });
  const { mutateAsync: updateAccount } = api.account.update.useMutation({
    onSuccess: async () => {
      await utils.account.invalidate();
      notifyResult(Action.Delete, ACCOUNT, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, ACCOUNT, false, e.message);
    }
  });
  const { mutateAsync: deleteAccount, isLoading: isDeleting } = api.account.delete.useMutation({
    onSuccess: async () => {
      await utils.account.invalidate();
      notifyResult(Action.Delete, ACCOUNT, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, ACCOUNT, false, e.message);
    }
  });

  const handleDelete = async (account: any) => {
    if (account) await deleteAccount({ id: account.id });
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "Practitioner.name",
        header: t("name"),
        Cell: ({ cell }) => getOfficialName(cell.getValue<HumanName[]>())
      },
      {
        accessorKey: "email",
        header: t("email")
      },
      {
        accessorKey: "role",
        header: t("role"),
        Cell: ({ cell }) => tC(`appointment.role.${cell.getValue()}`)
      }
    ],
    [i18n.language]
  );

  const table = useCustomTable<any>(
    {
      columns,
      data: data?.data ?? [],
      rowCount: data?.count || 0,
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
      getRowId: (row) => row.id,
      renderRowActions: ({ row }) => (
        <TableRowActions
          onUpdate={() =>
            actionForm(
              "update-account",
              ACCOUNT,
              AccountForm,
              false,
              async (values) => {
                const res = await updateAccount(values);
                if (res.id) modals.close("update-account");
              },
              row.original
            )
          }
          onDelete={() => confirmDelete(ACCOUNT, () => handleDelete(row.original), "")}
        />
      ),
      renderTopToolbar: () => (
        <TableToolbar table={table} onCreate={() => actionForm("create-account", ACCOUNT, AccountForm)} />
      )
    },
    i18n.language
  );

  return (
    <Stack>
      <PageHeader title={t("title")} breadcrumbs={[ACCOUNT]} />

      <Paper>
        <MantineReactTable table={table} />
      </Paper>
    </Stack>
  );
};

export default AccountPage;
