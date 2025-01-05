import { Group, Text, UnstyledButton, UnstyledButtonProps } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { FC, ReactNode } from "react";
import { LetterAvatar } from "../common";
import classes from "./UserButton.module.css";

type Props = {
  image?: string | null;
  name: string;
  email: string;
  icon?: ReactNode;
  asAction?: boolean;
} & UnstyledButtonProps;

const UserProfileButton: FC<Props> = ({ image, name, email, icon, asAction, ...others }) => {
  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <LetterAvatar url={image} name={name} />
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>
          <Text size="xs">{email}</Text>
        </div>
        {icon && asAction && <IconChevronRight size="0.9rem" stroke={1.5} />}
      </Group>
    </UnstyledButton>
  );
};

export default UserProfileButton;
