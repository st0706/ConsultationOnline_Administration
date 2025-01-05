import { Badge, MantineColor, Table } from "@mantine/core";

type Status = "In Progress" | "Cancelled" | "Completed" | "Pending" | string;

const StatusBadge = ({ status }: { status: Status }) => {
  let color: MantineColor = "";

  switch (status) {
    case "In Progress":
      color = "blue";
      break;
    case "Cancelled":
      color = "red";
      break;
    case "Completed":
      color = "green";
      break;
    case "Pending":
      color = "orange";
      break;
    default:
      color = "gray";
  }

  return (
    <Badge color={color} variant="light" radius="sm">
      {status}
    </Badge>
  );
};

type ProjectItem = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  state: Status;
  assignee: string;
};

const ProjectsTable = () => {
  const items: ProjectItem[] = [
    {
      id: "2cfb8640-4c4e-431d-a02a-24f103027ecb",
      name: "Lueilwitz LLC",
      start_date: "2/2/2023",
      end_date: "3/24/2023",
      state: "In Progress",
      assignee: "Courtnay Goymer"
    },
    {
      id: "a5fc92d3-73da-4be3-b94e-ea9b81c6a2fb",
      name: "Lang, Little and Barton",
      start_date: "5/25/2022",
      end_date: "11/20/2023",
      state: "In Progress",
      assignee: "Kirby Castillou"
    },
    {
      id: "2d745034-d666-4626-a1c6-9288954c0433",
      name: "Haag-Abbott",
      start_date: "7/16/2022",
      end_date: "6/21/2023",
      state: "In Progress",
      assignee: "Curr Tetley"
    },
    {
      id: "0a3c4806-426b-4f62-8173-6dbcb6bfa319",
      name: "Bogisich Inc",
      start_date: "5/14/2023",
      end_date: "2/4/2023",
      state: "Cancelled",
      assignee: "Jilli Lunt"
    },
    {
      id: "9d1b4342-89ab-457b-905d-48557fc5e7ef",
      name: "Hahn-Littel",
      start_date: "11/21/2022",
      end_date: "11/21/2022",
      state: "Completed",
      assignee: "Lilllie Liley"
    },
    {
      id: "60ef7bd7-6c40-4844-be4b-2a4dd976e0ab",
      name: "Gibson and Sons",
      start_date: "7/6/2023",
      end_date: "6/11/2023",
      state: "Cancelled",
      assignee: "Farlie Rouchy"
    }
  ];

  return (
    <Table.ScrollContainer minWidth={500}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Start date</Table.Th>
            <Table.Th>End date</Table.Th>
            <Table.Th>State</Table.Th>
            <Table.Th>Assignee</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td>{item.start_date}</Table.Td>
              <Table.Td>{item.end_date}</Table.Td>
              <Table.Td>
                <StatusBadge status={item.state} />
              </Table.Td>
              <Table.Td>{item.assignee}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default ProjectsTable;
