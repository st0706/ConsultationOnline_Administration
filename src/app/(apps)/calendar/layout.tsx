"use client";

import { AppMain } from "@/components/layout";
import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return <AppMain>{children}</AppMain>;
}
