"use client";
import { TableRowActions } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
import useModal from "@/hooks/useModal";
import useNotify, { Variant } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { sendRequest } from "@/lib/meet";
import { Paper, Stack } from "@mantine/core";
import { MantineReactTable, MRT_ColumnDef, MRT_PaginationState } from "mantine-react-table";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";

interface Props {}
const RecordTab: FC<Props> = (props) => {
  const [records, setRecords] = useState<any>(null);
  const { id } = useParams();
  const { t, i18n } = useTranslation("consultation");
  const RECORD = t("record");
  const router = useRouter();
  const { notify } = useNotify();
  const { confirmDelete } = useModal();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "record_id",
        header: t("recordId")
      },
      {
        accessorKey: "creation_time",
        header: t("creationTime")
      },
      {
        accessorKey: "file_size",
        header: t("fileSize")
      }
    ],
    [i18n.language]
  );
  const handleDelete = async (id: string) => {
    confirmDelete(RECORD, async () => {
      const res = await sendRequest({ record_id: id }, "/recording/delete", notify, Variant);
      notify(res.message);
    });
  };
  const handleDownload = async (id: string) => {
    const res = await sendRequest({ record_id: id }, "/recording/getDownloadToken", notify, Variant);
    if (res.status) router.push(`${process.env.PLUG_N_MEET_SERVER_URL as string}/download/recording/${res.token}`);
    else notify(res.message);
  };
  useEffect(() => {
    const fetchRecord = async (roomId: string) => {
      const res = await sendRequest(
        { room_ids: [roomId], from: pagination.pageIndex, to: pagination.pageSize * pagination.pageIndex - 1 },
        "/recording/fetch",
        notify,
        Variant
      );
      if (!res.status) {
        notify(res.message);
      } else setRecords(res.result);
    };
    fetchRecord(id as string);
  }, [id, pagination]);
  const table = useCustomTable<any>(
    {
      columns,
      data: records?.recordings_list || [],
      rowCount: records?.total_recordings || 0,
      state: {
        pagination,
        columnPinning: {
          right: ["mrt-row-actions"]
        }
      },
      manualFiltering: false,
      manualPagination: true,
      onPaginationChange: setPagination,
      getRowId: (row) => row.id,
      renderRowActions: ({ row }) => (
        <TableRowActions
          onDelete={() => handleDelete(row.original.record_id)}
          onDownload={() => handleDownload(row.original.record_id)}
        />
      )
    },
    i18n.language
  );
  return (
    <Stack>
      <Paper>
        <MantineReactTable table={table} />
      </Paper>
    </Stack>
  );
};

export default RecordTab;
