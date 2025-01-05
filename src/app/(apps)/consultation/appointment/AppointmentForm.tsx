"use client";
import {
  AddressInput,
  DEFAULT_ADDRESS,
  DEFAULT_APPOINTMENT_SUBJECT,
  DEFAULT_CODEABLE_CONCEPT,
  DEFAULT_CODEABLEREFERENCE,
  DEFAULT_NOTE,
  DEFAULT_REASON,
  HumanNameDisplay,
  ResourceArrayInput
} from "@/components/FHIR";
import { FormGroup } from "@/components/form";
import FormActions from "@/components/form/FormActions";
import useModal from "@/hooks/useModal";
import { useTranslation } from "@/i18n";
import {
  Autocomplete,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Input,
  List,
  LoadingOverlay,
  Select,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
  Title
} from "@mantine/core";
import { DateInput, DateTimePicker } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconUsersPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import ParticipantForm from "./ParticipantForm";
import { ethnicMinority } from "@/types";
import { api } from "@/trpc/react";

interface Props {
  AppointmentData?: any;
  isLoading?: boolean;
  onSubmit: (values: any) => void;
  isSubmitting?: boolean;
  onClose?: () => void;
}

const AppointmentForm: FC<Props> = ({ AppointmentData, isLoading, onSubmit, isSubmitting, onClose }) => {
  const { t } = useTranslation("consultation");
  const { t: tH } = useTranslation("hrm");
  const { t: tF } = useTranslation("fhir");
  const router = useRouter();
  const { actionForm } = useModal();

  const appointmentStatus = [
    { value: "proposed", label: t("appointment.status.proposed") },
    { value: "approvedLevel1", label: t("appointment.status.approvedLevel1") },
    { value: "approvedLevel2", label: t("appointment.status.approvedLevel2") },
    { value: "inProgress", label: t("appointment.status.inProgress") },
    { value: "fulfilled", label: t("appointment.status.fulfilled") },
    { value: "cancelled", label: t("appointment.status.cancelled") }
  ];
  const appointmentType = [
    { value: "routine", label: t("appointment.appointmentType.routine") },
    { value: "walkin", label: t("appointment.appointmentType.walkin") },
    { value: "checkup", label: t("appointment.appointmentType.checkup") },
    { value: "followup", label: t("appointment.appointmentType.followup") },
    { value: "emergency", label: t("appointment.appointmentType.emergency") }
  ];
  const appointmentPriority = [
    { value: "ASAP", label: t("appointment.priority.ASAP") },
    { value: "callback", label: t("appointment.priority.callback") },
    { value: "elective", label: t("appointment.priority.elective") },
    { value: "emergency", label: t("appointment.priority.emergency") },
    { value: "preop", label: t("appointment.priority.preop") },
    { value: "needed", label: t("appointment.priority.needed") },
    { value: "routine", label: t("appointment.priority.routine") },
    { value: "rushReporting", label: t("appointment.priority.rushReporting") },
    { value: "timingCritical", label: t("appointment.priority.timingCritical") },
    { value: "directed", label: t("appointment.priority.directed") },
    { value: "urgent", label: t("appointment.priority.urgent") },
    { value: "scheduling", label: t("appointment.priority.scheduling") },
    { value: "CSR", label: t("appointment.priority.CSR") }
  ];

  const [addressCitySelected, setAddressCitySelected] = useState<string>("");
  const [addressDistrictSelected, setAddressDistrictSelected] = useState<string>("");

  const { data: allCities } = api.adDivision.getAllCities.useQuery();
  const { data: allAddressDistricts } = api.adDivision.getAllDistricts.useQuery({
    cityName: addressCitySelected
  });
  const { data: allAddressWards } = api.adDivision.getAllWards.useQuery({
    cityName: addressCitySelected,
    districtName: addressDistrictSelected
  });

  const form = useForm({
    initialValues: AppointmentData
      ? {
          ...AppointmentData,
          subject: {
            ...AppointmentData.subject,
            birthDate: AppointmentData.subject.birthDate
              ? new Date(Number(AppointmentData.subject.birthDate))
              : undefined,
            admissionTime: AppointmentData.subject.admissionTime
              ? new Date(Number(AppointmentData.subject.admissionTime))
              : undefined
          },
          start: AppointmentData.start ? new Date(Number(AppointmentData.start)) : undefined,
          end: AppointmentData.end ? new Date(Number(AppointmentData.end)) : undefined,
          created: AppointmentData.created ? new Date(Number(AppointmentData.created)) : undefined
        }
      : {
          appointmentType: DEFAULT_CODEABLE_CONCEPT,
          cancellationDate: undefined,
          created: undefined,
          description: "",
          end: undefined,
          name: "",
          note: [DEFAULT_NOTE],
          participant: [],
          priority: DEFAULT_CODEABLE_CONCEPT,
          reason: [DEFAULT_REASON],
          specialty: [DEFAULT_CODEABLE_CONCEPT],
          start: new Date(),
          status: undefined,
          subject: DEFAULT_APPOINTMENT_SUBJECT
        },
    validate: {
      status: isNotEmpty(t("message.required", { name: t("appointment.status.name") })),
      participant: (value) =>
        value.length > 0 ? null : t("message.required", { name: t("appointment.participant.actor") }),
      start: isNotEmpty(t("message.required", { name: t("appointment.start") })),
      end: (value) => {
        if (!value) return null;
        if (form.values.start && value <= form.values.start) {
          return t("noticeTime");
        }
        return null;
      }
    },
    validateInputOnChange: true
  });

  useEffect(() => {
    if (form.getInputProps("subject").value.address) {
      setAddressCitySelected(form.getInputProps("subject").value.address.city || "");
      setAddressDistrictSelected(form.getInputProps("subject").value.address.district || "");
    }
  }, [form.getInputProps("subject").value.address]);

  return (
    <>
      <LoadingOverlay style={{ position: "fixed" }} visible={isLoading} />
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <FormGroup label={t("appointment.content")} />
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput withAsterisk label={t("appointment.nameLabel")} {...form.getInputProps("name")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label={t("appointment.status.name")}
                data={appointmentStatus}
                searchable
                required
                {...form.getInputProps("status")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label={t("appointment.appointmentType.name")}
                data={appointmentType}
                searchable
                value={form.values?.appointmentType?.text}
                onChange={(value) => {
                  let appointmentType = { ...DEFAULT_CODEABLE_CONCEPT };
                  appointmentType.text = value?.toString();
                  form.setFieldValue(`appointmentType`, value ? appointmentType : undefined);
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TagsInput
                label={t("appointment.specialty")}
                placeholder={t("action.pressEnterToAdd")}
                value={
                  form.getInputProps("specialty").value.at(0).text === ""
                    ? undefined
                    : form.getInputProps("specialty").value?.map((x) => x?.text)
                }
                onChange={(values) => {
                  form.setFieldValue(
                    `specialty`,
                    values.map((value) => {
                      let code = { ...DEFAULT_CODEABLE_CONCEPT };
                      code.text = value;
                      return code;
                    })
                  );
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                label={t("appointment.priority.name")}
                data={appointmentPriority}
                searchable
                value={form.values?.priority?.text}
                onChange={(value) => {
                  let priority = { ...DEFAULT_CODEABLE_CONCEPT };
                  priority.text = value?.toString();
                  form.setFieldValue(`priority`, value ? priority : undefined);
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <DateTimePicker
                clearable
                required
                withAsterisk
                label={t("appointment.start")}
                {...form.getInputProps("start")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <DateTimePicker clearable label={t("appointment.end")} {...form.getInputProps("end")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TagsInput
                label={t("appointment.reason.name")}
                placeholder={t("action.pressEnterToAdd")}
                value={
                  form.getInputProps(`reason.0.concept.text`).value === ""
                    ? undefined
                    : form.getInputProps("reason").value?.map((x) => x?.concept?.text)
                }
                onChange={(values) => {
                  form.setFieldValue(
                    `reason`,
                    values.map((value) => {
                      let code = { ...DEFAULT_CODEABLE_CONCEPT };
                      code.text = value;
                      let reason = { ...DEFAULT_CODEABLEREFERENCE };
                      reason.concept = code;
                      return reason;
                    })
                  );
                }}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea label={t("appointment.description")} {...form.getInputProps("description")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea label={t("appointment.note")} {...form.getInputProps("note.0.text")} />
            </Grid.Col>
          </Grid>
          <FormGroup label={t("appointment.participant.name")} />
          <Input.Error fz={20}>{form.getInputProps("participant").error}</Input.Error>
          <Group justify="start">
            <Button
              variant="subtle"
              onClick={() =>
                actionForm(
                  "add-participant",
                  t("appointment.participant.name"),
                  ParticipantForm,
                  false,
                  async (values) => {
                    modals.close("add-participant");
                  },
                  undefined,
                  "80%",
                  [],
                  false,
                  form,
                  "participant"
                )
              }
              leftSection={<IconUsersPlus />}>
              {tH("addMember")}
            </Button>
          </Group>
          <List>
            {form.values.participant?.map((value, index) => {
              return (
                <List.Item key={`participant-${index}`}>
                  <Group>
                    {<HumanNameDisplay name={value.name} />}
                    {`- ${tH("profile.mainInformation.staffId")} : ${value.staffId || "\u00A0\u00A0\u00A0\u00A0"}`}{" "}
                    {`- ${t(`appointment.participant.type.${value.type.at(0).text}`)}`}
                  </Group>
                </List.Item>
              );
            })}
          </List>
          <FormGroup label={t("appointment.consultationContent")} />
          <Title order={4}>{t("appointment.administrativeSection")}</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput w={"100%"} label={t("appointment.subject.name")} {...form.getInputProps("subject.name")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <DateInput
                label={t("appointment.subject.birthDate")}
                valueFormat="l"
                {...form.getInputProps("subject.birthDate")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label={t("appointment.subject.gender")}
                {...form.getInputProps("subject.gender")}
                data={[
                  { label: tH("gender.male"), value: "male" },
                  { label: tH("gender.female"), value: "female" },
                  { label: tH("gender.other"), value: "other" },
                  { label: tH("gender.unknown"), value: "unknown" }
                ]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                searchable
                label={t("appointment.subject.ethnic")}
                data={ethnicMinority}
                {...form.getInputProps("subject.ethnic")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput label={t("appointment.subject.nationality")} {...form.getInputProps("subject.nationality")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput label={t("appointment.subject.occupation")} {...form.getInputProps("subject.occupation")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Autocomplete
                data={allCities}
                label={tF("address.province")}
                {...form.getInputProps(`subject.address.city`)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Autocomplete
                data={allAddressDistricts}
                label={tF("address.district")}
                {...form.getInputProps(`subject.address.district`)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Autocomplete
                data={allAddressWards}
                label={tF("address.ward")}
                {...form.getInputProps(`subject.address.ward`)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput label={tF("address.details")} {...form.getInputProps(`subject.address.details`)} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label={t("appointment.subject.admissionNumber")}
                {...form.getInputProps("subject.admissionNumber")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label={t("appointment.subject.insuranceNumber")}
                {...form.getInputProps("subject.insuranceNumber")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <DateTimePicker
                label={t("appointment.subject.admissionTime")}
                {...form.getInputProps("subject.admissionTime")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label={t("appointment.subject.admissionDepartment")}
                {...form.getInputProps("subject.admissionDepartment")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label={t("appointment.subject.requestConsultation")}
                {...form.getInputProps("subject.requestConsultation")}
              />
            </Grid.Col>
          </Grid>
          <Title order={4}>{t("appointment.diseaseProgression")}</Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea
                autosize
                minRows={2}
                label={t("appointment.subject.summaryMedicalHistory")}
                {...form.getInputProps("subject.summaryMedicalHistory")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea
                autosize
                minRows={2}
                label={t("appointment.subject.conditionAdmission")}
                {...form.getInputProps("subject.conditionAdmission")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea
                autosize
                minRows={2}
                label={t("appointment.subject.diagnose")}
                {...form.getInputProps("subject.diagnose")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea
                autosize
                minRows={2}
                label={t("appointment.subject.summary")}
                {...form.getInputProps("subject.summary")}
              />
            </Grid.Col>
          </Grid>
          <Center pt={"xs"}>
            <FormActions
              centered
              isNew={!AppointmentData || !AppointmentData.id}
              isSubmitting={isSubmitting}
              canSubmit={form.isDirty() && form.isValid()}
              onClose={() => router.back()}
            />
          </Center>
        </Stack>
      </form>
    </>
  );
};
export default AppointmentForm;
