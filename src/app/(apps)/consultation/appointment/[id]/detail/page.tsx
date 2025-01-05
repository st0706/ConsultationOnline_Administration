"use client";
import { PageHeader } from "@/components/layout";
import { useTranslation } from "@/i18n";
import { Paper, Tabs } from "@mantine/core";
import { useState } from "react";
import ConclusionTab from "./ConclusionTab";
import DetailAppointment from "./DetailAppointment";
import RecordTab from "./RecordTab";

const DetailPage = () => {
  const { t } = useTranslation("consultation");
  const [activeTab, setActiveTab] = useState<string | null>("generalInformation");
  const APPOINTMENT = t("appointment.name");

  return (
    <Paper p={{ base: "md", md: "lg", xl: 24 }}>
      <PageHeader mb="10" title={`${t("viewDetails")} ${APPOINTMENT.toLowerCase()}`} breadcrumbs={[APPOINTMENT]} />
      <Tabs value={activeTab} onChange={setActiveTab} keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="generalInformation">{t("generalInformation")}</Tabs.Tab>
          <Tabs.Tab value="record">{t("record")}</Tabs.Tab>
          <Tabs.Tab value="conclusion">{t("appointment.conclusion.name")}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="generalInformation">
          <DetailAppointment />
        </Tabs.Panel>

        <Tabs.Panel value="record">
          <RecordTab />
        </Tabs.Panel>

        <Tabs.Panel value="conclusion">
          <ConclusionTab />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

export default DetailPage;
