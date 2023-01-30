/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { type Palette, type ThemeOptions } from "@mui/material/styles";

/**
 * Style overrides for Material UI components.
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const components = (palette: Palette): ThemeOptions["components"] => ({
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "unset",
      },
      contained: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
      },
    },
  },

  MuiButtonBase: {
    styleOverrides: {
      root: {
        border: "#4e4e4e !important",
      },
    },
  },

  // MuiPaper: {
  //   styleOverrides: {
  //     root: {
  //       border: "#4e4e4e !important",
  //     },
  //   },
  // },

  MuiButtonGroup: {
    styleOverrides: {
      root: {
        boxShadow: "none",
      },
    },
  },
});
