"use client";

import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { FC } from "react";
import LinksGroup from "./Links";
import Logo from "./Logo";
import classes from "./Navigation.module.css";

export type TLink = {
  label?: string;
  initiallyOpened?: boolean;
  icon?: any;
  url?: string;
  links?: TLink[];
  onClose?: () => void;
  isValidRole?: boolean;
};

export type TLinkGroup = {
  title?: string;
  links?: TLink[];
};

export type TLinkList = (TLink & TLinkGroup)[];

type Props = {
  links: TLinkList;
  onClose: () => void;
};

const Navigation: FC<Props> = ({ links, onClose }) => {
  const tablet_match = useMediaQuery("(max-width: 768px)");

  const linkItems = links.map((m, index) => (
    <Box pl={0} mb={4} key={index}>
      {m.title ? (
        <>
          <Text tt="uppercase" size="xs" pl="md" fw={500} my="xs" className={classes.linkHeader}>
            {m.title}
          </Text>
          {m.links?.map((item) => <LinksGroup {...item} key={item.label} onClose={onClose} />)}
        </>
      ) : (
        <LinksGroup {...m} key={m.label} onClose={onClose} />
      )}
    </Box>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group justify={tablet_match ? "space-between" : "center"} style={{ flex: tablet_match ? "auto" : 1 }}>
            <Logo width={140} height={40} className={classes.logo} />
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{linkItems}</div>
      </ScrollArea>
    </nav>
  );
};

export default Navigation;
