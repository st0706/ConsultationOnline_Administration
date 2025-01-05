"use client";

import { CALENDAR_PATHS, CONSULTATION_PATHS } from "@/app/(apps)/apps";
import { useTranslation } from "@/i18n";
import { SignOut } from "@/utils/auth-helpers/server";
import {
  ActionIcon,
  Anchor,
  Burger,
  Button,
  Group,
  Menu,
  TextInput,
  Tooltip,
  rem,
  useMantineColorScheme,
  useMantineTheme
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronDown,
  IconCircleHalf2,
  // IconMessageCircle,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
  IconUserCircle,
  IconUserCode
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import { useAuthStore } from "../auth/AuthContext";
import { LetterAvatar } from "../common";
import classes from "./HeaderNav.module.css";
import LanguagePicker from "./LanguagePicker";
import Logo from "./Logo";
import { modals } from "@mantine/modals";
import UserForm from "@/app/(apps)/UserForm";
import { api } from "@/trpc/react";

const ICON_SIZE = 22;

/* const MESSAGES = [
  {
    id: "687725a3-5489-486e-9ffd-180df00f8e10",
    first_name: "Egor",
    last_name: "Thornebarrow",
    message:
      "Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue."
  },
  {
    id: "75103d7a-b26b-4e1f-8d7e-2117867d05b8",
    first_name: "Magdalen",
    last_name: "Slessor",
    message:
      "In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat."
  },
  {
    id: "08bff541-e731-445f-a2e1-7f08e3e30357",
    first_name: "Bald",
    last_name: "Vant",
    message:
      "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque."
  }
]; */

/* const NOTIFICATIONS = [
  {
    id: "15f6a5e0-758f-4642-aa95-a07bb3170544",
    title: "Beahan-Senger",
    message:
      "Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.",
    icon: "https://avatars.githubusercontent.com/u/22109882"
  },
  {
    id: "28d772cb-dcbd-4a34-bbe2-587fc03c5723",
    title: "Orn, Wehner and Kirlin",
    message: "Integer ac leo.",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJzSURBVDjLpZNLSFRxFMZ/944z42MqH2MllWJEkT1UjHETSFJiVAtdtHFly5aCm6xNWyFw2aoIoiAoWgjSIqkWghAuVFBTJJVGGV/pzPznzr3/c9qEaUaLOsuPw4/z+D5HVfmfKvhdCIadmCo9KrSLkFAFFUZFGFLh0YFbmt7d7+yeIBh2WlR44lT31jqlCTRSDmpRs4rdGMP70j8vQndZh37YBwjeOx1a2vLaPdqFFh/CZqcQbw0NcuAU4haewvFdvIVXeCsfOitv65sdgP/eKVfla+jCi5i4Wwy/HCSVNJy5eAhUmR7fIl4Jl6+fJxS9wPeRO2kRaqq6dN0FUKHHremLmewKm/PvCLuGtptFLM1usDS3SdvNIiIRsNsTmPUxis/2xcTSA+ACiHDDKWtGtj8TdbZoSkA0bLjstylekTr9QjRsKEp8XNpb4qC0tOI5cZuQB3Rg6xML+z5yOZymo1ls0dLLRrAw1pqdwAqGA1yePkSVhc9xCr5nJDJKEuzhuScIcgryTlDdjMLqogQ2vGBWObxTUP8ZDVzI5OMf0xREHGJH48SPxJi/VuGmdEtKqostyle07FEFuA7zH7CyAM+qtjDWU1F2koNai/jfo5xObQwHC4CrQ+AFXCFY2Y1a/4eQZ/3cAykJ18mCY4gBs5Aeqg4oHNo9ZHxQdcQrEzaLSe5KeHad9jYAdQ1qkpEbqzs89AjxE62IwTKkdFQRQ3EidceRUtbmVt4i1+nu7Ge5raZ+Xkc+eaWB6X1PXWRirO4YZdkIDAs2SSMyyP9M8HPneb7uvQH7MAsPjUiYmlV4R2a0kEeQh8RgOfocCn/9KDv4TpX+oHaI9cJDajhlcAAAAASUVORK5CYII="
  },
  {
    id: "64ee7341-f2a8-42f2-b379-48f523811d49",
    title: "Heathcote-Flatley",
    message: "Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.",
    icon: "https://avatars.githubusercontent.com/u/22109882"
  }
]; */

type Props = {
  hasNav: boolean;
  mobileOpened?: boolean;
  toggleMobile?: () => void;
  desktopOpened?: boolean;
  toggleDesktop?: () => void;
};

const HeaderNav: FC<Props> = ({ hasNav, desktopOpened, toggleDesktop, toggleMobile, mobileOpened }) => {
  const { t } = useTranslation("system");
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const tablet_match = useMediaQuery("(max-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 430px)");
  const authUser = useAuthStore()((s) => s.authUser);
  const reset = useAuthStore()((s) => s.reset);
  const pathname = usePathname();
  const router = useRouter();

  const { data: dataUser } = api.account.getById.useQuery(authUser?.user?.id!);

  const handleEditAccountProfile = () => {
    const modalId = "update-user";
    modals.open({
      modalId: modalId,
      title: t("editTitle", { object: t("header.profile") }),
      size: "lg",
      centered: true,
      closeOnClickOutside: false,
      children: <UserForm data={dataUser} onClose={() => modals.close(modalId)} />
    });
  };

  const handleSignout = async () => {
    try {
      const redirectPath = await SignOut("/auth/signin", true);
      return router.push(redirectPath);
    } catch (error) {
    } finally {
      reset();
    }
  };

  const topLinks = [
    { link: CONSULTATION_PATHS.root, label: t("app.consultation") },
    { link: CALENDAR_PATHS.root, label: t("app.calendar") }
  ];

  const topNavTtems = topLinks.map((link) => {
    /* const menuItems = link.links?.map((item) => <Menu.Item key={item.link}>{item.label}</Menu.Item>);

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a href={link.link} className={classes.link} onClick={(event) => event.preventDefault()}>
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size="0.9rem" stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    } */

    return (
      <Anchor
        key={link.label}
        href={link.link}
        className={classes.topLink}
        data-active={(link.link && pathname.startsWith(link.link)) || undefined}
        lh={1}>
        {link.label}
      </Anchor>
    );
  });

  /* const messages = MESSAGES.map((m) => (
    <Menu.Item
      key={m.id}
      style={{
        borderRadius: 0,
        borderBottom: `1px solid ${colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[3]}`
      }}>
      <Flex gap="sm" align="center">
        <LetterAvatar name={`${m.first_name} ${m.last_name}`} size="sm" />
        <Stack gap={1}>
          <Text fz="sm" fw={600}>
            {m.first_name} {m.last_name}
          </Text>
          <Text lineClamp={2} fz="xs" c="dimmed">
            {m.message}
          </Text>
        </Stack>
      </Flex>
    </Menu.Item>
  )); */

  /* const notifications = NOTIFICATIONS.slice(0, 3).map((n) => (
    <Menu.Item
      key={n.id}
      style={{
        borderRadius: 0,
        borderBottom: `1px solid ${colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[3]}`
      }}>
      <Flex gap="sm" align="center">
        <LetterAvatar url={n.icon} name={n.title} size="sm" />
        <Stack gap={1}>
          <Text fz="sm" fw={600}>
            {n.title}
          </Text>
          <Text lineClamp={2} fz="xs" c="dimmed">
            {n.message}
          </Text>
        </Stack>
      </Flex>
    </Menu.Item>
  )); */

  const currentApp = topLinks.find((x) => pathname.startsWith(x.link));
  const name = authUser?.user?.user_metadata?.name || authUser?.user?.email;

  return (
    <Group justify="space-between">
      <Group>
        {hasNav ? (
          <>
            <Tooltip label={t("header.toggleNav")}>
              <Burger onClick={toggleDesktop} visibleFrom="md" />
            </Tooltip>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="md" size="sm" />
          </>
        ) : (
          <Logo width={140} height={40} className={classes.logo} visibleFrom="md" />
        )}

        {/* Mobile apps menu */}
        {currentApp && (
          <Menu shadow="lg" width={150} withArrow>
            <Menu.Target>
              <Button variant="subtle" hiddenFrom="lg" rightSection={<IconChevronDown size={16} />}>
                {currentApp.label}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {topLinks.map((link) => {
                return (
                  <Menu.Item
                    key={link.label}
                    component="a"
                    href={link.link}
                    className={classes.topLink}
                    data-active={(link.link && pathname.startsWith(link.link)) || undefined}>
                    {link.label}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>

      <Group gap={5} visibleFrom="lg">
        {topNavTtems}
      </Group>

      <Group>
        <ActionIcon visibleFrom="md" hiddenFrom="xl">
          <IconSearch size={ICON_SIZE} />
        </ActionIcon>
        <TextInput
          visibleFrom="xl"
          variant="filled"
          radius="xl"
          placeholder={t("header.search")}
          rightSection={<IconSearch size={ICON_SIZE} />}
          style={{
            width: tablet_match ? "auto" : rem(216)
          }}
        />

        {!isMobile && (
          <>
            <LanguagePicker type="collapsed" />
            {/* <Menu shadow="lg" width={320}>
              <Menu.Target>
                <Indicator processing size={10} offset={6} color="orange">
                  <Tooltip label={t("header.messages")}>
                    <ActionIcon size="lg" color="gray" title={t("header.messages")}>
                      <IconMessageCircle size={ICON_SIZE} />
                    </ActionIcon>
                  </Tooltip>
                </Indicator>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label tt="uppercase" ta="center" fw={600}>
                  {t("header.newMessages", { count: MESSAGES.length })}
                </Menu.Label>
                {messages}
                <Menu.Item tt="uppercase" ta="center" fw={600} mt={4}>
                  {t("header.showAllMessages")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu> */}
          </>
        )}
        {/* <Menu shadow="lg" width={320}>
          <Menu.Target>
            <Indicator processing size={10} offset={6} color="red">
              <Tooltip label={t("header.notifications")}>
                <ActionIcon size="lg" color="gray" title={t("header.notifications")}>
                  <IconBell size={ICON_SIZE} />
                </ActionIcon>
              </Tooltip>
            </Indicator>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              {t("header.newNotifications", { count: NOTIFICATIONS.length })}
            </Menu.Label>
            {notifications}
            <Menu.Item tt="uppercase" ta="center" fw={600} mt={4}>
              {t("header.showAllNotifications")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu> */}
        <Menu shadow="lg" width={200} trigger="click-hover" withArrow>
          <Menu.Target>
            <Button
              variant="transparent"
              component="a"
              leftSection={<LetterAvatar url={authUser?.user?.user_metadata?.image} name={name} />}
              rightSection={<IconChevronDown size={14} />}
              h="auto"
              p={0}
              c="dimmed"
              lh="lg"
              maw={168}>
              {isMobile ? null : name}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              {t("header.welcome")}
            </Menu.Label>
            <Menu.Item
              onClick={() => dataUser && handleEditAccountProfile()}
              component="a"
              leftSection={<IconUserCircle size={16} />}>
              {t("header.profile")}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              {t("colorScheme.select")}
            </Menu.Label>
            <Menu.Item leftSection={<IconSunHigh size={16} />} onClick={() => setColorScheme("light")}>
              {t("colorScheme.light")}
            </Menu.Item>
            <Menu.Item leftSection={<IconMoonStars size={16} />} onClick={() => setColorScheme("dark")}>
              {t("colorScheme.dark")}
            </Menu.Item>
            <Menu.Item leftSection={<IconCircleHalf2 size={16} />} onClick={() => setColorScheme("auto")}>
              {t("colorScheme.system")}
            </Menu.Item>
            <Menu.Divider />
            {/* <Menu.Item leftSection={<IconLockAccess size={16} />}>{t("header.lockScreen")}</Menu.Item> */}
            <Menu.Item leftSection={<IconPower size={16} />} onClick={handleSignout}>
              {t("header.signout")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default HeaderNav;
