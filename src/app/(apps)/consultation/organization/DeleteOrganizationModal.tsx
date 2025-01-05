"use client";

import useNotify, { Action } from "@/hooks/useNotify";
import { DataGrid, TreeNode } from "@/types/base";
import { Button, Modal, Title } from "@mantine/core";
import { api } from "@/trpc/react";
import { useTranslation } from "@/i18n";

interface IProps {
  ShowModalDelete: boolean;
  setShowModalDelete: (value: boolean) => void;
  organization: TreeNode | DataGrid | null;
  setOrganization: (value: TreeNode | DataGrid | null) => void;
}

const DeleteOrganizationModal = (props: IProps) => {
  const { t } = useTranslation("system");
  const ORGANIZATION = t("resource.organization");
  const { notifyResult } = useNotify();
  const { ShowModalDelete, setShowModalDelete, organization, setOrganization } = props;

  const handleCloseModal = () => {
    setOrganization(null);
    setShowModalDelete(false);
  };

  const context = api.useUtils();
  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: async () => {
      handleCloseModal();
      await context.invalidate();
      notifyResult(Action.Delete, ORGANIZATION, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, ORGANIZATION, false, e.message);
    }
  });

  const handleConfirm = async () => {
    const organizationId = props.organization?.id;
    if (organizationId) {
      const objId = {
        id: organizationId
      };
      await deleteOrganization.mutate(objId);
    }
  };
  return (
    <Modal.Root opened={ShowModalDelete} onClose={handleCloseModal}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <Title order={3}>Xóa {ORGANIZATION}</Title>
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          {organization ? (
            <>
              <p style={{ textAlign: "center" }}>{`Bạn có chắc muốn xóa ${organization.name} ?`}</p>
              <p style={{ textAlign: "center" }}>
                {`Chú ý: Xóa ${ORGANIZATION} này thì các ${ORGANIZATION} bên trong nó cũng sẽ bị xóa!`}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "5rem"
                }}>
                <Button onClick={() => handleConfirm()} justify="center" my={15} variant="filled" color="red">
                  OK
                </Button>
                <Button size="md" onClick={() => handleCloseModal()} justify="center" my={15} variant="default">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div>{ORGANIZATION} này không còn!</div>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default DeleteOrganizationModal;
