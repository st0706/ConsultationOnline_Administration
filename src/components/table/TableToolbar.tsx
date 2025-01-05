import { useTranslation } from "@/i18n";
import { ActionIcon, Button, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCirclePlus, IconFileImport, IconFileX } from "@tabler/icons-react";
import {
  MRT_GlobalFilterTextInput,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton
} from "mantine-react-table";
import { FC } from "react";

interface Props {
  table: any;
  onCreate?: () => void;
  onImport?: () => void;
  onDeleteAll?: () => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showColumns?: boolean;
  showDensity?: boolean;
  showFullScreen?: boolean;
}

const TableToolbar: FC<Props> = ({
  table,
  onCreate,
  onImport,
  onDeleteAll,
  showSearch = true,
  showFilters,
  showColumns,
  showDensity,
  showFullScreen
}) => {
  const { t } = useTranslation("common");
  const isMobile = useMediaQuery("(max-width: 430px)");

  return (
    <Group justify="space-between" wrap="wrap" mb="xs">
      {showSearch && <MRT_GlobalFilterTextInput table={table} />}
      <Group gap="xs">
        {onCreate &&
          (isMobile ? (
            <ActionIcon variant="light" color="teal" size="lg" onClick={onCreate}>
              <IconCirclePlus />
            </ActionIcon>
          ) : (
            <Button color="teal" leftSection={<IconCirclePlus size={18} />} onClick={onCreate}>
              {t("addNew")}
            </Button>
          ))}
        {onImport &&
          (isMobile ? (
            <ActionIcon variant="light" color="teal" size="lg" onClick={onImport}>
              <IconFileImport />
            </ActionIcon>
          ) : (
            <Button color="teal" variant="light" leftSection={<IconFileImport size={18} />} onClick={onImport}>
              {t("import")}
            </Button>
          ))}
        {onDeleteAll && !isMobile && (
          <Button variant="light" color="red" leftSection={<IconFileX size={18} />} onClick={onDeleteAll}>
            {t("removeAll")}
          </Button>
        )}
        {showFilters && <MRT_ToggleFiltersButton table={table} />}
        {showColumns && <MRT_ShowHideColumnsButton table={table} />}
        {showDensity && <MRT_ToggleDensePaddingButton table={table} />}
        {showFullScreen && <MRT_ToggleFullScreenButton table={table} />}
      </Group>
    </Group>
  );
};

export default TableToolbar;
