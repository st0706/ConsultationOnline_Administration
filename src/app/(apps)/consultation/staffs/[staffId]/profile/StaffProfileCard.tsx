import { LetterAvatar } from "@/components/common";
import { Paper, PaperProps, Stack, Text } from "@mantine/core";
import { FC } from "react";

type Props = {
  name?: string;
  avatarUrl?: string;
  subtitle?: string;
} & PaperProps;

const StaffProfileCard: FC<Props> = ({ name, avatarUrl, subtitle, ...others }) => {
  return (
    <Paper {...others}>
      <Stack gap={4} align="center">
        <LetterAvatar url={avatarUrl} name={name} size={120} mx="auto" />
        <Text fz="md" fw={500} mt="md" mx="auto">
          {name}
        </Text>
        {subtitle && (
          <Text c="dimmed" fz="xs" ta="center">
            {subtitle}
          </Text>
        )}
      </Stack>
    </Paper>
  );
};

export default StaffProfileCard;
