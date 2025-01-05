"use client";

import { StatusBadge } from "@/components/common";
import { PageHeader } from "@/components/layout";
import { useCustomSimpleTable } from "@/hooks/useCustomTable";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { currentAddress, findIdentifierByType, getOfficialName, slugify } from "@/lib/common";
import { localeDate } from "@/lib/datetime";
import { api } from "@/trpc/react";
import { FileInfo } from "@/types";
import { LineChart } from "@mantine/charts";
import {
  Anchor,
  Button,
  Center,
  Divider,
  Drawer,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  PaperProps,
  Stack,
  Tabs,
  Text,
  Title
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconBook,
  IconBriefcase,
  IconCalendarWeek,
  IconCertificate,
  IconCirclePlus,
  IconFlag,
  IconMail,
  IconPhone,
  IconPlane,
  IconQrcode,
  IconShieldCheck,
  IconUserCheck
} from "@tabler/icons-react";
import { HumanName } from "fhir/r5";
import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import StaffProfileCard from "./StaffProfileCard";

const ICON_SIZE = 16;

const PAPER_PROPS: PaperProps = {
  p: "md",
  style: { height: "100%" }
};

interface ChartData {
  salary: number | null;
  date: number;
}

const Profile = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { t, i18n } = useTranslation("hrm");
  const params = useParams();
  const staffId = params.staffId as string;
  const isMobile = useMediaQuery(`(max-width: 62em)`);

  const { data: staffData, isLoading: isLoadingStaffData } = api.practitioner.getByStaffId.useQuery(staffId);
  const { data: organizationList, isLoading: isLoadingOrganizationsList } = api.organization.getSelectList.useQuery();

  const officialName = staffData?.name ? getOfficialName(staffData.name as HumanName[]) : "";
  const currentContact = (data, system) => {
    return data?.telecom?.find((tel) => tel.system === system)?.value;
  };

  const findAssginer = (type) => {
    return organizationList?.find(
      (organization) => organization.value === findIdentifierByType(staffData?.identifier, type)?.assigner?.id
    )?.label;
  };

  return (
    <>
      <LoadingOverlay style={{ position: "fixed" }} visible={isLoadingStaffData || isLoadingOrganizationsList} />
      <Drawer size="xl" opened={opened} onClose={close}></Drawer>
      <PageHeader mb="lg" title={t("profile.title")} breadcrumbs={[t("profile.name")]} />
      <Grid gutter={{ base: "md", md: "lg", xl: 24 }}>
        <Tabs w={"100%"} defaultValue="general" orientation={isMobile ? "horizontal" : "vertical"}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack>
              <StaffProfileCard
                name={officialName}
                avatarUrl={(staffData?.photo as any[])?.at(0).url}
                {...PAPER_PROPS}
              />
              <Paper {...PAPER_PROPS}>
                <Stack>
                  <Group>
                    <IconQrcode size={ICON_SIZE} />
                    <Text>{staffData?.staffId}</Text>
                  </Group>
                  {currentContact(staffData, "email") && (
                    <Group>
                      <IconMail size={ICON_SIZE} />
                      <Text>{currentContact(staffData, "email")}</Text>
                    </Group>
                  )}
                  {currentContact(staffData, "phone") && (
                    <Group>
                      <IconPhone size={ICON_SIZE} />
                      <Text>{currentContact(staffData, "phone")}</Text>
                    </Group>
                  )}
                </Stack>
              </Paper>
              <Paper {...PAPER_PROPS}>
                <Tabs.List>
                  <Tabs.Tab value="general">
                    <Group>
                      <IconUserCheck size={24} />
                      <Text>{t("profile.personalInformation.title")}</Text>
                    </Group>
                  </Tabs.Tab>
                  <Tabs.Tab value="jobInfo">
                    <Group>
                      <IconFlag size={24} />
                      <Text>{t("profile.jobInformation.title1")}</Text>
                    </Group>
                  </Tabs.Tab>
                  <Tabs.Tab value="certification">
                    <Group>
                      <IconCertificate size={24} />
                      <Text>{t("profile.certification.title")}</Text>
                    </Group>
                  </Tabs.Tab>
                  <Tabs.Tab value="discipline">
                    <Group>
                      <IconShieldCheck size={24} />
                      <Text>{t("profile.discipline.title")}</Text>
                    </Group>
                  </Tabs.Tab>
                  <Tabs.Tab value="workSchedule-leave">
                    <Group>
                      <IconCalendarWeek size={24} />
                      <Text>{t("profile.workScheduleAndLeave.title")}</Text>
                    </Group>
                  </Tabs.Tab>
                  <Tabs.Tab value="trainingProcess">
                    <Group>
                      <IconBook size={24} />
                      <Text>{t("profile.trainingProcess.title")}</Text>
                    </Group>
                  </Tabs.Tab>
                  <Tabs.Tab value="travelProcess">
                    <Group>
                      <IconPlane size={24} />
                      <Text>{t("profile.travelProcess.title")}</Text>
                    </Group>
                  </Tabs.Tab>
                </Tabs.List>
              </Paper>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper {...PAPER_PROPS}>
              <Tabs.Panel value="general">
                <Title c={"green"} order={3}>
                  {t("profile.personalInformation.title")}
                </Title>
                <Text c={"gray"} size="sm">
                  {t("profile.personalInformation.description")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}>{t("profile.mainInformation.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.mainInformation.description")}
                </Text>
                <Divider my={"md"} variant="dotted" />
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.fullName")}</Text>
                    <Text fw={500}>{officialName}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.staffId")}</Text>
                    <Text fw={500}>{staffData?.staffId}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.startDate")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.officialDate")}</Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.status.title")}</Text>
                    {staffData?.active ? (
                      <Text c={"green"} fw={500}>
                        {t("profile.mainInformation.status.working")}
                      </Text>
                    ) : (
                      <Text c={"red"} fw={500}>
                        {t("profile.mainInformation.status.leave")}
                      </Text>
                    )}
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}> {t("profile.mainInformation.currentContract")}</Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.phone")}</Text>
                    <Text fw={500}>
                      {currentContact(staffData, "phone") ? currentContact(staffData, "phone") : "---"}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.position")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.dOB")}</Text>
                    <Text fw={500}>{staffData?.birthDate ? localeDate(staffData?.birthDate) : "---"}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Email</Text>
                    <Text fw={500}>
                      {" "}
                      {currentContact(staffData, "email") ? currentContact(staffData, "email") : "---"}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.gender")}</Text>
                    <Text fw={500}>{staffData?.gender ? t(`relatedPerson.gender.${staffData?.gender}`) : "---"}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.maritalStatus")}</Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.office")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.workSchedule")}</Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.culturalLevel")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("workingProcess.workingForm.name")}</Text>
                  </Grid.Col>
                </Grid>

                <Divider mt={"md"} mb={"xl"} size={"md"} />

                <Title order={4}>{t("profile.taxes-insurance.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.taxes-insurance.description")}
                </Text>

                <Divider my={"md"} variant="dotted" />
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Text c={"gray"}>{t("profile.taxes-insurance.taxId")}</Text>
                    <Text fw={500}>{findIdentifierByType(staffData?.identifier, "TAX")?.value}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.taxes-insurance.deductionTax")}</Text>
                    <Text fw={500}></Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.taxes-insurance.policyTax")}</Text>
                    <Text fw={500}></Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Text c={"gray"}>{t("profile.taxes-insurance.SINumber")}</Text>
                    <Text fw={500}>{findIdentifierByType(staffData?.identifier, "SI")?.value}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.taxes-insurance.SIRegistrationPlace")}</Text>
                    <Text fw={500}>{findAssginer("SI")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.taxes-insurance.SIPolicy")}</Text>
                    <Text fw={500}></Text>
                  </Grid.Col>
                </Grid>

                <Divider mt={"md"} mb={"xl"} size={"md"} />

                <Title order={4}>{t("profile.additionalInformation.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.additionalInformation.description")}
                </Text>

                <Divider my={"md"} variant="dotted" />
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.currentAddress")}</Text>
                    <Text fw={500}>{currentAddress(staffData?.address, "home")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.pOB")}</Text>
                    <Text fw={500}></Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.permanentResidence")}</Text>
                    <Text fw={500}>{currentAddress(staffData?.address, "permanentResidence")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 12 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.nationality")}</Text>
                    <Text fw={500}>{staffData?.nationality}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.CI")}</Text>
                    <Text fw={500}>{findIdentifierByType(staffData?.identifier, "CI")?.value}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.issueDate")}</Text>
                    <Text fw={500}>
                      {findIdentifierByType(staffData?.identifier, "CI") &&
                        localeDate(findIdentifierByType(staffData?.identifier, "CI")?.period.start)}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.issuePlace")}</Text>
                    <Text fw={500}>{findAssginer("CI")}</Text>
                  </Grid.Col>
                </Grid>
                <Divider my={"md"} variant="dotted" />
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.DL")}</Text>
                    <Text fw={500}>{findIdentifierByType(staffData?.identifier, "DL")?.value}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.issueDate")}</Text>
                    <Text fw={500}>
                      {findIdentifierByType(staffData?.identifier, "DL") &&
                        localeDate(findIdentifierByType(staffData?.identifier, "DL")?.period.start)}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.issuePlace")}</Text>
                    <Text fw={500}>{findAssginer("DL")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.PPN")}</Text>
                    <Text fw={500}>{findIdentifierByType(staffData?.identifier, "PPN")?.value}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.issueDate")}</Text>
                    <Text fw={500}>
                      {findIdentifierByType(staffData?.identifier, "PPN")?.period.start &&
                        localeDate(findIdentifierByType(staffData?.identifier, "PPN")?.period.start)}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.additionalInformation.issuePlace")}</Text>
                    <Text fw={500}>{findAssginer("PPN")}</Text>
                  </Grid.Col>
                </Grid>

                <Divider mt={"md"} mb={"xl"} size={"md"} />

                <Title order={4}>{t("profile.bankAccount.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.bankAccount.description")}
                </Text>

                <Divider my={"md"} variant="dotted" />
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.bankAccount.BANumber")}</Text>
                    <Text fw={500}>{findIdentifierByType(staffData?.identifier, "BA")?.value}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.bankAccount.BAName")}</Text>
                    <Text fw={500}>
                      {findIdentifierByType(staffData?.identifier, "BA") && officialName?.toLocaleUpperCase()}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Text c={"gray"}>{t("profile.bankAccount.BAPlace")}</Text>
                    <Text fw={500}>{findAssginer("BA")}</Text>
                  </Grid.Col>
                </Grid>

                <Divider mt={"md"} mb={"xl"} size={"md"} />

                <Title order={4}>{t("profile.educationInformation.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.educationInformation.description")}
                </Text>

                <Divider mt={"md"} mb={"xl"} size={"md"} />

                <Title order={4}>{t("profile.workHistory.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.workHistory.description")}
                </Text>

                <Divider mt={"md"} mb={"xl"} size={"md"} />

                <Title order={4}>{t("profile.relatedPerson.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.relatedPerson.description")}
                </Text>

                <Divider mt={"md"} mb={"xl"} size={"md"} />

                <Title order={4}>{t("profile.jobApplication.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.jobApplication.description")}
                </Text>

                <Divider my={"md"} variant="dotted" />
              </Tabs.Panel>

              <Tabs.Panel value="jobInfo">
                <Title c={"green"} order={3}>
                  {t("profile.jobInformation.title2")}
                </Title>
                <Text c={"gray"} size="sm">
                  {t("profile.jobInformation.description1")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                {t("profile.jobInformation.title1")}
                <Title order={4}></Title>
                <Text c={"gray"} size="sm">
                  {t("profile.jobInformation.description2")}
                </Text>
                <Divider my={"md"} variant="dotted" />
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Text c={"gray"}>{t("profile.jobInformation.position")}</Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.jobInformation.salary")}</Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.jobInformation.baseSalary")}</Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.office")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.workSchedule")}</Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.position")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.startDate")}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.mainInformation.officialDate")}</Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("profile.jobInformation.policySalary")}</Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>{t("workingProcess.workingForm.name")}</Text>
                  </Grid.Col>
                </Grid>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}>{t("profile.jobInformation.CareereDevelopment.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.jobInformation.CareereDevelopment.description")}
                </Text>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 9 }}>
                    <Center>
                      <Text mb="md">{t("profile.jobInformation.CareereDevelopment.salaryProcess.title")}</Text>
                    </Center>
                    <Center>
                      <Text my={"lg"} c={"gray"} size="sm">
                        {t("profile.jobInformation.CareereDevelopment.salaryProcess.noDataDescription")}
                      </Text>
                    </Center>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 0.5 }}>
                    <Divider size={"md"} h={"100%"} w={"100%"} orientation={isMobile ? "horizontal" : "vertical"} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 2.5 }}>
                    <Text c={"gray"}>
                      {t("profile.jobInformation.CareereDevelopment.salaryProcess.salaryRecruitment")}
                    </Text>
                    <Divider my={"md"} variant="dashed" />
                    <Text c={"gray"}>{t("profile.jobInformation.CareereDevelopment.salaryProcess.currentSalary")}</Text>
                    <Divider my={"md"} variant="dashed" />
                    <Text c={"gray"}>{t("profile.jobInformation.CareereDevelopment.salaryProcess.workingDays")}</Text>
                    <Divider my={"md"} variant="dashed" />
                    <Text c={"gray"}>
                      {t("profile.jobInformation.CareereDevelopment.salaryProcess.careerDevelopment")}
                    </Text>
                    <Text fw={500}>---</Text>
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="certification">
                <Title c={"green"} order={3}>
                  {t("profile.certification.title")}
                </Title>
                <Text c={"gray"} size="sm">
                  {t("profile.certification.description")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}>{t("profile.certification.prize.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.certification.prize.description")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}>{t("profile.certification.certificate.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.certification.certificate.description")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}>{t("profile.certification.milestones.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.certification.milestones.description")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}> {t("profile.certification.acknowledge.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.certification.acknowledge.description")}
                </Text>
              </Tabs.Panel>

              <Tabs.Panel value="discipline">
                <Title c={"green"} order={3}>
                  {t("profile.discipline.title")}
                </Title>
                <Text c={"gray"} size="sm">
                  {t("profile.discipline.description")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
              </Tabs.Panel>

              <Tabs.Panel value="workSchedule-leave">
                <Title c={"green"} order={3}>
                  {t("profile.workScheduleAndLeave.title")}
                </Title>
                <Text c={"gray"} size="sm">
                  {t("profile.workScheduleAndLeave.description")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}>{t("profile.workScheduleAndLeave.checkIn.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.workScheduleAndLeave.checkIn.description")}
                </Text>

                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}> {t("profile.workScheduleAndLeave.workSchedule.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.workScheduleAndLeave.workSchedule.description")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}>{t("profile.workScheduleAndLeave.leave.title")}</Title>
                <Text c={"gray"} size="sm">
                  {t("profile.workScheduleAndLeave.leave.description")}
                </Text>
              </Tabs.Panel>

              <Tabs.Panel value="trainingProcess">
                <Title c={"green"} order={3}>
                  {t("profile.trainingProcess.title")}
                </Title>
                <Text c={"gray"} size="sm">
                  {t("profile.trainingProcess.description")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
              </Tabs.Panel>

              <Tabs.Panel value="travelProcess">
                <Title c={"green"} order={3}>
                  {t("profile.travelProcess.title")}
                </Title>
                <Text c={"gray"} size="sm">
                  {t("profile.travelProcess.description")}
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
              </Tabs.Panel>
            </Paper>
          </Grid.Col>
        </Tabs>
      </Grid>
    </>
  );
};

export default Profile;
