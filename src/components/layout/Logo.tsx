import classes from "./Logo.module.css";
import { Group, Text, UnstyledButton, Image } from "@mantine/core";
import Link from "next/link";
import { UnstyledButtonProps } from "@mantine/core";
import { FC } from "react";

type Props = {
  href?: string;
  width?: number;
  height?: number;
  title?: string;
} & UnstyledButtonProps;

const Logo: FC<Props> = ({ href = "/", width = 150, height = 43, title, ...others }) => {
  return (
    <UnstyledButton className={classes.logo} component={Link} href={href} {...others}>
      <Group gap="xs">
        <Image src="/logo.png" width={width} height={height} w={width} h={height} alt="An Phat" />
        {title && <Text fw={700}>{title}</Text>}
      </Group>
    </UnstyledButton>
  );
};

export default Logo;
