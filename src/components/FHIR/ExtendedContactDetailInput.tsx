"use client";

import { useTranslation } from "@/i18n";
import { ContactEntityType } from "@/types";
import { Flex, Select, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { DEFAULT_CODING, DEFAULT_CONTACT_POINT, DEFAULT_HUMAN_NAME } from ".";
import AddressInput from "./AddressInput";
import HumanNameInput from "./HumanNameInput";
import ResourceArrayInput from "./ResourceArrayInput";
import TelecomInput from "./TelecomInput";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const ExtendedContactDetailInput: <T>(props: Props<T>) => React.ReactNode = ({ form, path, label, description }) => {
  const { t } = useTranslation("fhir");
  // const [purposeContact, setPurposeContact] = useState(DEFAULT_CODING);
  // useEffect(() => {
  //   if (purposeContact === null || value === undefined || value === "") {
  //     form.setFieldValue(`${path}.purpose.coding.0`, DEFAULT_CODING as any);
  //   } else form.setFieldValue(`${path}.purpose.coding.0`, ContactEntityType[value]);
  // }, purposeContact)
  const purposeSelectData = Object.keys(ContactEntityType).reduce((acc: any, curr: string) => {
    acc[curr] = acc[curr] || {
      label: t(`contact.purpose.${ContactEntityType[curr]?.code}`),
      value: ContactEntityType[curr]?.code
    };
    return [...acc, acc[curr]];
  }, []);

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Stack>
        <ResourceArrayInput
          form={form}
          property={`${path}.telecom`}
          propertyDisplayName={t("resource.telecom")}
          newValue={DEFAULT_CONTACT_POINT}
          renderElement={(path) => <TelecomInput form={form} path={path} />}
        />
        <AddressInput label={t("resource.address")} form={form} path={`${path}.address`} />
        <ResourceArrayInput
          form={form}
          property={`${path}.name`}
          propertyDisplayName={t("contact.name")}
          newValue={DEFAULT_HUMAN_NAME}
          renderElement={(path, index) => (
            <HumanNameInput index={index} form={form} path={path} showPrefix disabledType={index === 0} />
          )}
        />
        <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }}>
          <Select
            w={"100%"}
            placeholder={t("purpose")}
            clearable
            searchable
            data={purposeSelectData}
            value={form?.getInputProps(`${path}.purpose`).value?.coding?.at(0)?.code || null}
            onChange={(value) => {
              if (!value) return form.setFieldValue(`${path}.purpose.coding.0`, DEFAULT_CODING as any);
              form.setFieldValue(`${path}.purpose.coding.0`, ContactEntityType[value]);
            }}
          />
          <DateInput
            w={"100%"}
            clearable
            valueFormat="l"
            placeholder={t("contact.periodStart")}
            {...form.getInputProps(`${path}.period.start`)}
          />
          <DateInput
            w={"100%"}
            clearable
            valueFormat="l"
            placeholder={t("contact.periodEnd")}
            {...form.getInputProps(`${path}.period.end`)}
          />
        </Flex>
        {/* <Select
          label={t("contact.managingOrg")}
          description={t("contact.managingOrgDesc")}
          {...form.getInputProps(`${path}.managingOrganization.reference`)}
          defaultValue={""}
        /> */}
      </Stack>
    </div>
  );
};

export default ExtendedContactDetailInput;
