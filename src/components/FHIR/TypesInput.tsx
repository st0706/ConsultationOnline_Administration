import { useTranslation } from "@/i18n";
import { Grid, MultiSelect } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { FC, useEffect, useState } from "react";

interface Props {
  form: UseFormReturnType<any, (values: any) => any>;
}

const TypesInput: FC<Props> = ({ form }) => {
  const { t } = useTranslation("system");
  const organizationTypes = {
    prov: {
      coding: {
        code: "prov",
        system: "http://terminology.hl7.org/CodeSystem/organization-type",
        display: "Healthcare Provider"
      }
    },
    dept: {
      coding: {
        code: "dept",
        system: "http://terminology.hl7.org/CodeSystem/organization-type",
        display: "Hospital Department"
      }
    },
    team: {
      coding: {
        code: "team",
        system: "http://terminology.hl7.org/CodeSystem/organization-type",
        display: "Organizational team"
      }
    },
    govt: {
      coding: { code: "govt", system: "http://terminology.hl7.org/CodeSystem/organization-type", display: "Government" }
    },
    ins: {
      coding: {
        code: "ins",
        system: "http://terminology.hl7.org/CodeSystem/organization-type",
        display: "Insurance Company"
      }
    },
    pay: {
      coding: {
        code: "pay",
        system: "http://terminology.hl7.org/CodeSystem/organization-type",
        display: "Payer"
      }
    },
    edu: {
      coding: {
        code: "edu",
        system: "http://terminology.hl7.org/CodeSystem/organization-type",
        display: "Educational Institute"
      }
    },
    reli: {
      coding: {
        code: "reli",
        system: "http://terminology.hl7.org/CodeSystem/organization-type",
        display: "Religious Institution"
      }
    },
    crs: {
      coding: {
        code: "crs",
        system: "http://terminology.hl7.org/CodeSystem/organization-type",
        display: "Clinical Research Sponsor"
      }
    },
    cg: {
      coding: {
        code: "cg",
        system: "http://terminology.hl7.org/CodeSystem/organization-type",
        display: "Community Group"
      }
    },
    bus: {
      coding: {
        code: "bus",
        system: "http://terminology.hl7.org/CodeSystem/organization-type",
        display: "Non-Healthcare Business or Corporation"
      }
    },
    other: {
      coding: { code: "other", system: "http://terminology.hl7.org/CodeSystem/organization-type", display: "Other" }
    }
  };

  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (form.values.type?.length > 0) {
      setValue(form.values.type!.map((type) => type.coding?.code));
    }
  }, []);

  useEffect(() => {
    if (value.length > 0) {
      form.setFieldValue(
        "type",
        value.map((code) => organizationTypes[code])
      );
    }
  }, [value]);

  return (
    <Grid>
      <Grid.Col span={12}>
        <MultiSelect
          data={[
            { value: "prov", label: t("organization.type.prov") },
            { value: "dept", label: t("organization.type.dept") },
            { value: "team", label: t("organization.type.team") },
            { value: "govt", label: t("organization.type.govt") },
            { value: "ins", label: t("organization.type.ins") },
            { value: "pay", label: t("organization.type.pay") },
            { value: "edu", label: t("organization.type.edu") },
            { value: "reli", label: t("organization.type.reli") },
            { value: "crs", label: t("organization.type.crs") },
            { value: "cg", label: t("organization.type.cg") },
            { value: "bus", label: t("organization.type.bus") },
            { value: "other", label: t("organization.type.other") }
          ]}
          value={value}
          onChange={setValue}
          label={t("type")}
        />
      </Grid.Col>
    </Grid>
  );
};

export default TypesInput;
