import { PaperProps, SimpleGrid, Skeleton } from "@mantine/core";
import { FC, ReactNode } from "react";
import StatsCard from "./StatsCard";
import classes from "./StatsGrid.module.css";
import { ErrorAlert } from "../common";

type Props = {
  data?: { title: string; value: string; diff: number; period?: string }[];
  paperProps?: PaperProps;
  error?: ReactNode;
  loading?: boolean;
};

const StatsGrid: FC<Props> = ({ data, loading, error, paperProps }) => {
  const stats = data?.map((stat) => <StatsCard key={stat.title} data={stat} {...paperProps} />);

  return (
    <div className={classes.root}>
      {error ? (
        <ErrorAlert title="Error loading stats" message={error.toString()} />
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: "md", md: "lg", xl: 24 }}
          verticalSpacing={{ base: "md", md: "lg", xl: 24 }}>
          {loading
            ? Array.from({ length: 4 }).map((o, i) => (
                <Skeleton key={`stats-loading-${i}`} visible={true} height={200} />
              ))
            : stats}
        </SimpleGrid>
      )}
    </div>
  );
};

export default StatsGrid;
