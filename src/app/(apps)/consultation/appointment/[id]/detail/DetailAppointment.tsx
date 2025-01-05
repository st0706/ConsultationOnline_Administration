"use client";

import { useAuthStore } from "@/components/auth/AuthContext";
import { env } from "@/env";
import useModal, { ConSultationAction } from "@/hooks/useModal";
import useNotify, { Action, Variant } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { buildFolderTree, getOfficialName, slugify } from "@/lib/common";
import { localeDate, localeDateTime } from "@/lib/datetime";
import { api } from "@/trpc/react";
import { createClient } from "@/utils/supabase/client";
import {
  ActionIcon,
  Anchor,
  Button,
  Center,
  Divider,
  FileButton,
  Grid,
  Group,
  LoadingOverlay,
  Menu,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
  Tree,
  UnstyledButton,
  useTree
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconDoorEnter,
  IconDownload,
  IconFileTypeDoc,
  IconFileTypeDocx,
  IconFileTypePdf,
  IconFileTypeXls,
  IconFolder,
  IconFolderOpen,
  IconFolderPlus,
  IconTrash,
  IconUpload
} from "@tabler/icons-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import AppointmentStatus from "../../AppointmentStatus";
import FileForm from "./FileForm";
import FolderForm from "./FolderForm";
import classes from "./TreeFolder.module.css";

interface FileIconProps {
  name: string;
  isFolder: boolean;
  expanded: boolean;
}

const DetailAppointment = () => {
  const supabase = createClient();
  const consultationBucketUrl = "https://supabase.anphat.ai.vn/storage/v1/object/public/consultation/";
  const tree = useTree();
  const params = useParams();
  const { notifyResult, notify } = useNotify();
  const context = api.useUtils();
  const { actionForm, confirmDelete, confirmAction, confirmStatus } = useModal();
  const { t, i18n } = useTranslation("consultation");
  const APPOINTMENT = t("appointment.name");
  const { t: tH } = useTranslation("hrm");
  const { t: tF } = useTranslation("fhir");
  const APPOINTMENTSTATUS = t("appointment.status.name").toLowerCase();
  const btnCreateFileRef = useRef<HTMLButtonElement | null>(null);
  const btnCreateFolderRef = useRef<HTMLButtonElement | null>(null);
  const [dataRenderTree, setDataRenderTree] = useState<any>();
  const resetRef = useRef<() => void>(null);
  const [nodeClicked, setNodeClicked] = useState<any>();
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [isUploadingMultiFile, setIsUploadingMultiFile] = useState<boolean>(false);
  const { user } = useAuthStore()((state) => {
    return {
      user: state.authUser?.user
    };
  });

  const { data: appointmentData, isLoading: getDataLoading } = api.appointment.getById.useQuery(params.id as string);
  const { mutateAsync: downloadFolder, isLoading: isDownloadingFolder } = api.appointment.downloadFolder.useMutation(
    {}
  );
  const { data: dataDocumentTree, isLoading: getDataDocumentLoading } = api.appointment.getDocumentTree.useQuery({
    appointmentId: (appointmentData && appointmentData.id) || ""
  });

  const { mutateAsync: createFolder, isLoading: isCreatingFolder } = api.appointment.createFolder.useMutation({
    onSuccess: async () => {
      await context.invalidate();
    },
    onError: (e) => {
      notifyResult(Action.Create, t("folder"), false, e.message);
    }
  });
  const { mutateAsync: uploadFile } = api.appointment.uploadFile.useMutation({
    onSuccess: async () => {
      await context.invalidate();
    },
    onError: (e) => {
      notifyResult(Action.Upload, t("file"), false, e.message);
    }
  });
  const { mutateAsync: deleteDocument, isLoading: isDeletingDocument } = api.appointment.deleteDocument.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Delete, t("document"), true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, t("document"), false, e.message);
    }
  });
  const { mutateAsync: renameDocument, isLoading: isRenamingDocument } = api.appointment.rename.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Update, t("document"), true);
    },
    onError: (e) => {
      notifyResult(Action.Update, t("document"), false, e.message);
    }
  });

  const { mutateAsync: cancel, isLoading: isCanceling } = api.appointment.cancelAppointment.useMutation({
    onSuccess: () => {
      context.appointment.invalidate();
      notifyResult(Action.Update, APPOINTMENT, true);
    },
    onError: (e) => {
      notifyResult(Action.Update, APPOINTMENT, false, e.message);
    }
  });
  const { mutateAsync: approve, isLoading: isApproving } = api.appointment.approveAppointment.useMutation({
    onSuccess: () => {
      context.appointment.invalidate();
      notifyResult(Action.Update, APPOINTMENT, true);
    },
    onError: (e) => {
      notifyResult(Action.Update, APPOINTMENT, false, e.message);
    }
  });
  const { mutateAsync: revoke, isLoading: isRevoking } = api.appointment.revokeApprove.useMutation({
    onSuccess: () => {
      context.appointment.invalidate();
      notifyResult(Action.Update, APPOINTMENT, true);
    },
    onError: (e) => {
      notifyResult(Action.Update, APPOINTMENT, false, e.message);
    }
  });
  const { mutateAsync: end, isLoading: isEnding } = api.appointment.endConsultation.useMutation({
    onSuccess: () => {
      context.appointment.invalidate();
      notifyResult(Action.Update, APPOINTMENT, true);
    },
    onError: (e) => {
      notifyResult(Action.Update, APPOINTMENT, false, e.message);
    }
  });
  const { mutateAsync: update, isLoading: updateLoading } = api.appointment.update.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Update, t("appointment.participant.status"), true);
    },
    onError: async () => {
      notifyResult(Action.Update, t("appointment.participant.status"), true);
    }
  });

  const handleCancel = () =>
    confirmAction(APPOINTMENTSTATUS, () => cancel(params.id as string), null, ConSultationAction.Cancle);
  const handleApprove = () => {
    confirmAction(APPOINTMENTSTATUS, () => approve(params.id as string), null, ConSultationAction.Approve);
  };
  const handlePropose = () => {
    confirmAction(APPOINTMENTSTATUS, () => approve(params.id as string), null, ConSultationAction.Propose);
  };
  const handleRevoke = () => {
    confirmAction(APPOINTMENTSTATUS, () => revoke(params.id as string), null, ConSultationAction.Revoke);
  };
  const handleEndMeeting = () => {
    confirmAction(APPOINTMENT, () => end(params.id as string), null, ConSultationAction.End);
  };

  useEffect(() => {
    if (dataDocumentTree) {
      setDataRenderTree(dataDocumentTree);
    }
  }, [dataDocumentTree]);

  useEffect(() => {
    if (dataRenderTree) {
      tree.setSelectedState([dataRenderTree[0]?.path]);
      setNodeClicked(dataRenderTree[0]);
    }
  }, [dataRenderTree]);

  const handleParticipantAction = async (participantId, action) => {
    confirmStatus(
      t("joinAppointment"),
      async () => {
        let updatedAppointmentData: any = { ...appointmentData };
        updatedAppointmentData.participant = (updatedAppointmentData.participant as any).map((participant) => {
          if (participant.id === participantId) {
            return {
              ...participant,
              status: action
            };
          }
          return participant;
        });
        await update(updatedAppointmentData);
      },
      null,
      action === "Accepted" ? ConSultationAction.Accept : ConSultationAction.Decline
    );
  };

  const rows =
    appointmentData &&
    (appointmentData.participant as any[]).map((participant) => {
      return (
        <Table.Tr key={participant.id}>
          <Table.Td>{getOfficialName(participant.name)}</Table.Td>
          <Table.Td>{t(`appointment.participant.type.${participant.type?.at(0).text}`)}</Table.Td>
          <Table.Td>
            {user?.id === participant.accountId && participant.status === "Pending" ? (
              <Group gap={"lg"}>
                <Button
                  onClick={() => handleParticipantAction(participant.id, "Accepted")}
                  variant="filled"
                  color="green">
                  {t("appointment.participant.accepted")}
                </Button>{" "}
                <Button
                  onClick={() => handleParticipantAction(participant.id, "Declined")}
                  variant="filled"
                  color="red">
                  {t("appointment.participant.declined")}
                </Button>
              </Group>
            ) : (
              t(`appointment.participant.${participant.status.toLowerCase()}`)
            )}
          </Table.Td>
        </Table.Tr>
      );
    });

  function FileIcon({ name, isFolder, expanded }: FileIconProps) {
    if (name.endsWith(".pdf")) {
      return <IconFileTypePdf size={20} />;
    }

    if (name.endsWith(".doc")) {
      return <IconFileTypeDoc size={20} />;
    }

    if (name.endsWith(".docx")) {
      return <IconFileTypeDocx size={20} />;
    }

    if (name.endsWith(".xls") || name.endsWith(".xlsx")) {
      return <IconFileTypeXls size={20} />;
    }
    if (name === ".emptyFolderPlaceholder") return null;
    if (isFolder) {
      return expanded ? (
        <IconFolderOpen color="var(--mantine-color-yellow-9)" size={20} stroke={2.5} />
      ) : (
        <IconFolder color="var(--mantine-color-yellow-9)" size={20} stroke={2.5} />
      );
    }

    return null;
  }

  const handleNodeClick = (e: React.MouseEvent<Element, MouseEvent>, node) => {
    const value = e.currentTarget.getAttribute("data-value");
    const isFolder = value && value.split("/").pop() === ".emptyFolderPlaceholder";
    setNodeClicked(node);

    if (!isFolder) {
      btnCreateFileRef.current?.setAttribute("disabled", "true");
      btnCreateFolderRef.current?.setAttribute("disabled", "true");
    }
    if (isFolder) {
      btnCreateFileRef.current?.removeAttribute("disabled");
      btnCreateFolderRef.current?.removeAttribute("disabled");
    }
  };

  const handleCreateFolder = () => {
    actionForm(
      "create-folder",
      t("folder"),
      FolderForm,
      isCreatingFolder,
      async (values) => {
        const path =
          `${nodeClicked.path}/${slugify(values.name)}-${Date.now()}`.replace("/.emptyFolderPlaceholder", "") +
          "/.emptyFolderPlaceholder";
        const res = await createFolder({ appointmentId: appointmentData!.id!, path, name: values.name });
        if (res.path) {
          modals.close("create-folder");
          notifyResult(Action.Create, t("folder"), true);
        }
      },
      { appointmentId: appointmentData!.id, path: nodeClicked.path }
    );
  };

  const handleUploadFile = async (files: any[]) => {
    if (files) {
      let flagNotify = 0;
      setIsUploadingFile(true);
      const supabaseStorage = supabase.storage.from("consultation");

      const promise = files.map(async (file) => {
        const name = file.name;
        const fileExtension = file.name.substring(file.name.lastIndexOf("."));
        const fileNameToCreatePath = `${slugify(name)}-${Date.now()}${fileExtension}`;
        const path = `${nodeClicked.path}/${fileNameToCreatePath}`.replace("/.emptyFolderPlaceholder", "");
        try {
          // Upload to storage
          const { error } = await supabaseStorage.upload(path, file, {
            cacheControl: "3600",
            upsert: false
          });

          if (error) throw error;

          const documentTime = new Date();
          const {
            data: { publicUrl }
          } = supabaseStorage.getPublicUrl(path);

          // Call the function to upload file metadata
          const res = await uploadFile({
            appointmentId: appointmentData!.id!,
            path,
            name,
            url: publicUrl,
            documentTime,
            fileNameOriginal: file.name
          });

          if (!res?.path) flagNotify++;
        } catch (err) {
          throw err;
        }
      });

      await Promise.all(promise);

      setIsUploadingFile(false);
      if (!flagNotify) notifyResult(Action.Upload, t("file"), true);
    }
    resetRef?.current?.();
  };

  const handleDeleteDocument = () => {
    const path = nodeClicked?.path.replace("/.emptyFolderPlaceholder", "");
    if (!path) notify(t("warningSelectDocumentDelete"), Variant.Warning);
    else
      confirmDelete(t("document"), async () => {
        await deleteDocument({ path });
      });
  };

  const handleUploadFolder = async (values: FileList) => {
    if (values) {
      const files = Array.from(values);
      const groupedFiles = buildFolderTree(files);
      let flagNotify = 0;
      setIsUploadingMultiFile(true);

      async function createFolderStructure(folderTree, rootPath) {
        const promises: Promise<any>[] = [];
        for (const [name, content] of Object.entries(folderTree)) {
          const fullPath = rootPath + "/" + slugify(name);

          if (content instanceof File) {
            const uploadPromise = (async () => {
              const { error } = await supabaseStorage.upload(fullPath, content, {
                cacheControl: "3600",
                upsert: false
              });

              if (error) throw error;
              const documentTime = new Date();
              const {
                data: { publicUrl }
              } = supabaseStorage.getPublicUrl(fullPath);

              const res = await uploadFile({
                appointmentId: appointmentData!.id!,
                path: fullPath,
                name,
                url: publicUrl,
                documentTime,
                fileNameOriginal: name
              });
              if (!res?.path) flagNotify++;
            })();

            promises.push(uploadPromise);
          } else {
            const res = await createFolder({
              appointmentId: appointmentData?.id!,
              path: fullPath + "/.emptyFolderPlaceholder",
              name: name
            });
            if (!res?.path) flagNotify++;

            const folderPromise = createFolderStructure(content, fullPath);
            promises.push(folderPromise);
          }
        }

        return Promise.all(promises);
      }

      const supabaseStorage = supabase.storage.from("consultation");

      await createFolderStructure(groupedFiles, nodeClicked?.path.replace("/.emptyFolderPlaceholder", ""));
      setIsUploadingMultiFile(false);
      if (!flagNotify) notifyResult(Action.Create, t("folder"), true);
    }
  };

  const handleRenameDocument = () => {
    const isFolder = nodeClicked?.path.split("/").pop() === ".emptyFolderPlaceholder";
    if (isFolder) {
      actionForm(
        "rename-folder",
        t("folder"),
        FolderForm,
        isRenamingDocument,
        async (values) => {
          const id = nodeClicked.id;
          const name = values.name;
          const res = await renameDocument({ id, name });
          if (res.id) modals.close("rename-folder");
        },
        nodeClicked
      );
    } else {
      actionForm(
        "rename-file",
        t("file"),
        FileForm,
        isRenamingDocument,
        async (values) => {
          const id = nodeClicked.id;
          const name = values.nameFile;
          const documentTime = values.documentTime;
          const res = await renameDocument({ id, name, documentTime });
          if (res.id) modals.close("rename-file");
        },
        nodeClicked
      );
    }
  };

  function flattenTreeToUrls(tree: any, basePath: string = ""): { url: string; path: string }[] {
    const result: { url: string; path: string }[] = [];
    tree.children?.forEach((node: any) => {
      if (node.url) {
        const [base, url] = node.url.split(consultationBucketUrl);
        result.push({ url: url, path: `${basePath}/${node.name}` });
      }

      if (node.children?.length) {
        result.push(...flattenTreeToUrls(node, `${basePath}/${node.name}`));
      }
    });
    return result;
  }

  const handleDownload = async (node: any) => {
    try {
      if (!node) return;

      const isFolder = node.path.split("/").pop() === ".emptyFolderPlaceholder";
      const nodePath = node.path;

      if (isFolder) {
        const folder = flattenTreeToUrls(node);
        const { zipBuffer } = await downloadFolder(folder);
        const buffer = Buffer.from(zipBuffer.buffer);
        const blob = new Blob([buffer], { type: "application/zip" });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${node.name}.zip`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        const { data, error } = await supabase.storage.from("consultation").download(nodePath);
        if (error) {
          notifyResult(Action.Download, t("file"), false, error.message);
          return;
        }

        const url = URL.createObjectURL(data);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = node.name;
        anchor.click();
        URL.revokeObjectURL(url);
        notifyResult(Action.Download, t("file"), true);
      }
    } catch (error: any) {
      console.error(error);
      notifyResult(Action.Download, t("document"), false, error.message || "An unexpected error occurred.");
    }
  };

  function Leaf({ node, expanded, elementProps }) {
    const isFolder = node.path.split("/").pop() === ".emptyFolderPlaceholder";
    return node.label !== ".emptyFolderPlaceholder" ? (
      <Group gap={5} {...elementProps}>
        <FileIcon name={node.name} isFolder={isFolder} expanded={expanded} />

        <Group>
          <span>{node.label}</span>
          {nodeClicked?.id === node?.id && (
            <ActionIcon onClick={() => handleDownload(node)}>
              <IconDownload />
            </ActionIcon>
          )}
        </Group>
      </Group>
    ) : null;
  }

  const isDicomFileOrFolder = (node) => {
    if (!node) return false;
    else {
      if (!node.children) return node.name?.toLowerCase().endsWith(".dcm");
      else return node.children.some((child) => child.name.toLowerCase().endsWith(".dcm"));
    }
  };

  return (
    <>
      <LoadingOverlay
        style={{ position: "fixed" }}
        visible={
          getDataLoading ||
          getDataDocumentLoading ||
          isRenamingDocument ||
          isUploadingFile ||
          isCreatingFolder ||
          isUploadingFile ||
          isUploadingMultiFile ||
          isDeletingDocument ||
          isCanceling ||
          isApproving ||
          isRevoking ||
          isEnding ||
          updateLoading ||
          isDownloadingFolder
        }
      />
      {appointmentData && dataRenderTree && (
        <Paper p={{ base: "md", md: "lg", xl: 24 }}>
          <Stack>
            <Title mb={"md"} order={4}>
              {t("appointment.content")}
            </Title>
            {appointmentData && (
              <AppointmentStatus
                handlePropose={handlePropose}
                handleRevokeApprove={handleRevoke}
                handleApprove={handleApprove}
                handleCancel={handleCancel}
                appointmentData={appointmentData}
                handleEndMeeting={handleEndMeeting}
              />
            )}
            <Grid mt={"xl"}>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.nameLabel")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {appointmentData.name}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.status.name")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {t(`appointment.status.${appointmentData.status}`)}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.appointmentType.name")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData.appointmentType as any).text
                      ? t(`appointment.appointmentType.${(appointmentData.appointmentType as any)!.text}`)
                      : ""}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.priority.name")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData.priority as any).text
                      ? t(`appointment.priority.${(appointmentData.priority as any)!.text}`)
                      : ""}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.start")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {localeDateTime(appointmentData.start!, i18n.language)}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.end")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {localeDateTime(appointmentData.end!, i18n.language)}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.specialty")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData.specialty as any)
                      ?.map((specialty) => {
                        return specialty.text;
                      })
                      .join(", ")}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.reason.name")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData.reason as any)
                      ?.map((reason) => {
                        return reason.concept.text;
                      })
                      .join(", ")}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.description")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {appointmentData.description}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.note")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData.note as any).text}
                  </Text>
                </Text>
              </Grid.Col>
            </Grid>
            <Divider my={"md"} size={"md"} />
            <Title mb={"md"} order={4}>
              {t("appointment.consultationContent")}
            </Title>
            <Title order={5}>{t("appointment.administrativeSection")}</Title>
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.name")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).name}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.birthDate")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {localeDate((appointmentData?.subject as any).birthDate, i18n.language)}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.gender")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).gender
                      ? tH(`gender.${(appointmentData?.subject as any).gender}`)
                      : ""}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.ethnic")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).ethnic}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.nationality")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).nationality}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.occupation")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).occupation}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {tF("address.province")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).address?.city}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {tF("address.district")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).address?.district}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {tF("address.ward")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).address?.ward}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {tF("address.details")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).address?.details}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.admissionNumber")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).admissionNumber}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.insuranceNumber")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).insuranceNumber}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.admissionTime")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {localeDateTime((appointmentData?.subject as any).admissionTime, i18n.language)}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.admissionDepartment")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).admissionDepartment}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.requestConsultation")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).requestConsultation}
                  </Text>
                </Text>
              </Grid.Col>
            </Grid>
            <Title order={5}>{t("appointment.diseaseProgression")}</Title>
            <Grid gutter={"xl"}>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.summaryMedicalHistory")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).summaryMedicalHistory}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.conditionAdmission")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).conditionAdmission}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.diagnose")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).diagnose}
                  </Text>
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Text span>
                  <Text span c={"gray"}>
                    {t("appointment.subject.summary")}:
                  </Text>
                  {"\u00A0\u00A0\u00A0\u00A0"}
                  <Text span fw={500}>
                    {(appointmentData?.subject as any).summary}
                  </Text>
                </Text>
              </Grid.Col>
            </Grid>
            <Divider my={"md"} size={"md"} />
            <Title mb={"md"} order={4}>
              {t("appointment.list")}
            </Title>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t("appointment.participant.labelName")}</Table.Th>
                  <Table.Th>{t("appointment.participant.type.name")}</Table.Th>
                  <Table.Th>{t("appointment.participant.status")}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            <Divider my={"md"} size={"md"} />
            <Title mb={"md"} order={4}>
              {t("relatedDocuments")}
            </Title>
            <Group justify="flex-end">
              <Button
                disabled={!isDicomFileOrFolder(nodeClicked)}
                onClick={(e) => {
                  window.open(
                    `${env.NEXT_PUBLIC_PACS_URL}/localbasic?path=${nodeClicked.path.replace(".emptyFolderPlaceholder", "")}`
                  );
                }}
                ref={btnCreateFolderRef}
                color="teal"
                variant="subtle"
                size="sm"
                leftSection={<IconDoorEnter size={14} />}>
                {t("open-dicom")}
              </Button>

              <Menu trigger="click">
                <Menu.Target>
                  <Button
                    ref={btnCreateFileRef}
                    color="teal"
                    variant="subtle"
                    size="sm"
                    leftSection={<IconUpload size={14} />}>
                    {t("upload")}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Stack>
                    <FileButton multiple resetRef={resetRef} onChange={(e) => handleUploadFile(e)}>
                      {(props) => <UnstyledButton {...props}>{t("select-files")}</UnstyledButton>}
                    </FileButton>
                    <label htmlFor="folderUpload" style={{ cursor: "pointer", display: "block", width: "100%" }}>
                      {t("select-folder")}
                      <input
                        type="file"
                        multiple
                        /* @ts-expect-error */
                        webkitdirectory="true"
                        onChange={(e) => {
                          var items = e.target.files;
                          if (items) handleUploadFolder(items);
                        }}
                        style={{ display: "none" }}
                        id="folderUpload"
                      />
                    </label>
                  </Stack>
                </Menu.Dropdown>
              </Menu>

              <Button
                onClick={() => handleCreateFolder()}
                ref={btnCreateFolderRef}
                color="teal"
                variant="subtle"
                size="sm"
                leftSection={<IconFolderPlus size={14} />}>
                {t("create-folder")}
              </Button>

              <Button
                disabled={nodeClicked === dataRenderTree[0]}
                onClick={() => handleDeleteDocument()}
                color="red"
                variant="subtle"
                size="sm"
                leftSection={<IconTrash size={14} />}>
                {t("delete")}
              </Button>
              <Button onClick={() => handleRenameDocument()} color="indigo" variant="subtle" size="sm">
                {t("rename")}
              </Button>
            </Group>
            <Paper shadow="xs" p="md">
              <ScrollArea h={250}>
                <Tree
                  tree={tree}
                  classNames={classes}
                  selectOnClick
                  // clearSelectionOnOutsideClick
                  data={dataRenderTree}
                  renderNode={(payload) => (
                    <Leaf
                      {...payload}
                      elementProps={{
                        ...payload.elementProps,
                        onClick: (e) => {
                          payload.elementProps.onClick(e);
                          handleNodeClick(e, payload.node);
                        }
                      }}
                    />
                  )}
                />
              </ScrollArea>
            </Paper>
          </Stack>
        </Paper>
      )}
    </>
  );
};

export default DetailAppointment;
