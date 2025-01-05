"use client";

import { LetterAvatar } from "@/components/common";
import { TableRowActions, TableToolbar } from "@/components/table";
import { useCustomTable } from "@/hooks/useCustomTable";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { DataGrid } from "@/types/base";
import { Group, LoadingOverlay, Text } from "@mantine/core";
import { CodeableConcept, ExtendedContactDetail, Identifier, Reference } from "fhir/r5";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import "mantine-react-table/styles.css";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function buildDataToGrid(data: any, partOfId: string | null = null): DataGrid[] {
  const tree: DataGrid[] = [];

  data.forEach((item) => {
    if (item.partOfId === partOfId || (partOfId === null && item.partOfId === "null")) {
      const subRows = buildDataToGrid(data, item.id);
      const node: DataGrid = {
        resourceType: "Organization",
        id: item.id,
        identifier: item.identifier as Identifier[],
        active: item.active || undefined,
        type: item.type as CodeableConcept[],
        name: item.name,
        alias: item.alias,
        description: item.description || null,
        contact: item.contact as ExtendedContactDetail[],
        endpoint: item.endpoint as Reference[],
        logo: item.logo,
        website: item.website,
        partOfId: item.partOfId,
        subRows
      };
      tree.push(node);
    }
  });
  return tree;
}

export default function DataGridViewOrganizations() {
  const { t, i18n } = useTranslation("system");
  const ORGANIZATION = t("resource.organization");
  const { notifyResult } = useNotify();
  const context = api.useUtils();
  const router = useRouter();
  const [dataRender, setDataRender] = useState<DataGrid[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  let { data, isLoading, isFetching } = api.organization.getAll.useQuery();

  useEffect(() => {
    setDataRender(buildDataToGrid(data || []));
  }, [data]);

  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Delete, ORGANIZATION, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, ORGANIZATION, false, e.message);
    }
  });

  const handleDelete = async (organizationId) => {
    if (organizationId) {
      const objId = {
        id: organizationId
      };
      await deleteOrganization.mutate(objId);
    }
  };

  const handleCreate = () => {
    router.push(`organization/create?organizationId=${null}`);
  };

  const handleUpdate = (id) => {
    router.push(`organization/update?organizationId=${id}`);
  };

  const handleCreateChild = (id) => {
    router.push(`organization/create?organizationId=${id}`);
  };

  const columns = useMemo<MRT_ColumnDef<DataGrid>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("organization.nameTable"),
        Cell: ({ row, renderedCellValue }) => (
          <Group gap="xs">
            <LetterAvatar size={40} src={row.original.logo} name={row.original.name || undefined} />
            <Text fz="sm" fw={500}>
              {renderedCellValue}
            </Text>
          </Group>
        )
      },
      {
        accessorKey: "alias",
        header: t("organization.alias")
      },
      {
        accessorKey: "website",
        header: t("organization.website")
      }
    ],
    [i18n.language]
  );

  const table = useCustomTable<DataGrid>(
    {
      columns,
      data: dataRender.length > 0 ? dataRender : [],
      manualPagination: false,
      manualFiltering: false,
      enableExpandAll: true,
      enableExpanding: true,
      filterFromLeafRows: true,
      paginateExpandedRows: true,
      enableRowNumbers: false,
      initialState: {
        density: "xs",
        showGlobalFilter: true,
        expanded: true
      },
      renderRowActions: ({ row }) => (
        <TableRowActions
          onCreateChild={() => handleCreateChild(row.original.id)}
          onUpdate={() => handleUpdate(row.original.id)}
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
      renderTopToolbar: () => <TableToolbar table={table} onCreate={handleCreate} />
    },
    i18n.language
  );

  return (
    <>
      <LoadingOverlay visible={isLoading || isFetching} />
      <MantineReactTable table={table} />
    </>
  );
}
