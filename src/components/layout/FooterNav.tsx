import { useTranslation } from "@/i18n";
import { ActionIcon, Button, Group, Menu, rem, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { ButtonProps } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDots } from "@tabler/icons-react";

type FooterLink = {
  label: string;
  link?: string;
};

const FooterNav = () => {
  const { t } = useTranslation("system");
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isMobile = useMediaQuery("(max-width: 430px)");

  const BUTTON_PROPS: ButtonProps = {
    variant: "subtle",
    style: {
      padding: `${rem(8)} ${rem(12)}`,
      color: colorScheme === "dark" ? theme.white : theme.black,

      "&:hover": {
        transition: "all ease 150ms",
        backgroundColor: colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2],
        textDecoration: "none"
      }
    }
  };

  const footerLinks: FooterLink[] = [
    {
      label: t("footer.about"),
      link: ""
    },
    {
      label: t("footer.help"),
      link: ""
    },
    {
      label: t("footer.contact"),
      link: ""
    }
  ];

  return (
    <Group justify="space-between">
      <Text c="dimmed" fz="sm">
        &copy;&nbsp;{new Date().getFullYear()}&nbsp;An Phat Smart Medical
      </Text>
      {isMobile ? (
        <Menu shadow="md" width={200} position="right-end">
          <Menu.Target>
            <ActionIcon>
              <IconDots size={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            {footerLinks.map((link, index) => (
              <Menu.Item key={index} component="a">
                {link.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Group gap={4}>
          {footerLinks.map((link, index) => (
            <Button key={index} component="a" {...BUTTON_PROPS}>
              {link.label}
            </Button>
          ))}
        </Group>
      )}
    </Group>
  );
};

export default FooterNav;
