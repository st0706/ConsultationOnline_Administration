"use client";

import { ActionIcon, Button, createTheme, Modal, Pagination } from "@mantine/core";

export const themeAnPhat = createTheme({
  white: "#fff",
  black: "#343a40",
  colors: {
    purple: [
      "#efedff",
      "#dbd7fc",
      "#b3acf0",
      "#9E96EB",
      "#897fe6",
      "#786CE2",
      "#6658dd",
      "#4f3fd8",
      "#4333d6",
      "#3425bf"
    ]
  },
  primaryColor: "purple",
  defaultRadius: 4,
  focusRing: "always",
  fontFamily: "Open Sans, sans-serif",
  headings: {
    fontFamily: "Open Sans, sans-serif",
    sizes: {
      h1: {
        fontSize: "1.125rem",
        fontWeight: "500",
        lineHeight: "2.0"
      }
    }
  },
  fontSizes: {
    xs: "0.6875rem",
    sm: "0.875rem",
    md: "0.875rem",
    lg: "1.0rem",
    xl: "1.125rem"
  },
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "subtle"
      }
    }),
    Button: Button.extend({
      defaultProps: {
        fw: "normal"
      }
    }),
    Pagination: Pagination.extend({
      defaultProps: {
        radius: "xl",
        getControlProps: () => ({
          border: "none"
        }),
        getItemProps: () => ({
          border: "none"
        })
      }
    }),
    ModalTitle: Modal.Title.extend({
      defaultProps: {
        color: "red",
        fw: 500,
        fz: "var(--mantine-font-size-lg)"
      }
    })
  }
});
