"use client";

import {
  AddressInput,
  DEFAULT_ADDRESS,
  DEFAULT_CONTACT_POINT,
  DEFAULT_HUMAN_NAME,
  DEFAULT_IDENTIFIER,
  HumanNameInput,
  IdentifierInput,
  ResourceArrayInput,
  TelecomInput
} from "@/components/FHIR";
import { LetterAvatar } from "@/components/common";
import { FormGroup } from "@/components/form";
import FormActions from "@/components/form/FormActions";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { getOfficialName, slugify } from "@/lib/common";
import { api } from "@/trpc/react";
import { createClient } from "@/utils/supabase/client";
import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  FileButton,
  Flex,
  Grid,
  LoadingOverlay,
  MultiSelect,
  Select,
  Stack,
  TextInput
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import SimpleOrganizationForm from "../organization/SimpleOrganizationForm";
import { modals } from "@mantine/modals";
import { IconCirclePlus } from "@tabler/icons-react";
import AccountForm from "../account/AccountForm";
interface Props {
  staffData?: any;
  isLoading?: boolean;
  handleSubmit: (values: any) => void;
}

const buildDate = (input) => {
  return input?.map((value) => {
    return {
      ...value,
      period: {
        start: value.period.start ? new Date(Number(value.period.start)) : undefined,
        end: value.period.end ? new Date(Number(value.period.end)) : undefined
      }
    };
  });
};

const StaffForm: FC<Props> = ({ staffData, isLoading, handleSubmit }) => {
  const supabase = createClient();
  const { t } = useTranslation("hrm");
  const { t: tf } = useTranslation("fhir");
  const { t: ta } = useTranslation("account");
  const router = useRouter();
  const { notifyResult } = useNotify();
  const { actionForm } = useModal();
  const ORGANIZATION = tf("resource.organization");
  const ACCOUNT = ta("account");

  const identifierType = [
    { value: "CI", label: tf("identifier.type.CI") },
    { value: "BA", label: tf("identifier.type.BA") },
    { value: "SI", label: tf("identifier.type.SI") },
    { value: "DL", label: tf("identifier.type.DL") },
    { value: "PPN", label: tf("identifier.type.PPN") },
    { value: "MR", label: tf("identifier.type.MR") },
    { value: "TAX", label: tf("identifier.type.TAX") }
  ];

  const religions = [
    { value: "Nothing", label: t("religion.Nothing") },
    { value: "Protestantism", label: t("religion.Protestantism") },
    { value: "Buddhism", label: t("religion.Buddhism") },
    { value: "Islam", label: t("religion.Islam") },
    { value: "Christianity", label: t("religion.Christianity") }
  ];

  const { data: organizationList, isLoading: isLoadingOrganizationsList } = api.organization.getSelectList.useQuery();
  const { data: accountList, isLoading: isLoadingAccountList } = api.account.getAll.useQuery();

  const form = useForm({
    initialValues: staffData
      ? {
          ...staffData,
          identifier: buildDate(staffData.identifier),
          address: buildDate(staffData.address),
          birthDate: staffData.birthDate ? new Date(Number(staffData.birthDate)) : null,
          organizationIds: staffData.organizationIds ? staffData.organizationIds : []
        }
      : {
          staffId: "",
          nationality: "",
          religion: "",
          speciality: undefined,
          education: undefined,
          gender: undefined,
          organizationIds: [],
          accountId: null,
          active: true,
          photo: [{ url: "" }]
        },
    validate: {
      name: {
        family: isNotEmpty(t("message.required", { name: tf("humanName.family") })),
        given: (value) => {
          return value.length == 0 || (value.length > 0 && value[0] == "")
            ? t("message.required", { name: tf("humanName.given") })
            : null;
        }
      },
      staffId: isNotEmpty(t("message.required", { name: t("staff.staffId") })),
      gender: isNotEmpty(t("message.required", { name: t("staff.dOB") })),
      birthDate: isNotEmpty(t("message.required", { name: t("staff.gender") }))
    },
    validateInputOnChange: true
  });

  return (
    <>
      <LoadingOverlay style={{ position: "fixed" }} visible={isLoadingAccountList || isLoadingOrganizationsList} />
      {organizationList && accountList && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction={{ base: "column-reverse", md: "row" }}>
            <Grid align="flex-start" flex={1}>
              <Grid.Col span={12}>
                <ResourceArrayInput
                  form={form}
                  property="name"
                  propertyDisplayName={t("name")}
                  newValue={DEFAULT_HUMAN_NAME}
                  renderElement={(path, index) => (
                    <HumanNameInput index={index} form={form} path={path} disabledType={index === 0} />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  allowDeselect={staffData ? false : true}
                  data={accountList?.map((acc) => {
                    return {
                      value: acc.id,
                      label: acc.email!
                    };
                  })}
                  label={t("staff.accountId")}
                  {...form.getInputProps("accountId")}
                  rightSectionPointerEvents="visible"
                  rightSection={
                    <ActionIcon
                      onClick={() => {
                        const modalId = "create-account";
                        modals.open({
                          modalId: modalId,
                          title: t("addNewTitle", { object: ACCOUNT }),
                          size: "md",
                          centered: true,
                          closeOnClickOutside: false,
                          children: <AccountForm onClose={() => modals.close(modalId)} data={{ disabledName: true }} />
                        });
                      }}
                      title={tf("resourceArray.add", { name: ACCOUNT })}
                      color="green.6">
                      <IconCirclePlus size="1.25rem" />
                    </ActionIcon>
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label={t("staff.staffId")} required {...form.getInputProps("staffId")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <MultiSelect
                  label={t("manangingOrganization.name")}
                  {...form.getInputProps("organizationIds")}
                  data={organizationList}
                  rightSectionPointerEvents="visible"
                  rightSection={
                    <ActionIcon
                      onClick={() => actionForm("create-simple-organization", ORGANIZATION, SimpleOrganizationForm)}
                      title={tf("resourceArray.add", { name: ORGANIZATION })}
                      color="green.6">
                      <IconCirclePlus size="1.25rem" />
                    </ActionIcon>
                  }
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label={t("staff.gender")}
                  required
                  {...form.getInputProps("gender")}
                  data={[
                    { label: t("gender.male"), value: "male" },
                    { label: t("gender.female"), value: "female" },
                    { label: t("gender.other"), value: "other" },
                    { label: t("gender.unknown"), value: "unknown" }
                  ]}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <DateInput required label={t("staff.dOB")} valueFormat="l" {...form.getInputProps("birthDate")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label={t("staff.speciality")} name="speciality" {...form.getInputProps("speciality")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label={t("staff.education")} name="education" {...form.getInputProps("education")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput label={t("staff.nationality")} name="nationality" {...form.getInputProps("nationality")} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label={t("staff.religion")}
                  name="religion"
                  data={religions}
                  {...form.getInputProps("religion")}
                />
              </Grid.Col>
            </Grid>
            <Stack justify="center" align="center" w={{ base: "100%", md: "25%" }}>
              <LetterAvatar
                url={form.getInputProps("photo").value ? form.getInputProps("photo.0.url").value : null}
                name={getOfficialName(form.values.name)}
                size={120}
              />
              <FileButton
                onChange={async (file) => {
                  if (file) {
                    const { data, error } = await supabase.storage
                      .from("consultation")
                      .upload(`${slugify(file.name)}-${Date.now()}`, file);
                    if (error) notifyResult(Action.Upload, t("image.label"), false, error.message);
                    else {
                      let res = supabase.storage.from("consultation").getPublicUrl(data?.path!);
                      if (res) form.setValues({ photo: [{ url: res.data ? res.data.publicUrl : undefined }] });
                      notifyResult(Action.Upload, t("image.label"), true);
                    }
                  }
                }}
                accept="image/png,image/jpeg">
                {(props) => <Button {...props}>{t("image.uploadAvatar")}</Button>}
              </FileButton>
              <Checkbox defaultChecked label={t("active")} {...form.getInputProps("active")} />
            </Stack>
          </Flex>
          <Stack>
            <FormGroup label={t("resource.identifier")} mt="lg" />
            <ResourceArrayInput
              form={form}
              property="identifier"
              propertyDisplayName={t("resource.identifier")}
              newValue={DEFAULT_IDENTIFIER}
              renderElement={(path) => (
                <IdentifierInput form={form} path={path} showPeriodStart showPeriodEnd typeData={identifierType} />
              )}
              hideLabel
            />
            <FormGroup label={t("resource.telecom")} mt="lg" />
            <ResourceArrayInput
              form={form}
              property="telecom"
              propertyDisplayName={t("resource.telecom")}
              newValue={DEFAULT_CONTACT_POINT}
              renderElement={(path) => <TelecomInput form={form} path={path} />}
              hideLabel
            />
            <FormGroup label={t("resource.address")} mt="lg" />
            <ResourceArrayInput
              form={form}
              property="address"
              propertyDisplayName={t("resource.address")}
              newValue={DEFAULT_ADDRESS}
              alwaysShowDivider
              renderElement={(path) => <AddressInput form={form} path={path} />}
              hideLabel
            />
            <Center pt={"xs"}>
              <FormActions
                centered
                isNew={!staffData || !staffData.id}
                canSubmit={form.isDirty() && form.isValid()}
                onClose={() => router.back()}
                isSubmitting={isLoading}
              />
            </Center>
          </Stack>
        </form>
      )}
    </>
  );
};
export default StaffForm;
