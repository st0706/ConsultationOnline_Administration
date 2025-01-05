import { useTranslation } from "@/i18n";
import { getStatusColor } from "@/lib/color";
import { Badge } from "@mantine/core";
import { FC } from "react";

type Props = {
  status?: string;
};

const StatusBadge: FC<Props> = ({ status }) => {
  const { t } = useTranslation();

  if (!status) return null;

  return (
    <Badge color={getStatusColor(status)} variant="light" radius="sm">
      {t(status)}
    </Badge>
  );
};

export default StatusBadge;
