import { toColor } from "@/lib/color";
import { Avatar, AvatarProps, MantineColor, MantineSize } from "@mantine/core";
import { FC, useMemo } from "react";

type Props = AvatarProps & {
  name?: string;
  color?: MantineColor;
  size?: MantineSize | string | number;
  url?: string | undefined | null;
};

const LetterAvatar: FC<Props> = ({ name, color, size, url, style, ...others }) => {
  const c = useMemo(() => color || toColor(name), [color, name]);

  return (
    <Avatar src={url} alt={name} color={c} size={size} style={{ borderRadius: "50%", ...style }} {...others}>
      {name && name.length > 0 && name.charAt(0).toUpperCase()}
    </Avatar>
  );
};

export default LetterAvatar;
