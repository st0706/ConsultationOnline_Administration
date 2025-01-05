"use client";

import { BarChart } from "@mantine/charts";
import { ActionIcon, Group, Paper, PaperProps, Text } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { FC } from "react";

const MobileDesktopChart: FC<PaperProps> = ({ ...others }) => {
  const data = [
    { month: "January", Smartphones: 120, Laptops: 80, Tablets: 10 },
    { month: "February", Smartphones: 90, Laptops: 120, Tablets: 40 },
    { month: "March", Smartphones: 40, Laptops: 100, Tablets: 20 },
    { month: "April", Smartphones: 100, Laptops: 20, Tablets: 80 },
    { month: "May", Smartphones: 80, Laptops: 140, Tablets: 120 },
    { month: "June", Smartphones: 75, Laptops: 60, Tablets: 100 }
  ];

  return (
    <Paper {...others}>
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Mobile/Desktop
        </Text>
        <ActionIcon size="lg" radius="xl" variant="subtle" color="gray">
          <IconDotsVertical size={18} />
        </ActionIcon>
      </Group>
      <BarChart
        h={300}
        data={data}
        dataKey="month"
        series={[
          { name: "Smartphones", color: "violet.6" },
          { name: "Laptops", color: "blue.6" },
          { name: "Tablets", color: "teal.6" }
        ]}
        tickLine="y"
      />
    </Paper>
  );
};

export default MobileDesktopChart;
