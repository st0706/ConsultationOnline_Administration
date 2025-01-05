import {
  DEFAULT_EXTENDED_CONTACT_DETAIL,
  DEFAULT_IDENTIFIER,
  ExtendedContactDetailInput,
  IdentifierInput,
  ResourceArrayInput,
  TypesInput
} from "@/components/FHIR";
import { LetterAvatar } from "@/components/common";
import { FormActions, FormGroup } from "@/components/form";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { slugify } from "@/lib/common";
import { api } from "@/trpc/react";
import { createClient } from "@/utils/supabase/client";
import { Button, Checkbox, FileButton, Flex, Grid, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Organization } from "fhir/r5";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IProps {
  data?: any;
  partOfId?: string | null;
  onSubmit: (values: Organization) => void;
  isSubmitting?: boolean;
}

const OrganizationForm = (props: IProps) => {
  const supabase = createClient();
  const { t } = useTranslation("system");
  const { notifyResult } = useNotify();
  const { data, onSubmit, partOfId, isSubmitting } = props;
  let { data: allOrganizations } = api.organization.getAll.useQuery();
  const [image, setImage] = useState<string | null>();
  const router = useRouter();

  useEffect(() => {
    if (image) form.setValues({ logo: image });
  }, [image]);

  let buildIdentifier = data?.identifier?.map((identifier) => {
    return {
      ...identifier,
      period: {
        start: identifier.period.start ? new Date(Number(identifier.period.start)) : undefined,
        end: identifier.period.end ? new Date(Number(identifier.period.end)) : undefined
      }
    };
  });

  let buildContact = data?.contact?.map((contact) => {
    let period = {
      ...contact?.period,
      start: contact?.period?.start ? new Date(Number(contact?.period?.start)) : undefined,
      end: contact?.period?.end ? new Date(Number(contact?.period?.end)) : undefined
    };
    return {
      ...contact,
      period
    };
  });

  const form = useForm({
    initialValues: {
      ...data,
      name: data?.name || "",
      alias: data?.alias || [],
      active: data?.active || true,
      description: data?.description || "",
      logo: data?.logo || "",
      website: data?.website || "",
      identifier: data && buildIdentifier,
      contact: data && buildContact,
      resourceType: "Organization",
      partOfId: partOfId ? partOfId : data?.partOfId
    }
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <FormGroup label={t("generalInfo")} />
        <Flex direction={{ base: "column-reverse", md: "row" }}>
          <Grid align="flex-start" flex={1}>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput required label={t("organization.nameTable")} {...form.getInputProps("name")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TypesInput form={form} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <TextInput {...form.getInputProps("alias.0")} label={t("organization.alias")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label={t("organization.belongsTo")}
                disabled={partOfId === undefined}
                data={allOrganizations
                  ?.filter((org) => {
                    if (org.id !== data?.id) return org;
                  })
                  .map((organization) => {
                    return {
                      label: organization.name!,
                      value: organization.id!
                    };
                  })}
                {...form.getInputProps("partOfId")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Textarea autosize label={t("description")} {...form.getInputProps("description")} />
            </Grid.Col>
          </Grid>
          <Stack align="center" w={{ base: "100%", md: "25%" }}>
            <LetterAvatar url={form.values.logo} name={form.values.name} size={96} />
            <FileButton
              onChange={async (file) => {
                if (file) {
                  const { data, error } = await supabase.storage
                    .from("system")
                    .upload(`${slugify(file.name)}-${Date.now()}`, file);
                  if (error) notifyResult(Action.Upload, t("image.label"), false, error.message);
                  else {
                    let res = supabase.storage.from("system").getPublicUrl(data?.path!);
                    if (res) form.setFieldValue("logo", res.data ? res.data.publicUrl : null);
                    notifyResult(Action.Upload, t("image.label"), true);
                  }
                }
              }}
              accept="image/png,image/jpeg">
              {(props) => <Button {...props}>{t("image.uploadAvatar")}</Button>}
            </FileButton>
            <Checkbox {...form.getInputProps("active", { type: "checkbox" })} label={t("organization.active")} />
          </Stack>
        </Flex>

        <FormGroup label={t("resource.contact")} mt="lg" />
        <ResourceArrayInput
          form={form}
          property="contact"
          propertyDisplayName={t("resource.contact")}
          newValue={DEFAULT_EXTENDED_CONTACT_DETAIL}
          renderElement={(path) => <ExtendedContactDetailInput form={form} path={path} />}
          alwaysShowDivider
          hideLabel
        />

        <FormGroup label={t("resource.identifier")} mt="lg" />
        <ResourceArrayInput
          form={form}
          property="identifier"
          propertyDisplayName={t("resource.identifier")}
          newValue={DEFAULT_IDENTIFIER}
          renderElement={(path) => <IdentifierInput form={form} path={path} showPeriodStart showPeriodEnd />}
          hideLabel
        />
        <FormActions
          centered
          isNew={!data || !data.id}
          isSubmitting={isSubmitting}
          canSubmit={form.isDirty() && form.isValid()}
          onClose={() => router.back()}
        />
      </Stack>
    </form>
  );
};

export default OrganizationForm;
