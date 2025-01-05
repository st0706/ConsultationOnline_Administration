"use client";

import { useTranslation } from "@/i18n";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconCirclePlus, IconDownload, IconEdit, IconEye, IconFileTypeDocx, IconTrash } from "@tabler/icons-react";
import { FC } from "react";

interface Props {
  onView?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  onCreateChild?: (e: any) => void;
  onExport?: () => void;
  onDownload?: () => void;
}

const TableRowActions: FC<Props> = ({ onView, onUpdate, onDelete, onCreateChild, onExport, onDownload }) => {
  const { t } = useTranslation("common");

  return (
    <Group wrap="nowrap" gap={4}>
      {onView && (
        <Tooltip label={t("viewDetails")}>
          <ActionIcon variant="subtle" color="gray" onClick={onView}>
            <IconEye size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
      {onCreateChild && (
        <Tooltip label={t("addChild")}>
          <ActionIcon variant="subtle" color="gray" onClick={onCreateChild}>
            <IconCirclePlus size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
      {onUpdate && (
        <Tooltip label={t("edit")}>
          <ActionIcon variant="subtle" color="gray" onClick={onUpdate}>
            <IconEdit size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip label={t("delete")}>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={(e: any) => {
              e.stopPropagation();
              onDelete();
            }}>
            <IconTrash size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
      {onExport && (
        <Tooltip label={t("exportDocx")}>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={(e: any) => {
              e.stopPropagation();
              onExport();
            }}>
            <IconFileTypeDocx size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
      {onDownload && (
        <Tooltip label={t("download")}>
          <ActionIcon variant="subtle" color="gray" onClick={onDownload}>
            <IconDownload size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
};

export default TableRowActions;
