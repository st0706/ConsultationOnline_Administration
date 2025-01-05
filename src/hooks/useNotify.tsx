"use client";

import { useTranslation } from "@/i18n";
import { rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck, IconExclamationCircle, IconInfoCircle } from "@tabler/icons-react";
import { ReactNode } from "react";

export enum Action {
  Create = "create",
  Update = "update",
  Delete = "delete",
  DeleteAll = "deleteAll",
  Import = "import",
  Submit = "submit",
  Upload = "upload",
  Download = "download"
}

export enum Variant {
  Error = "red",
  Warning = "orange",
  Info = "blue",
  Success = "green"
}

const useNotify = () => {
  const { t } = useTranslation("common");

  const notify = (message: string, variant: Variant = Variant.Success, title?: string, icon?: ReactNode) => {
    if (!icon) {
      switch (variant) {
        case Variant.Success:
          icon = <IconCheck style={{ width: rem(18), height: rem(18) }} />;
          break;
        case Variant.Error:
          icon = <IconExclamationCircle style={{ width: rem(18), height: rem(18) }} />;
          break;
        case Variant.Warning:
          icon = <IconAlertTriangle style={{ width: rem(18), height: rem(18) }} />;
          break;
        case Variant.Info:
          icon = <IconInfoCircle style={{ width: rem(18), height: rem(18) }} />;
          break;
      }
    }

    notifications.show({
      color: variant,
      icon,
      title,
      message,
      withBorder: true
    });
  };

  const notifyResult = (action: Action, object: string, isSuccess: boolean, extraMessage?: string) => {
    const actionText = t(`action.${action}`);
    const message = t(`notify.${isSuccess ? "success" : "error"}`, {
      action: actionText.toLowerCase(),
      object: object
    });

    notifications.show({
      color: isSuccess ? "green" : "red",
      icon: isSuccess ? (
        <IconCheck style={{ width: rem(18), height: rem(18) }} />
      ) : (
        <IconExclamationCircle style={{ width: rem(18), height: rem(18) }} />
      ),
      title: `${actionText} ${object}`,
      message: extraMessage ? (
        <>
          {message}
          <br />
          {extraMessage}
        </>
      ) : (
        message
      ),
      withBorder: true,
      autoClose: isSuccess ? 6000 : 12000
    });
  };

  return {
    notify,
    notifyResult
  };
};

export default useNotify;
