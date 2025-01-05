import { TreeNode } from "@/types/base";

export const buildTreeData = (data: any, partOfId: string | null = null): TreeNode[] => {
  const tree: TreeNode[] = [];
  data.forEach((item) => {
    if (item.partOfId === partOfId || (partOfId === null && item.partOfId === "null")) {
      const children = buildTreeData(data, item.id);
      const node: TreeNode = {
        id: item.id,
        name: item.name
      };
      if (children.length > 0) {
        node.children = children;
      }
      tree.push(node);
    }
  });
  return tree;
};
