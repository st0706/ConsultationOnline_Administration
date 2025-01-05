import { useTranslation } from "@/i18n";
import { ActionIcon, Anchor, Button } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";

export interface ArrayAddButtonProps {
  readonly propertyDisplayName?: string;
  readonly onClick: React.MouseEventHandler;
  readonly showText?: boolean;
  readonly linkStyle?: boolean;
}

export function ArrayAddButton({
  propertyDisplayName,
  onClick,
  showText,
  linkStyle = true
}: ArrayAddButtonProps): React.ReactNode {
  const { t } = useTranslation("fhir");
  // const text = propertyDisplayName ? t("resourceArray.add", { name: propertyDisplayName }) : t("add");
  const text = t("add");

  if (linkStyle)
    return (
      <Anchor onClick={onClick} fw="600">
        {text}
      </Anchor>
    );

  return showText ? (
    <Button
      title={text}
      size="sm"
      color="green.6"
      variant="subtle"
      fw="600"
      leftSection={<IconCirclePlus size="1.25rem" />}
      onClick={onClick}>
      {text}
    </Button>
  ) : (
    <ActionIcon title={text} color="green.6" onClick={onClick}>
      <IconCirclePlus size="1.25rem" />
    </ActionIcon>
  );
}
