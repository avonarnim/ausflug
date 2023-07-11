/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { TypographyVariantsOptions } from "@mui/material/styles";

export const options: TypographyVariantsOptions = {
  fontFamily: [
    `-apple-system`,
    `"BlinkMacSystemFont"`,
    `"Segoe UI"`,
    `"Roboto"`,
    `"Oxygen"`,
    `"Ubuntu"`,
    `"Cantarell"`,
    `"Fira Sans"`,
    `"Droid Sans"`,
    `"Helvetica Neue"`,
    `sans-serif`,
  ].join(","),
};

export const overrides: TypographyVariantsOptions = {
  h1: { fontSize: "4rem" },
  h2: { fontSize: "3rem" },
  h3: { fontSize: "2.5rem" },
  h4: { fontSize: "2.3rem" },
  h5: { fontSize: "2rem" },
  h6: { fontSize: "1.5rem" },
  button: { textTransform: "none" },
};
