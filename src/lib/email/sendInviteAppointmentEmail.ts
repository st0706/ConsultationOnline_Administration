import { sendEmail } from "./sendEmail";
import AppointmentInvite from "@/components/email/AppointmentInvite";
import { render } from "@react-email/components";
import { getBaseUrl } from "../helpers";

export const sendInviteAppointmentEmail = async ({ email, appointmentId }) => {
  const appUrl = getBaseUrl();
  const invitationLink = `${appUrl}/consultation/appointment/${appointmentId}/detail?appointmentId=${appointmentId}`;
  const html = render(AppointmentInvite({ invitationLink }));

  await sendEmail({
    to: email,
    subject: "Lời mời tham dự hội chẩn",
    html
  });
};
