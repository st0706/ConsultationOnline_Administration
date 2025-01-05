"use client";

import { ImportExcelPopup } from "@/components/common";
import { PageHeader } from "@/components/layout";
import { TableToolbar } from "@/components/table";
import TableRowActions from "@/components/table/TableRowActions";
import { useCustomTable } from "@/hooks/useCustomTable";
import useImportExcel from "@/hooks/useImportExcel";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { Button, Group, LoadingOverlay, Paper, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { MRT_ColumnDef, MRT_PaginationState, MantineReactTable } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useMemo, useRef, useState } from "react";
import AdDivisionForm from "./adDivisonForm";
import { Wards } from "@/types";

const headers = ["wardCode", "wardName", "districtId", "districtName", "cityId", "cityName"];

const AdminDivisionPage = () => {
  const { t, i18n } = useTranslation("system");
  const ADMIN_DIVISION = t("adDivision.name");
  const context = api.useUtils();
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [showImportPopup, setShowImportPopup] = useState(false);
  const { dataUpload, handleFileChange, setDataUpload } = useImportExcel({ headers });
  const { data, isLoading, isFetching, isError } = api.adDivision.getAdDivisions.useQuery({
    search: globalFilter || "",
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  });
  const { confirmDelete } = useModal();
  const { notifyResult } = useNotify();
  const [importMethod, setImportMethod] = useState<string | null>("UPDATE");
  const resetRef = useRef<() => void>(null);
  const trpcContext = api.useUtils();

  const { mutateAsync: create, isLoading: isCreating } = api.adDivision.create.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      close();
      notifyResult(Action.Create, ADMIN_DIVISION, true);
    },
    onError: (e) => {
      notifyResult(Action.Create, ADMIN_DIVISION, false, e.message);
    }
  });

  const handleCreate = () => {
    const modalId = "create-device";
    modals.open({
      modalId: modalId,
      title: t("addNewTitle", { object: ADMIN_DIVISION }),
      centered: true,
      size: "lg",
      closeOnClickOutside: false,
      children: (
        <AdDivisionForm
          isSubmitting={isCreating}
          onClose={() => modals.close(modalId)}
          onSubmit={async (values) => {
            const res = await create(values);
            if (!res?.error) modals.close(modalId);
          }}
        />
      )
    });
  };
  const { mutateAsync: update, isLoading: isUpdating } = api.adDivision.update.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      close();
      notifyResult(Action.Update, ADMIN_DIVISION, true);
    },
    onError: (e) => {
      notifyResult(Action.Update, ADMIN_DIVISION, false, e.message);
    }
  });

  const handleUpdate = (row: any) => {
    const modalId = "update-device";
    modals.open({
      modalId,
      title: t("editTitle", { object: ADMIN_DIVISION }),
      centered: true,
      size: "lg",
      closeOnClickOutside: false,
      children: (
        <AdDivisionForm
          data={row}
          isSubmitting={isCreating}
          onClose={() => modals.close(modalId)}
          onSubmit={async (values) => {
            const res = await update({ ...values });
            if (!res?.error) modals.close(modalId);
          }}
        />
      )
    });
  };

  const { mutateAsync: deleteOne, isLoading: isDeleting } = api.adDivision.delete.useMutation({
    onSuccess: async () => {
      await trpcContext.invalidate();
      close();
      notifyResult(Action.Delete, ADMIN_DIVISION, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, ADMIN_DIVISION, false, e.message);
    }
  });

  const handleDelete = (idCity) => {
    confirmDelete(ADMIN_DIVISION, async () => {
      await deleteOne({ idCity });
    });
  };

  const { mutateAsync: deleteAll, isLoading: isDeletingAll } = api.adDivision.deleteAll.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.DeleteAll, ADMIN_DIVISION, true);
    },
    onError: (e) => {
      notifyResult(Action.DeleteAll, ADMIN_DIVISION, false, e.message);
    }
  });

  const handleDeleteAll = () =>
    confirmDelete(
      ADMIN_DIVISION,
      async () => {
        await deleteAll();
        await context.adDivision.invalidate();
      },
      undefined,
      DeleteAction.DeleteAll
    );

  const handleImportData = async () => {
    if (dataUpload) await importData({ dataUpload, importMethod: importMethod! });
  };

  const { mutateAsync: importData, isLoading: isImporting } = api.adDivision.import.useMutation({
    onSuccess: async () => {
      setDataUpload([]);
      await context.adDivision.getAdDivisions.invalidate();
      notifyResult(Action.Import, ADMIN_DIVISION, true);
    },
    onError: (e) => {
      notifyResult(Action.Import, ADMIN_DIVISION, false, e.message);
    }
  });

  const columns = useMemo<MRT_ColumnDef<Wards>[]>(
    () => [
      {
        accessorKey: "wardCode",
        header: t("adDivision.wardCode")
      },
      {
        accessorKey: "wardName",
        header: t("adDivision.wardName")
      },
      {
        accessorKey: "districtId",
        header: t("adDivision.districtId")
      },
      {
        accessorKey: "districtName",
        header: t("adDivision.districtName")
      },
      {
        accessorKey: "cityId",
        header: t("adDivision.cityId")
      },
      {
        accessorKey: "cityName",
        header: t("adDivision.cityName")
      }
    ],
    []
  );

  const table = useCustomTable<Wards>(
    {
      columns,
      data: dataUpload.length > 0 ? dataUpload : (data?.data ?? []),
      rowCount: dataUpload.length > 0 ? dataUpload.length : (data?.count ?? 0),
      state: {
        isLoading,
        isSaving: isCreating || isUpdating || isDeleting || isDeletingAll || isImporting,
        globalFilter,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        columnPinning: {
          right: ["mrt-row-actions"]
        }
      },
      manualFiltering: dataUpload.length > 0 ? false : true,
      onGlobalFilterChange: setGlobalFilter,
      manualPagination: dataUpload.length > 0 ? false : true,
      onPaginationChange: setPagination,
      renderRowActions: ({ row }) => (
        <TableRowActions
          onUpdate={() => handleUpdate(row.original)}
          onDelete={() => handleDelete(row.original.cityId)}
        />
      ),
      renderTopToolbar: () => (
        <TableToolbar
          table={table}
          onCreate={handleCreate}
          onImport={() => setShowImportPopup(true)}
          onDeleteAll={data?.data.length! > 0 ? handleDeleteAll : undefined}
        />
      )
    },
    i18n.language
  );

  return (
    <Stack>
      <LoadingOverlay style={{ position: "fixed" }} visible={isImporting || isDeletingAll} />

      <PageHeader title={t("adDivision.title")} breadcrumbs={[ADMIN_DIVISION]} />

      <Paper>
        <MantineReactTable table={table} />
        {dataUpload && dataUpload.length !== 0 && (
          <>
            <Group justify="flex-end" m={"xs"}>
              <Button
                color="red"
                variant="filled"
                onClick={() => {
                  setDataUpload([]);
                  resetRef.current?.();
                }}>
                {t("cancel")}
              </Button>
              <Button loading={isImporting} color="green" variant="filled" onClick={handleImportData}>
                {t("saveChanges")}
              </Button>
            </Group>
          </>
        )}
      </Paper>

      <ImportExcelPopup
        importMethod={importMethod}
        opened={showImportPopup}
        setShowImportPopup={setShowImportPopup}
        headerCols={headers}
        resetRef={resetRef}
        handleFileChange={handleFileChange}
        setDataUpload={setDataUpload}
        dataUpload={dataUpload}
        setImportMethod={setImportMethod}
      />
    </Stack>
  );
};

export default AdminDivisionPage;
