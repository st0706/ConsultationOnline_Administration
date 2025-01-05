"use client";

import FormActions from "@/components/form/FormActions";
import { useTranslation } from "@/i18n";
import { Flex, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";

interface AdDivisionFormProps {
  onSubmit: (values: any) => void;
  data?: any;
  isSubmitting?: boolean;
  onClose?: () => void;
}

const AdDivisionForm = (props: AdDivisionFormProps) => {
  const { t } = useTranslation("system");
  const { onSubmit, data, isSubmitting, onClose } = props;
  const form = useForm({
    mode: "uncontrolled",
    initialValues: data || {},
    validateInputOnBlur: true,
    validate: {
      wardCode: isNotEmpty(t("message.required", { name: t("adDivision.wardCode") })),
      wardName: isNotEmpty(t("message.required", { name: t("adDivision.wardName") })),
      districtId: isNotEmpty(t("message.required", { name: t("adDivision.districtId") })),
      districtName: isNotEmpty(t("message.required", { name: t("adDivision.districtName") })),
      cityId: isNotEmpty(t("message.required", { name: t("adDivision.cityId") })),
      cityName: isNotEmpty(t("message.required", { name: t("adDivision.cityName") }))
    }
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Flex gap="md" direction={{ base: "column", sm: "row" }}>
          <TextInput
            w="100%"
            withAsterisk
            data-autofocus
            label={t("adDivision.wardCode")}
            {...form.getInputProps("wardCode")}
          />
          <TextInput w="100%" withAsterisk label={t("adDivision.wardName")} {...form.getInputProps("wardName")} />
        </Flex>
        <Flex gap="md" direction={{ base: "column", sm: "row" }}>
          <TextInput w="100%" withAsterisk label={t("adDivision.districtId")} {...form.getInputProps("districtId")} />
          <TextInput
            w="100%"
            withAsterisk
            label={t("adDivision.districtName")}
            {...form.getInputProps("districtName")}
          />
        </Flex>
        <Flex gap="md" direction={{ base: "column", sm: "row" }}>
          <TextInput w="100%" withAsterisk label={t("adDivision.cityId")} {...form.getInputProps("cityId")} />
          <TextInput w="100%" withAsterisk label={t("adDivision.cityName")} {...form.getInputProps("cityName")} />
        </Flex>

        <FormActions
          isNew={!data || !data.id}
          isSubmitting={isSubmitting}
          canSubmit={form.isDirty() && form.isValid()}
          onClose={() => (onClose ? onClose() : modals.closeAll())}
        />
      </Stack>
    </form>
  );
};

export default AdDivisionForm;
