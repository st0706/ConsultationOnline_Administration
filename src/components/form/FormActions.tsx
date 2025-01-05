"use client";

import { useTranslation } from "@/i18n";
import { Button, Group } from "@mantine/core";
import { IconCircleCheck, IconX } from "@tabler/icons-react";
import { FC, ReactNode } from "react";

interface Props {
  isNew?: boolean;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
  centered?: boolean;
  canSubmit?: boolean;
  otherActions?: ReactNode;
}

const FormActions: FC<Props> = ({
  isNew,
  submitLabel,
  isSubmitting,
  onSubmit,
  onClose,
  centered,
  canSubmit,
  otherActions
}) => {
  const { t } = useTranslation("common");

  return (
    <Group justify={centered ? "center" : "flex-end"}>
      {onClose && (
        <Button variant="light" color="default" onClick={onClose} leftSection={<IconX size={16} />} fw="normal">
          {t("cancel")}
        </Button>
      )}
      {otherActions}
      <Button
        onClick={onSubmit}
        type="submit"
        color="teal"
        disabled={!canSubmit}
        loading={isSubmitting}
        leftSection={<IconCircleCheck size={18} />}>
        {submitLabel || t(isNew ? "addNew" : "update")}
      </Button>
    </Group>
  );
};

export default FormActions;
