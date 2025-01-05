import { useTranslation } from "@/i18n";
import { Button, Grid, GridCol, Stack, TextInput, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconX } from "@tabler/icons-react";
import { FC } from "react";

interface Props {
  data?: any;
  onClose?: () => void;
}

const CalendarEventForm: FC<Props> = ({ data, onClose }) => {
  const { t } = useTranslation("calendar");

  const form = useForm({
    initialValues: {
      ...data,
      start: new Date(Number(data?.start || "0")),
      end: new Date(Number(data?.end || "0"))
    },
    validateInputOnChange: true,
    validate: {
      nameEvent: isNotEmpty(t("message.required", { name: t("event.name") }))
    }
  });

  return (
    <Stack>
      <TextInput disabled data-autofocus label={t("event.name")} {...form.getInputProps("name")} />
      <Grid>
        <GridCol>
          <DateTimePicker disabled label={t("event.periodStart")} {...form.getInputProps("start")} />
        </GridCol>
        <GridCol>
          <DateTimePicker disabled label={t("event.periodEnd")} {...form.getInputProps("end")} />
        </GridCol>
      </Grid>
      <Textarea
        disabled
        label={t("event.description")}
        autosize
        minRows={4}
        maxRows={8}
        {...form.getInputProps("description")}
      />
      <Button variant="light" color="default" onClick={onClose} leftSection={<IconX size={16} />} fw="normal">
        {t("cancel")}
      </Button>
    </Stack>
  );
};

export default CalendarEventForm;
