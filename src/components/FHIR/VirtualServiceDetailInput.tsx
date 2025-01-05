"use client";

import { useTranslation } from "@/i18n";
import { Flex, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const ChannelType = {
  zoom: {
    code: "zoom",
    system: "http://hl7.org/fhir/virtual-service-type",
    display: "Zoom web conferencing"
  },
  "ms-teams": {
    code: "ms-teams",
    system: "http://hl7.org/fhir/virtual-service-type",
    display: "Microsoft Teams"
  },
  whatsapp: {
    code: "whatsapp",
    system: "http://hl7.org/fhir/virtual-service-type",
    display: "WhatsApp conference call"
  }
};

const VirtualServiceDetailInput: <T>(props: Props<T>) => React.ReactNode = ({ form, path, label, description }) => {
  const { t } = useTranslation("consultation");

  const ChannelTypeData = Object.keys(ChannelType).reduce((acc: any, curr: string) => {
    acc[curr] = acc[curr] || {
      label: t(`appointment.virtualService.channelType.${ChannelType[curr]?.code}`),
      value: ChannelType[curr]?.code
    };
    return [...acc, acc[curr]];
  }, []);

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Stack>
        <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }}>
          <Select
            w={"100%"}
            label={t("appointment.virtualService.name")}
            data={ChannelTypeData}
            searchable
            value={
              form.getInputProps(`${path}.channelType`).value.length === 0
                ? undefined
                : form
                    .getInputProps(`${path}.channelType`)
                    .value?.map((x) => x.code)
                    .at(0)
            }
            onChange={(value) => {
              form.setFieldValue(`${path}.channelType.${0}`, ChannelType[`${value}`]);
            }}
          />
          <NumberInput
            w={"100%"}
            min={1}
            label={t("appointment.virtualService.maxParticipants")}
            {...form.getInputProps(`${path}.maxParticipants`)}
          />
          <TextInput
            w={"100%"}
            label={t("appointment.virtualService.sessionKey")}
            {...form.getInputProps(`${path}.sessionKey`)}
          />
        </Flex>
      </Stack>
    </div>
  );
};

export default VirtualServiceDetailInput;
