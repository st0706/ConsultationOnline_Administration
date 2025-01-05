import SimpleOrganizationForm from "@/app/(apps)/consultation/organization/SimpleOrganizationForm";
import useModal from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { ActionIcon, ComboboxData, Flex, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconCirclePlus } from "@tabler/icons-react";
import { useEffect } from "react";
import IdentifierCodingInput from "./IdentifierCodingInput";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  typeData?: ComboboxData;
  showPeriodStart?: boolean;
  showPeriodEnd?: boolean;
  showCode?: boolean;
  showIssuedBy?: boolean;
  onChange?: (e) => void;
}

const IdentifierInput: <T>(props: Props<T>) => React.ReactNode = ({
  form,
  path,
  label,
  description,
  typeData,
  showPeriodStart,
  showPeriodEnd,
  showCode = true,
  showIssuedBy = true,
  onChange
}) => {
  const { t } = useTranslation("fhir");
  const ORGANIZATION = t("resource.organization");
  const { actionForm } = useModal();
  const { notifyResult } = useNotify();
  const context = api.useUtils();
  const assigner = form.getInputProps(`${path}.assigner`).value;

  const { mutateAsync: createOrganization, isLoading: isLoadingCreate } = api.organization.create.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Create, ORGANIZATION, true);
    },
    onError: (e) => {
      notifyResult(Action.Create, ORGANIZATION, false, e.message);
    }
  });

  const { data: organizationList } = api.organization.getAll.useQuery();

  useEffect(() => {
    if (!assigner) {
      form.setFieldValue(`${path}.assigner`, { id: "" } as any);
    }
  }, []);

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
        {showCode && <IdentifierCodingInput typeData={typeData} form={form} path={`${path}.type.coding.0`} />}
        <TextInput
          w={"100%"}
          placeholder={t("value")}
          {...form.getInputProps(`${path}.value`)}
          onChange={(e) => {
            if (onChange) onChange(e);
            else form.setFieldValue(`${path}.value`, e.currentTarget.value as any);
          }}
        />
        {showIssuedBy && (
          <Select
            w={"100%"}
            placeholder={t("identifier.assigner")}
            data={organizationList?.map((organization) => {
              return { label: organization.name!, value: organization.id! };
            })}
            searchable
            {...form.getInputProps(`${path}.assigner.id`)}
            rightSectionPointerEvents="visible"
            rightSection={
              <ActionIcon
                onClick={() =>
                  actionForm(
                    "create-simple-organization",
                    ORGANIZATION,
                    SimpleOrganizationForm,
                    isLoadingCreate,
                    async (values) => {
                      const res = await createOrganization(values);
                      if (res.id) modals.close("create-simple-organization");
                    }
                  )
                }
                title={t("resourceArray.add", { name: t("identifier.assigner") })}
                color="green.6">
                <IconCirclePlus size="1.25rem" />
              </ActionIcon>
            }
          />
        )}
        {showPeriodStart && (
          <DateInput
            w={"100%"}
            valueFormat="DD/MM/YYYY"
            clearable
            placeholder={t("identifier.periodStart")}
            {...form.getInputProps(`${path}.period.start`)}
          />
        )}
        {showPeriodEnd && (
          <DateInput
            w={"100%"}
            valueFormat="DD/MM/YYYY"
            clearable
            placeholder={t("identifier.periodEnd")}
            {...form.getInputProps(`${path}.period.end`)}
          />
        )}
      </Flex>
    </div>
  );
};

export default IdentifierInput;
