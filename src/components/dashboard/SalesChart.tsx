"use client";

import { DonutChart } from "@mantine/charts";
import { ActionIcon, Group, Paper, PaperProps, Stack, Table, Text } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { FC } from "react";

const SalesChart: FC<PaperProps> = ({ ...others }) => {
  const items = [
    {
      id: 10,
      source: "Lajo",
      revenue: "$28.13",
      value: 54.5
    },
    {
      id: 11,
      source: "Gabtune",
      revenue: "$88.04",
      value: 62.0
    },
    {
      id: 12,
      source: "Shufflebeat",
      revenue: "$20.26",
      value: 26.0
    },
    {
      id: 13,
      source: "Chatterpoint",
      revenue: "$35.00",
      value: 57.8
    }
  ];

  const data = [
    { name: "USA", value: 400, color: "indigo.6" },
    { name: "India", value: 300, color: "yellow.6" },
    { name: "Japan", value: 100, color: "teal.6" },
    { name: "Other", value: 200, color: "gray.6" }
  ];

  return (
    <Paper {...others}>
      <Group justify="space-between" mb="md">
        <Text size="lg" fw={600}>
          Weekly Sales
        </Text>
        <ActionIcon size="lg" radius="xl" variant="subtle" color="gray">
          <IconDotsVertical size={18} />
        </ActionIcon>
      </Group>
      <Stack align="center">
        <DonutChart withLabelsLine withLabels data={data} chartLabel="Revenue" />
      </Stack>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Source</Table.Th>
            <Table.Th>Revenue</Table.Th>
            <Table.Th>Value</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((items) => (
            <Table.Tr key={items.source}>
              <Table.Td>{items.source}</Table.Td>
              <Table.Td>{items.revenue}</Table.Td>
              <Table.Td>{items.value}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
};

export default SalesChart;
