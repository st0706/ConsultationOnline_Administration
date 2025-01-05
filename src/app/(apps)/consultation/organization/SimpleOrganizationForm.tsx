import { TypesInput } from "@/components/FHIR";
import { LetterAvatar } from "@/components/common";
import { FormActions } from "@/components/form";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { slugify } from "@/lib/common";
import { createClient } from "@/utils/supabase/client";
import { Button, FileButton, Grid, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { Organization } from "fhir/r5";

interface IProps {
  data?: any;
  partOfId?: string | null;
  onSubmit: (values: Organization) => void;
  isSubmitting?: boolean;
  onClose?: () => void;
}

let SimpleOrganizationForm = (props: IProps) => {
  const supabase = createClient();
  const { t } = useTranslation("system");
  const { notifyResult } = useNotify();
  const { data, onSubmit, partOfId, isSubmitting, onClose } = props;

  const form = useForm({
    initialValues: {
      ...data,
      name: data?.name || "",
      logo: data?.logo || "",
      resourceType: "Organization",
      partOfId: partOfId ? partOfId : data?.partOfId
    }
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Stack align="center">
          <LetterAvatar url={form.values.logo} name={form.values.name} size={120} />
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
        </Stack>
        <Grid align="center" mt="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput required label={t("organization.nameTable")} {...form.getInputProps("name")} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TypesInput form={form} />
          </Grid.Col>
        </Grid>

        <FormActions
          centered
          isNew={!data || !data.id}
          isSubmitting={isSubmitting}
          canSubmit={form.isDirty() && form.isValid()}
          onClose={() => (onClose ? onClose() : modals.closeAll())}
        />
      </Stack>
    </form>
  );
};

export default SimpleOrganizationForm;
