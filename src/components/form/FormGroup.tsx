"use client";

import { Divider, DividerProps } from "@mantine/core";
import { FC } from "react";
import classes from "./FormGroup.module.css";
import clsx from "clsx";

const FormGroup: FC<DividerProps> = ({ labelPosition = "left", className, ...props }) => {
  return <Divider labelPosition={labelPosition} className={clsx(classes.divider, className)} {...props} />;
};

export default FormGroup;
