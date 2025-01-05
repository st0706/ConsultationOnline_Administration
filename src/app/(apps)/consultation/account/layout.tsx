"use client";

import ErrorPage from "@/app/error";
import { useAuthStore } from "@/components/auth/AuthContext";
import { useTranslation } from "@/i18n";
import { isValidRole } from "@/lib/common";
import { AppointmentRole } from "@/types/enums";
import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  const { t } = useTranslation("consultation");
  const userRole = useAuthStore()((state) => state.authUser?.session?.access_token?.user_role);

  if (!isValidRole(userRole, [AppointmentRole.Admin])) {
    return <ErrorPage error={new Error(t("FORBIDDEN"))} />;
  }

  return <>{children}</>;
}
