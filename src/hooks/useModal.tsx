"use client";
import { useTranslation } from "@/i18n";
import { Alert, MantineSize } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCancel, IconCircleCheckFilled, IconExclamationCircle } from "@tabler/icons-react";
import React from "react";
export enum DeleteAction {
  Delete = "delete",
  DeleteAll = "deleteAll",
  Revoke = "revoke",
  Leave = "leave"
}
export enum ConSultationAction {
  Propose = "proposeConsultation",
  Approve = "approveConsultation",
  Cancle = "cancelConsultation",
  Revoke = "revokeConsultation",
  StartConsultation = "startConsultation",
  Decline = "decline",
  Accept = "accept",
  End = "endConsultation"
}
const useModal = () => {
  const { t } = useTranslation("common");

  const confirmDelete = (
    object: string,
    onConfirm: () => void,
    name?: string | null,
    action: DeleteAction = DeleteAction.Delete,
    extraMessage?: string,
    onCancel?: () => void
  ) => {
    const actionText = t(`deleteAction.${action}`);
    modals.openConfirmModal({
      title: t("confirmDelete.title", { action: actionText }),
      centered: true,
      children: (
        <Alert variant="light" color="red" title={t("confirmDelete.contentTitle")} icon={<IconExclamationCircle />}>
          {t("confirmDelete.content", {
            action: actionText.toLowerCase(),
            object: object.toLowerCase(),
            name: name ? " " + name : ""
          })}
          {extraMessage && (
            <>
              <br />
              {extraMessage}
            </>
          )}
        </Alert>
      ),
      labels: { confirm: `${actionText} ${object}`, cancel: t("cancel") },
      confirmProps: { color: "red" },
      onConfirm,
      onCancel
    });
  };
  const confirmAction = (
    object: string,
    onConfirm: () => void,
    name?: string | null,
    action: ConSultationAction = ConSultationAction.Approve,
    extraMessage?: string,
    onCancel?: () => void
  ) => {
    const actionText = t(`action.${action}`);

    const approveAlert = action === ConSultationAction.Approve && (
      <Alert
        variant="light"
        color="green"
        title={t("confirmAction.approveConsultation")}
        icon={<IconCircleCheckFilled />}>
        {t("confirmDelete.content", {
          action: actionText.toLowerCase(),
          object: object.toLowerCase(),
          name: name ? " " + name : ""
        })}
        {extraMessage && (
          <>
            <br />
            {extraMessage}
          </>
        )}
      </Alert>
    );
    const proposeAlert = action === ConSultationAction.Propose && (
      <Alert
        variant="light"
        color="green"
        title={t("confirmAction.proposeConsultation")}
        icon={<IconCircleCheckFilled />}>
        {t("confirmDelete.content", {
          action: actionText.toLowerCase(),
          object: object.toLowerCase(),
          name: name ? " " + name : ""
        })}
        {extraMessage && (
          <>
            <br />
            {extraMessage}
          </>
        )}
      </Alert>
    );
    const cancleAlert = action === ConSultationAction.Cancle && (
      <Alert variant="light" color="red" title={t("confirmAction.cancleConsultation")} icon={<IconCancel />}>
        {t("confirmDelete.content", {
          action: actionText.toLowerCase(),
          object: object.toLowerCase(),
          name: name ? " " + name : ""
        })}
        {extraMessage && (
          <>
            <br />
            {extraMessage}
          </>
        )}
      </Alert>
    );
    const startConsultationAlert = action === ConSultationAction.StartConsultation && (
      <Alert variant="light" color="blue" title={t("confirmAction.startConsultation")} icon={<IconCancel />}>
        {t("confirmDelete.content", {
          action: actionText.toLowerCase(),
          object: object.toLowerCase(),
          name: name ? " " + name : ""
        })}
        {extraMessage && (
          <>
            <br />
            {extraMessage}
          </>
        )}
      </Alert>
    );
    const revokeAlert = action === ConSultationAction.Revoke && (
      <Alert variant="light" color="gray" title={t("confirmAction.revokeConsultation")} icon={<IconCancel />}>
        {t("confirmDelete.content", {
          action: actionText.toLowerCase(),
          object: object.toLowerCase(),
          name: name ? " " + name : ""
        })}
        {extraMessage && (
          <>
            <br />
            {extraMessage}
          </>
        )}
      </Alert>
    );
    const endAlert = action === ConSultationAction.End && (
      <Alert variant="light" color="red" title={t("confirmAction.endConsultation")} icon={<IconCancel />}>
        {t("confirmDelete.content", {
          action: actionText.toLowerCase(),
          object: object.toLowerCase(),
          name: name ? " " + name : ""
        })}
        {extraMessage && (
          <>
            <br />
            {extraMessage}
          </>
        )}
      </Alert>
    );
    modals.openConfirmModal({
      title: t("action.title", { action: actionText.toLowerCase() }),
      centered: true,
      children: approveAlert || cancleAlert || revokeAlert || startConsultationAlert || proposeAlert || endAlert,
      labels: { confirm: `${actionText} ${object}`, cancel: t("cancel") },
      confirmProps: { color: cancleAlert || revokeAlert || endAlert ? "red" : "green" },
      onConfirm,
      onCancel
    });
  };
  const confirmStatus = (
    object: string,
    onConfirm: () => void,
    name?: string | null,
    action?: string,
    extraMessage?: string,
    onCancel?: () => void
  ) => {
    const actionText = t(`action.${action}`);
    modals.openConfirmModal({
      title: t(`confirmAction.${action}`),
      centered: true,
      children: (
        <Alert
          variant="light"
          color={action === ConSultationAction.Decline ? "red" : "green"}
          title={action === ConSultationAction.Decline && t("confirmDelete.contentTitle")}
          icon={action === ConSultationAction.Decline && <IconExclamationCircle />}>
          {t("confirmDelete.content", {
            action: actionText.toLowerCase(),
            object: object.toLowerCase(),
            name: name ? " " + name : ""
          })}
          {extraMessage && (
            <>
              <br />
              {extraMessage}
            </>
          )}
        </Alert>
      ),
      labels: { confirm: `${actionText} ${object}`, cancel: t("cancel") },
      confirmProps: { color: action === ConSultationAction.Decline ? "red" : "green" },
      onConfirm,
      onCancel
    });
  };
  const actionForm = (
    modalId: string,
    name: string,
    Form: React.ComponentType<any>,
    isSubmitting?: boolean,
    onSubmit?: (values) => void,
    data?: any,
    size?: MantineSize | (string & {}) | number,
    orgType?: string[],
    disableType?: boolean,
    form?: any,
    path?: string,
    parentData?: any
  ) => {
    modals.open({
      modalId,
      title: !data ? t("addNewTitle", { object: name }) : t("editTitle", { object: name }),
      centered: true,
      closeOnClickOutside: false,
      size,
      children: (
        <Form
          data={data}
          orgType={orgType}
          disableType={disableType}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onClose={() => modals.close(modalId)}
          form={form}
          path={path}
          parentData={parentData}
        />
      )
    });
  };

  return {
    confirmDelete,
    actionForm,
    confirmAction,
    confirmStatus
  };
};

export default useModal;
