"use client";
import { useAuthStore } from "@/components/auth/AuthContext";
import useNotify, { Variant } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { getOfficialName, isValidRole } from "@/lib/common";
import { handleJoinRoom, sendRequest } from "@/lib/meet";
import { AppointmentRole } from "@/types/enums";
import { createClient } from "@/utils/supabase/client";
import { Button, Group, Stepper } from "@mantine/core";
import { IconCircleX } from "@tabler/icons-react";
import React from "react";
import { useEffect, useState } from "react";

interface Props {
  appointmentData: any;
  handleCancel: () => void;
  isCanceling?: boolean;
  handleApprove: () => void;
  isApproving?: boolean;
  handleRevokeApprove: () => void;
  handlePropose: () => void;
  handleEndMeeting: () => void;
}

const AppointmentStatus = ({
  appointmentData,
  handleApprove,
  handleCancel,
  handleRevokeApprove,
  handlePropose,
  handleEndMeeting
}: Props) => {
  const [data, setData] = useState(appointmentData);
  const supabase = createClient();
  const { t } = useTranslation("consultation");
  const [active, setActive] = useState(1);
  const { notify } = useNotify();
  const [roomStatus, setRoomStatus] = useState<boolean | null>(null);
  const { user, userRole } = useAuthStore()((state) => {
    return {
      authUser: state.authUser?.session,
      user: state.authUser?.user,
      userRole: state.authUser?.session?.access_token?.user_role
    };
  });
  const isAppAdmin = isValidRole(userRole, [AppointmentRole.Admin, AppointmentRole.Moderator]);
  const isAppointmentAdmin =
    appointmentData.participant?.find((mem) => mem.accountId === user?.id)?.type?.at(0).text === "ADMIN";

  const handleStartMeeting = async () => {
    const user_id = user?.id;
    const appointment = appointmentData;
    if (appointment && appointment.status !== "approvedLevel2" && appointment.status !== "inProgress") {
      notify(t("invalidStatus"), Variant.Error);
    }
    const members = appointment.participant as any[];

    const isAdmin =
      isAppAdmin ||
      members.some((mem) => mem.accountId === user_id && mem.type?.at(0).text === "ADMIN" && mem.status === "Accepted");

    const room = { id: appointment.id, title: appointment.name };
    const userInfo = {
      type: isAdmin ? "admin" : "participant",
      name: isAdmin
        ? getOfficialName(members.find((mem) => mem.accountId === user_id)?.name) ||
          user?.user_metadata?.name ||
          "Admin"
        : getOfficialName(members.find((mem) => mem.accountId === user_id)?.name) ||
          user?.user_metadata?.name ||
          "Participant",
      id: user_id
    };

    if (!isAdmin) await handleJoinRoom(room, userInfo, notify, Variant);
    else {
      const res = await handleJoinRoom(room, userInfo, notify, Variant);
      if (res.status) {
        const { error } = await supabase
          .from("Appointment")
          .update({
            status: "inProgress"
          })
          .eq("id", appointment.id);
        if (error) notify(error.message, Variant.Error);
      }
    }
  };

  const renderFinalStep = () => {
    const status = data.status === "inProgress" ? "inProgress" : data.status === "fulfilled" ? "fulfilled" : "upcoming";
    return (
      <Stepper.Step
        color="green"
        loading={status === "inProgress"}
        label={t(`appointment.${status}.label`)}
        description={t(`appointment.${status}.description`)}></Stepper.Step>
    );
  };
  const renderApprovalButton = () => {
    if (
      isValidRole(userRole, [
        AppointmentRole.Admin,
        AppointmentRole.ApproveLevel1,
        AppointmentRole.ApproveLevel2,
        AppointmentRole.Moderator
      ]) &&
      data.status === "cancelled"
    ) {
      return (
        <Group justify="center" mt="xl">
          <Button
            variant="filled"
            color="green"
            onClick={() => {
              handlePropose();
            }}>
            {t("propose")}
          </Button>
        </Group>
      );
    } else if (
      isValidRole(userRole, [
        AppointmentRole.Admin,
        AppointmentRole.ApproveLevel1,
        AppointmentRole.ApproveLevel2,
        AppointmentRole.Moderator
      ]) &&
      (data.status === "proposed" || data.status === "approvedLevel1")
    ) {
      return (
        <Group justify="center" mt="xl">
          <Button
            variant="filled"
            color="red"
            onClick={() => {
              handleCancel();
            }}>
            {t("cancel")}
          </Button>
          {data.status === "approvedLevel1" && (
            <Button
              variant="filled"
              color="red"
              onClick={() => {
                handleRevokeApprove();
              }}>
              {t("revoke")}
            </Button>
          )}
          <Button
            variant="filled"
            color="green"
            onClick={() => {
              handleApprove();
            }}>
            {t("approve")}
          </Button>
        </Group>
      );
    } else if (
      isValidRole(userRole, [
        AppointmentRole.Admin,
        AppointmentRole.Moderator,
        AppointmentRole.ApproveLevel1,
        AppointmentRole.ApproveLevel2,
        AppointmentRole.Participant
      ]) &&
      data.status === "approvedLevel2"
    ) {
      return (
        <Group justify="center" mt="xl">
          {isAppAdmin && (
            <>
              <Button
                variant="filled"
                color="red"
                onClick={() => {
                  handleCancel();
                }}>
                {t("cancel")}
              </Button>
              <Button
                variant="filled"
                color="red"
                onClick={() => {
                  handleRevokeApprove();
                }}>
                {t("revoke")}
              </Button>
            </>
          )}
          <Button
            variant="filled"
            color="green"
            disabled={!isAppointmentAdmin && !isAppAdmin && !roomStatus}
            onClick={() => {
              handleStartMeeting();
            }}>
            {roomStatus
              ? t("joinConsultation")
              : isAppointmentAdmin || isAppAdmin
                ? t("startConsultation")
                : t("joinConsultation")}
          </Button>
          {(isAppointmentAdmin || isAppAdmin) && appointmentData.status === "inProgress" && (
            <Button
              variant="filled"
              color="red"
              onClick={() => {
                handleEndMeeting();
              }}>
              {t("endConsultation")}
            </Button>
          )}
        </Group>
      );
    } else if (
      isValidRole(userRole, [
        AppointmentRole.Admin,
        AppointmentRole.ApproveLevel1,
        AppointmentRole.ApproveLevel2,
        AppointmentRole.Moderator
      ]) &&
      (data.status === "proposed" || data.status === "approvedLevel1")
    ) {
      return (
        <Group justify="center" mt="xl">
          <Button
            variant="filled"
            color="red"
            onClick={() => {
              handleCancel();
            }}>
            {t("cancel")}
          </Button>
          {data.status === "approvedLevel1" && (
            <Button
              variant="filled"
              color="red"
              onClick={() => {
                handleRevokeApprove();
              }}>
              {t("revoke")}
            </Button>
          )}
          <Button
            variant="filled"
            color="green"
            onClick={() => {
              handleApprove();
            }}>
            {t("approve")}
          </Button>
        </Group>
      );
    } else if (
      isValidRole(userRole, [
        AppointmentRole.Admin,
        AppointmentRole.Moderator,
        AppointmentRole.ApproveLevel1,
        AppointmentRole.ApproveLevel2,
        AppointmentRole.Participant
      ]) &&
      data.status === "inProgress"
    ) {
      return (
        <Group justify="center" mt="xl">
          <Button
            variant="filled"
            color="green"
            disabled={
              !isAppAdmin &&
              appointmentData.participant?.find((mem) => mem.accountId === user?.id)?.status !== "Accepted"
            }
            onClick={() => {
              handleStartMeeting();
            }}>
            {roomStatus
              ? t("joinConsultation")
              : isAppointmentAdmin || isAppAdmin
                ? t("startConsultation")
                : t("joinConsultation")}
          </Button>
          {(isAppointmentAdmin || isAppAdmin) && appointmentData.status === "inProgress" && (
            <Button
              variant="filled"
              color="red"
              onClick={() => {
                handleEndMeeting();
              }}>
              {t("endConsultation")}
            </Button>
          )}
        </Group>
      );
    } else return "";
  };

  useEffect(() => {
    const status = data.status;
    if (status === "proposed") setActive(1);
    if (status === "fulfilled") setActive(4);
    if (status === "inProgress") setActive(3);
    if (status === "cancelled") setActive(1);
    if (status === "approvedLevel1") setActive(2);
    if (status === "approvedLevel2") setActive(3);
  }, [data]);

  useEffect(() => {
    const isRoomActive = async () => {
      const isRoomActiveReq = {
        room_id: appointmentData.id
      };
      const res = await sendRequest(isRoomActiveReq, "room/isRoomActive", notify, Variant);
      if (res.status === true) setRoomStatus(res.is_active);
    };
    isRoomActive();
  }, []);

  useEffect(() => {
    setData(appointmentData);
  }, [appointmentData]);

  return (
    <>
      <Stepper iconSize={32} active={active}>
        <Stepper.Step
          color={data.status === "cancelled" ? "red" : "green"}
          completedIcon={data.status === "cancelled" && <IconCircleX size={20} />}
          label={t(`appointment.${data.status === "cancelled" ? "cancelled" : "proposed"}.label`)}
          description={t(
            `appointment.${data.status === "cancelled" ? "cancelled" : "proposed"}.description`
          )}></Stepper.Step>
        <Stepper.Step
          color="green"
          label={t("appointment.approvedLevel1.label")}
          description={t("appointment.approvedLevel1.description")}></Stepper.Step>
        <Stepper.Step
          color="green"
          label={t("appointment.approvedLevel2.label")}
          description={t("appointment.approvedLevel2.description")}></Stepper.Step>
        {renderFinalStep()}
      </Stepper>
      {renderApprovalButton()}
    </>
  );
};

export default AppointmentStatus;
