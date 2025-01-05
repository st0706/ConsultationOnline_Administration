import { MantineColor } from "@mantine/core";

var avatarColors: MantineColor[] = [
  "red",
  "pink",
  "grape",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "green",
  "lime",
  "yellow",
  "orange",
  "teal"
];

export const toColor = (name?: string): MantineColor => {
  if (!name) return "cyan";

  var sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }

  return avatarColors[sum % avatarColors.length] || "cyan";
};

export const getStatusColor = (status?: string | null): MantineColor => {
  if (!status) return "blue";

  switch (status) {
    case "active":
    case "approved":
      return "green";
    case "pending":
      return "orange";
    case "draft":
    case "inactive":
      return "gray";
    case "banned":
    case "deleted":
    case "suspend":
    case "rejected":
      return "red";
    default:
      return "blue";
  }
};
