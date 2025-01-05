"use client";

import { AreaChart } from "@mantine/charts";
import { ActionIcon, Group, Paper, PaperProps, Text } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { FC } from "react";

const RevenueChart: FC<PaperProps> = ({ ...others }) => {
  const data = [
    {
      date: "Mar 22",
      Apples: 2890,
      Oranges: 2338,
      Tomatoes: 2452
    },
    {
      date: "Mar 23",
      Apples: 2756,
      Oranges: 2103,
      Tomatoes: 2402
    },
    {
      date: "Mar 24",
      Apples: 3322,
      Oranges: 986,
      Tomatoes: 1821
    },
    {
      date: "Mar 25",
      Apples: 3470,
      Oranges: 2108,
      Tomatoes: 2809
    },
    {
      date: "Mar 26",
      Apples: 3129,
      Oranges: 1726,
      Tomatoes: 2290
    }
  ];

  return (
    <Paper {...others}>
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Total Revenue
        </Text>
        <ActionIcon size="lg" radius="xl" variant="subtle" color="gray">
          <IconDotsVertical size={18} />
        </ActionIcon>
      </Group>
      <AreaChart
        h={300}
        data={data}
        dataKey="date"
        series={[
          { name: "Apples", color: "indigo.6" },
          { name: "Oranges", color: "blue.6" },
          { name: "Tomatoes", color: "teal.6" }
        ]}
        strokeWidth={2.2}
      />
    </Paper>
  );
};

export default RevenueChart;
