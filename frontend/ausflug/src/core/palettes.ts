/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

/*
To add colors to the palette, add to the color to one of the objects below in both the light and dark themes.
Then, add the color to the corresponding object in the "declare module" section at the bottom of the file.
To use the color, use the color as so:
      <Box
        bgcolor="example.tertiary"
      >
*/

import { type PaletteOptions } from "@mui/material/styles";

const specialLinearGradient =
  "linear-gradient(84.8deg, #592CD1 0.94%, #F37D92 103.59%)";

export const light: PaletteOptions = {
  mode: "light",

  primary: {
    main: "rgb(24,119,242)",
  },

  background: {
    default: "rgb(240,242,245)",
  },

  special: {
    background: specialLinearGradient,
    fontWeight: 800,
  },

  fill: {
    lighter: "#dce7f3",
  },

  example: {
    primary: "#49b4ff",
    secondary: "#ef3054",
  },
};

export const dark: PaletteOptions = {
  mode: "dark",

  primary: {
    main: "rgb(1, 145, 211)",
  },

  background: {
    default: "rgb(24,25,26)",
  },

  special: {
    background: specialLinearGradient,
    fontWeight: 800,
  },

  fill: {
    lighter: "#0c45ad",
  },

  example: {
    primary: "#484848",
    secondary: "#484848",
  },
};

export const palettes = { light, dark };

/**
 * Append custom variables to the palette object.
 * https://mui.com/material-ui/customization/theming/#custom-variables
 */
declare module "@mui/material/styles" {
  interface Palette {
    fill: {
      lighter: string;
    };

    special: {
      background: string;
      fontWeight: number;
    };

    example: {
      primary: string;
      secondary: string;
    };
  }

  interface PaletteOptions {
    fill: {
      lighter: string;
    };

    special: {
      background: string;
      fontWeight: number;
    };

    example: {
      primary: string;
      secondary: string;
    };
  }
}
