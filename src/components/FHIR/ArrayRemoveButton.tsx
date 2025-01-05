import { useTranslation } from "@/i18n";
import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core";
import { IconCircleMinus } from "@tabler/icons-react";

export interface ArrayRemoveButtonProps extends ActionIconProps {
  readonly propertyDisplayName?: string;
  readonly onClick: React.MouseEventHandler;
}

export function ArrayRemoveButton({ propertyDisplayName, onClick, ...props }: ArrayRemoveButtonProps): React.ReactNode {
  const { t } = useTranslation("fhir");

  return (
    <Tooltip label={propertyDisplayName ? t("resourceArray.remove", { name: propertyDisplayName }) : t("remove")}>
      <ActionIcon color="red.5" variant="subtle" onClick={onClick} {...props}>
        <IconCircleMinus size="1.25rem" />
      </ActionIcon>
    </Tooltip>
  );
}
