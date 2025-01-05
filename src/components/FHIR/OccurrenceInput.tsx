"use client";

import { useTranslation } from "@/i18n";
import { Flex, NumberInput, Select, Switch, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { DEFAULT_PERIOD, DEFAULT_TIMING } from ".";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const OccurrenceInput: <T>(props: Props<T>) => React.ReactNode = ({ form, label, description }) => {
  const { t } = useTranslation("fhir");
  const [type, setType] = useState<string | null>(
    form.getInputProps(`occurrenceTiming.event`).value
      ? "timing"
      : form.getInputProps(`occurrenceDateTime`).value
        ? "dateTime"
        : form.getInputProps(`occurrencePeriod.start`).value
          ? "period"
          : null
  );
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (form.getInputProps(`occurrenceTiming.period`).value) setChecked(true);
  }, []);
  useEffect(() => {
    if (type !== "timing") form.setFieldValue("occurrenceTiming", DEFAULT_TIMING as any);
    if (type !== "dateTime") form.setFieldValue("occurrenceDateTime", undefined as any);
    if (type !== "period") form.setFieldValue("occurrencePeriod", DEFAULT_PERIOD as any);
  }, [type]);
  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
        <Select
          w={{ base: "100%", sm: "50%" }}
          value={type}
          data={[
            { value: "dateTime", label: t("deviceRequest.occurrence.type.dateTime") },
            { value: "period", label: t("deviceRequest.occurrence.type.period") },
            { value: "timing", label: t("deviceRequest.occurrence.type.timing") }
          ]}
          onChange={(value, option) => {
            setType(value);
          }}
        />
        {type === "dateTime" && (
          <DateTimePicker w={{ base: "100%", sm: "50%" }} clearable {...form.getInputProps(`occurrenceDateTime`)} />
        )}
        {type === "period" && (
          <>
            <DateTimePicker w={"50%"} clearable {...form.getInputProps(`occurrencePeriod.start`)} />
            <DateTimePicker w={"50%"} clearable {...form.getInputProps(`occurrencePeriod.end`)} />
          </>
        )}
        {type === "timing" && (
          <DateTimePicker
            w={{ base: "100%", sm: "50%" }}
            clearable
            {...form.getInputProps(`occurrenceTiming.event.0`)}
          />
        )}
      </Flex>
      {type === "timing" && (
        <>
          <Switch
            mt={"xs"}
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
            labelPosition="right"
            label={t("deviceRequest.occurrence.timing.isRepeat")}
          />
          {checked && (
            <>
              <TextInput type="hidden" label={t("deviceRequest.occurrence.timing.label")} />
              <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
                <NumberInput
                  min={1}
                  w={{ base: "100%", sm: "50%" }}
                  allowDecimal
                  allowNegative={false}
                  {...form.getInputProps(`occurrenceTiming.period`)}
                />
                <Select
                  w={{ base: "100%", sm: "50%" }}
                  data={[
                    {
                      value: "s",
                      label: t("deviceRequest.occurrence.timing.s")
                    },
                    {
                      value: "min",
                      label: t("deviceRequest.occurrence.timing.min")
                    },
                    {
                      value: "h",
                      label: t("deviceRequest.occurrence.timing.h")
                    },
                    {
                      value: "d",
                      label: t("deviceRequest.occurrence.timing.d")
                    },
                    {
                      value: "wk",
                      label: t("deviceRequest.occurrence.timing.wk")
                    },
                    {
                      value: "mo",
                      label: t("deviceRequest.occurrence.timing.mo")
                    },
                    {
                      value: "a",
                      label: t("deviceRequest.occurrence.timing.a")
                    }
                  ]}
                  {...form.getInputProps(`occurrenceTiming.periodUnit`)}
                />
              </Flex>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OccurrenceInput;
