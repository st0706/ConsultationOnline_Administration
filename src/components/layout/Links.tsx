"use client";

import { Box, Collapse, Group, Text, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";
import classes from "./Links.module.css";
import { TLink } from "./Navigation";

const LinksGroup: FC<TLink> = ({ icon: Icon, label, initiallyOpened, url, links, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const ChevronIcon = IconChevronRight;

  const isGroupActive = !!(hasLinks ? links : []).find((link) => link.url && link.url === pathname);
  const items = (hasLinks ? links : []).map((link) =>
    link.url ? (
      <Text
        component={Link}
        className={classes.link}
        href={link.url}
        key={link.label}
        data-active={link.url === pathname ? true : undefined}
        onClick={onClose}>
        {link.label}
      </Text>
    ) : (
      <Text className={classes.link} key={link.label} onClick={onClose}>
        {link.label}
      </Text>
    )
  );

  return (
    <>
      <UnstyledButton
        component="a"
        onClick={() => {
          setOpened((o) => !o);
          url && router.push(url || "#");
          onClose && onClose();
        }}
        className={classes.control}
        data-active={(url && url === pathname) || isGroupActive || undefined}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Icon size={18} />
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened ? `rotate(90deg)` : "none"
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
};

export default LinksGroup;
