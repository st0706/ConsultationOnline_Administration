"use client";

import { useTranslation } from "@/i18n";
import { cookieLang, languageList } from "@/i18n/settings";
import { Group, Image, Menu, Tooltip, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { setCookie } from "cookies-next";
import { FC, useMemo, useState } from "react";
import classes from "./LanguagePicker.module.css";
import dayjs from "dayjs";

type Props = {
  type: "collapsed" | "expanded";
};

const LanguagePicker: FC<Props> = ({ type }) => {
  const { t, i18n } = useTranslation("system");
  const [opened, setOpened] = useState(false);
  const selected = useMemo(
    () => languageList.find((x) => x.language === i18n.language) || languageList[0],
    [i18n.language]
  );
  const items = languageList.map((item) => (
    <Menu.Item
      leftSection={<Image src={item.image} width={18} height={12} alt="flag" />}
      onClick={() => {
        i18n.changeLanguage(item.language);
        dayjs.locale(item.language);
        setCookie(cookieLang, item.language);
      }}
      key={item.label}>
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      opened={opened}
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="sm"
      withinPortal
      width={200}>
      <Menu.Target>
        <Tooltip label={t("header.language")}>
          <UnstyledButton className={classes.control}>
            <Group gap="xs">
              <Image src={selected?.image} width={24} height={16} alt="flag" />
              {type === "expanded" && <span className={classes.label}>{selected?.label}</span>}
            </Group>
            {type === "expanded" && <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />}
          </UnstyledButton>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
};

export default LanguagePicker;
