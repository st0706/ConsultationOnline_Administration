import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { Autocomplete, Flex, Select, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";

interface Props<T> {
  form: UseFormReturnType<T, (values: T) => T>;
  path: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabledType?: boolean;
}

const AddressInput: <T>(props: Props<T>) => React.ReactNode = ({ form, path, label, description, disabledType }) => {
  const { t } = useTranslation("fhir");
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

  useEffect(() => {
    if (form.getInputProps(path!).value) {
      setAddressCitySelected(form.getInputProps(path!).value.city || "");
      setAddressDistrictSelected(form.getInputProps(path!).value.district || "");
    }
  }, [form.getInputProps(path!).value]);

  return (
    <div>
      {(label || description) && <TextInput type="hidden" label={label} description={description} />}
      <Stack>
        <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
          <Select
            w={{ base: "100%", sm: "25%" }}
            placeholder={t("use")}
            data={[
              { label: t("address.purpose.permanentResidence"), value: "permanentResidence" },
              { label: t("address.purpose.birthPlace"), value: "birthPlace" },
              { label: t("address.purpose.home"), value: "home" },
              { label: t("address.purpose.work"), value: "work" },
              { label: t("address.purpose.temp"), value: "temp" },
              { label: t("address.purpose.old"), value: "old" },
              { label: t("address.purpose.billing"), value: "billing" }
            ]}
            searchable
            {...form.getInputProps(`${path}.use`)}
          />
          <TextInput
            w={{ base: "100%", sm: "75%" }}
            placeholder={t("address.street")}
            {...form.getInputProps(`${path}.line.0`)}
          />
          {/* <Select
            w={"100%"}
            placeholder={t("type")}
            data={[
              { label: t("address.type.postal"), value: "postal" },
              { label: t("address.type.physical"), value: "physical" },
              { label: t("address.type.both"), value: "both" }
            ]}
            searchable
            {...form.getInputProps(`${path}.type`)}
          />
          <TextInput w={"100%"} placeholder={t("address.postalCode")} {...form.getInputProps(`${path}.postalCode`)} /> */}
        </Flex>
        <Flex gap="xs" direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "flex-start" }}>
          <Autocomplete
            w={"100%"}
            data={allCities}
            placeholder={t("address.province")}
            {...form.getInputProps(`${path}.city`)}
          />
          <Autocomplete
            w={"100%"}
            data={allAddressDistricts}
            placeholder={t("address.district")}
            {...form.getInputProps(`${path}.district`)}
          />
          <Autocomplete
            w={"100%"}
            data={allAddressWards}
            placeholder={t("address.ward")}
            {...form.getInputProps(`${path}.line.1`)}
          />
        </Flex>
        {/* <TextInput label={t("address.text")} {...form.getInputProps(`${path}.text`)} /> */}
      </Stack>
    </div>
  );
};

export default AddressInput;
