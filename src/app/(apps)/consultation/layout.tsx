"use client";

import { useAuthStore } from "@/components/auth/AuthContext";
import { AppMain } from "@/components/layout";
import { TLinkList } from "@/components/layout/Navigation";
import { useTranslation } from "@/i18n";
import { isValidRole } from "@/lib/common";
import { AppointmentRole } from "@/types/enums";
import { IconBuildingSkyscraper, IconCalendarClock, IconMap2, IconUser, IconUsers } from "@tabler/icons-react";
import { PropsWithChildren } from "react";
import { CONSULTATION_PATHS } from "../apps";

export default function AppLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation("consultation");
  const { t: tS } = useTranslation("system");

  const userRole = useAuthStore()((state) => state.authUser?.session?.access_token?.user_role);

  const links: TLinkList = [
    {
      label: t("appointment.name"),
      icon: IconCalendarClock,
      isValidRole: true,
      url: CONSULTATION_PATHS.appointment
    },
    {
      title: t("categories"),
      links: [
        {
          label: t("account"),
          icon: IconUser,
          isValidRole: isValidRole(userRole, [AppointmentRole.Admin]),
          url: CONSULTATION_PATHS.account
        },
        {
          label: t("staff"),
          icon: IconUsers,
          isValidRole: isValidRole(userRole, [AppointmentRole.Admin]),
          url: CONSULTATION_PATHS.staff
        },
        {
          label: tS("resource.organization"),
          icon: IconBuildingSkyscraper,
          isValidRole: isValidRole(userRole, [AppointmentRole.Admin]),
          url: CONSULTATION_PATHS.organization
        },
        {
          label: tS("adDivision.name"),
          icon: IconMap2,
          isValidRole: isValidRole(userRole, [AppointmentRole.Admin]),
          url: CONSULTATION_PATHS.adDivision
        }
      ]
    }
  ];

  return <AppMain links={links}>{children}</AppMain>;
}
