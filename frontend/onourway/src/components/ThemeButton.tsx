/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, IconButtonProps, type PaletteMode } from "@mui/material";
import { useTheme, createTheme } from "@mui/material/styles";
import { atom, selectorFamily, useRecoilCallback } from "recoil";
import { palettes } from "../core/palettes";

/**
 * The name of the selected UI theme.
 */
export const ThemeName = atom<PaletteMode>({
  key: "ThemeName",
  effects: [
    (ctx) => {
      const storageKey = "theme";

      if (ctx.trigger === "get") {
        const name: PaletteMode =
          localStorage?.getItem(storageKey) === "dark"
            ? "dark"
            : localStorage?.getItem(storageKey) === "light"
            ? "light"
            : matchMedia?.("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        ctx.setSelf(name);
      }

      ctx.onSet((value) => {
        localStorage?.setItem(storageKey, value);
      });
    },
  ],
});

/**
 * The customized Material UI theme.
 * @see https://next.material-ui.com/customization/default-theme/
 */
export const Theme = selectorFamily({
  key: "Theme",
  dangerouslyAllowMutability: true,
  get(name: PaletteMode) {
    return function () {
      const { palette } = createTheme({ palette: palettes[name] });
      return createTheme({
        palette,
      });
    };
  },
});

/**
 * Switches between "light" and "dark" themes.
 */
export function useToggleTheme(name?: PaletteMode) {
  return useRecoilCallback(
    (ctx) => () => {
      ctx.set(
        ThemeName,
        name ?? ((prev) => (prev === "dark" ? "light" : "dark"))
      );
    },
    []
  );
}

function ThemeButton(props: ThemeButtonProps): JSX.Element {
  const { ...other } = props;
  const toggleTheme = useToggleTheme();
  const theme = useTheme();

  return (
    <IconButton onClick={toggleTheme} {...other}>
      {theme.palette.mode === "light" ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
}

type ThemeButtonProps = Omit<IconButtonProps, "children">;

export { ThemeButton };
