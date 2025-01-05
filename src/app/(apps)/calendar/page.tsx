"use client";

import { PageHeader } from "@/components/layout";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { CalendarEvent } from "@/types";
import viLocale from "@fullcalendar/core/locales/vi";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Flex, Paper, Stack, Switch } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import CalendarEventForm from "./EventForm";
import "./page.css";

export interface Events {
  title: string;
  start: string;
  end: string;
  description?: string | null;
  calendarEvent: any;
}

const StaffsCalendar = () => {
  const { t, i18n } = useTranslation("calendar");
  const [weekendsVisible, setWeekendsVisible] = useState(true);

  const { data } = api.appointment.getCalendar.useQuery();

  let events: Events[] = [];

  const formatBigIntToDateString = (bigintValue: number) => {
    const dateValue = Number(bigintValue);
    const dateObject = new Date(dateValue);
    const dateString = dateObject.toISOString();

    return dateString;
  };

  if (data) {
    events = data.map((item) => ({
      title: item.name!,
      start: formatBigIntToDateString(item.start!),
      end: item.end ? formatBigIntToDateString(item.end) : formatBigIntToDateString(item.start! + 3600000),
      description: item.description,
      calendarEvent: item
    }));
  }

  const handleUpdate = (data?: CalendarEvent) => {
    modals.open({
      modalId: "updateCal",
      title: t("view"),
      centered: true,
      children: <CalendarEventForm data={data} onClose={() => modals.close("updateCal")} />
    });
  };

  return (
    <Stack>
      <PageHeader
        title={t("calendar")}
        actions={
          <Flex align="center" gap="md">
            <Switch
              checked={weekendsVisible}
              onChange={(event) => setWeekendsVisible(event.currentTarget.checked)}
              label={t("showWeekends")}
            />
          </Flex>
        }
      />
      <Paper p="md" shadow="md" radius="md">
        <FullCalendar
          locale={i18n.language === "vi" ? viLocale : undefined}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={events}
          eventClick={(arg) => handleUpdate(arg.event._def.extendedProps.calendarEvent as CalendarEvent)}
          eventContent={(arg) => {
            return {
              html: `<div>
                <strong>${arg.event._def.title}</strong>
              </div>`
            };
          }}
        />
      </Paper>
    </Stack>
  );
};

export default StaffsCalendar;
