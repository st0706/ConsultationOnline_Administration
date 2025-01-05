"use client";

import { LetterAvatar } from "@/components/common";
import useModal, { DeleteAction } from "@/hooks/useModal";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { TreeNode } from "@/types/base";
import { Box, Button, Card, Divider, Grid, Group, LoadingOverlay, Menu, Stack, Text, rem } from "@mantine/core";
import { IconCaretDown, IconCaretRight, IconCirclePlus, IconEdit, IconFilePlus, IconFileX } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NodeRendererProps, Tree } from "react-arborist";
import classes from "./style.module.css";
import OrganizationForm from "./OrganizationForm";

export default function TreeViewOrganizations() {
  const { t } = useTranslation("system");
  const ORGANIZATION = t("resource.organization");
  const CHILD_ORGANIZATION = t("organization.childName");
  const HOSPITAL = t("organization.rootName");
  const { confirmDelete } = useModal();
  const { notifyResult } = useNotify();

  const context = api.useUtils();
  const { mutateAsync: deleteOrganization, isLoading: isLoadingDelete } = api.organization.delete.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Delete, ORGANIZATION, true);
    },
    onError: (e) => {
      notifyResult(Action.Delete, ORGANIZATION, false, e.message);
    }
  });

  const handleDelete = async (organizationId) => {
    if (organizationId) {
      const objId = {
        id: organizationId
      };
      await deleteOrganization(objId);
    }
  };

  const [showViewDetail, setshowViewDetail] = useState<boolean>(false);
  const [organizationId, setOrganizationId] = useState<string>("");
  const [dataTarget, setDataTarget] = useState<TreeNode | null>(null);
  const [opened, setOpened] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0
  });

  useEffect(() => {
    const handleClick = () => setOpened(false);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  let { data: treeData, isLoading, isFetching } = api.organization.getTreeData.useQuery();

  let {
    data: detailOrganization,
    isLoading: isLoadingOrganization,
    isFetching: isFetchingOrganization
  } = api.organization.get.useQuery({
    id: organizationId
  });

  const handleOnRightClick = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    setOpened(true);
    setPoints({
      x: e.pageX,
      y: e.pageY
    });
    setDataTarget(node);
  };

  const handleCloseModal = () => {
    setOrganizationId("");
    setshowViewDetail(false);
  };

  function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
    return (
      <Grid
        onContextMenu={(e) => handleOnRightClick(e, node.data)}
        gutter="xs"
        style={style}
        className={`${classes.node} ${node.isSelected ? classes.nodeSelected : classes.nodeHover}`}
        // ref={dragHandle}
        onClick={() => {
          node.toggle();
          setshowViewDetail(true);
          setOrganizationId(node.data.id);
        }}>
        <Grid.Col span={2}>{!node.isLeaf && (node.isOpen ? <IconCaretDown /> : <IconCaretRight />)}</Grid.Col>
        <Grid.Col span={10}>{node.data.name}</Grid.Col>
      </Grid>
    );
  }

  return (
    <>
      <LoadingOverlay visible={isLoadingDelete || isLoading || isFetching} />
      <Box p="md">
        <Group justify="space-between" mb={20}>
          <Stack gap="xs">
            <Text c="dimmed" size="sm">
              {t("organization.descriptionTreeView", { object: ORGANIZATION })}
            </Text>
          </Stack>
          <Button component="a" href="organization/create" color="teal" leftSection={<IconCirclePlus size={18} />}>
            {t("addNew")}
          </Button>
        </Group>
        <Card radius={"xs"} withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }}>
              <Tree
                width="100%"
                data={treeData}
                indent={24}
                rowHeight={36}
                paddingTop={30}
                paddingBottom={10}
                padding={25}>
                {Node}
              </Tree>
              <Menu opened={opened} onChange={setOpened} shadow="md" width={200}>
                <Menu.Dropdown style={{ top: `${points.y}px`, left: `${points.x}px` }}>
                  <Menu.Item leftSection={<IconFilePlus style={{ width: rem(14), height: rem(14) }} />}>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      href={{
                        pathname: `organization/create`,
                        query: {
                          organizationId: dataTarget?.id
                        }
                      }}>
                      {t("addNewTitle", { object: CHILD_ORGANIZATION })}
                    </Link>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      href={{
                        pathname: `organization/update`,
                        query: {
                          organizationId: dataTarget?.id
                        }
                      }}>
                      {t("editTitle", { object: ORGANIZATION })}
                    </Link>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    onClick={() =>
                      confirmDelete(
                        ORGANIZATION,
                        () => handleDelete(dataTarget?.id),
                        dataTarget?.name!,
                        DeleteAction.Delete,
                        t("organization.warningdelete", { object: ORGANIZATION })
                      )
                    }
                    leftSection={<IconFileX style={{ width: rem(14), height: rem(14) }} />}>
                    {t("deleteTitle", { object: ORGANIZATION })}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Divider orientation="horizontal" hiddenFrom="md"></Divider>
            </Grid.Col>
            <Divider orientation="vertical" visibleFrom="md" />
            <Grid.Col span={{ base: 12, md: 8.5, lg: 8.5 }}>
              {showViewDetail && (
                <>
                  {organizationId.length > 0 && (
                    <Box>
                      {(isLoadingOrganization || isFetchingOrganization) && <LoadingOverlay />}
                      <Text mb={"lg"} fw={700} ta="center" size="xl">
                        {t("viewDetails")} {detailOrganization?.name}
                      </Text>
                      <Stack ml={50} justify="center">
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            {t("organization.nameTable")} :{" "}
                          </Text>
                          <Text size="lg">{detailOrganization?.name}</Text>
                        </Group>
                        <Group gap={100} align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            {t("organization.logo")} :{" "}
                          </Text>
                          <LetterAvatar size={70} name={detailOrganization?.name!} url={detailOrganization?.logo} />
                        </Group>
                        {/* <Group align="center" justify="flex-start">
                        <Text fw={700} ta="center">
                          Số điện thoại:{" "}
                        </Text>
                        <Text size="lg">{organization?.contact[0].telecom[0]?.value}</Text>
                      </Group>
                      <Group align="center" justify="flex-start">
                        <Text fw={700} ta="center">
                          Địa chỉ:{" "}
                        </Text>
                        <Text size="lg">
                          {organization.contact[0]?.address[0]?.line[0]}{" "}
                          {organization.contact[0]?.address[0]?.district &&
                            `- ${organization.contact[0]?.address[0]?.district}`}{" "}
                          {organization.contact[0]?.address[0]?.city &&
                            `- ${organization.contact[0]?.address[0]?.city}`}{" "}
                          {organization.contact[0]?.address[0]?.city &&
                            `- ${organization.contact[0]?.address[0]?.city}`}{" "}
                          {organization.contact[0]?.address[0]?.country &&
                            `- ${organization.contact[0]?.address[0]?.country}`}
                        </Text>
                      </Group> */}
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            {t("organization.alias")} :{" "}
                          </Text>
                          <Text size="lg">{detailOrganization?.alias}</Text>
                        </Group>
                        <Group align="center" justify="flex-start">
                          <Text fw={700} ta="center">
                            {t("organization.website")} :{" "}
                          </Text>
                          <Text size="lg">{detailOrganization?.website}</Text>
                        </Group>
                      </Stack>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "5rem"
                        }}>
                        <Button size="md" onClick={() => handleCloseModal()} justify="center" my={15} variant="default">
                          {t("close")}
                        </Button>
                      </div>
                    </Box>
                  )}
                </>
              )}
            </Grid.Col>
          </Grid>
        </Card>
      </Box>
    </>
  );
}
