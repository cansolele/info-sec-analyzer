import { createTheme } from "@mui/material/styles";

const commonColors = {
  textTitle: "#FFF",
  greenButton: {
    main: "green",
    hover: "darkgreen",
  },
};

const themeOptions = {
  primary: {
    light: "#3f51b5",
    dark: "#366096",
  },
  secondary: {
    light: "#f50057",
    dark: "#24344d",
  },
  background: {
    light: {
      default: "#fafafa",
      paper: "#ebebeb",
    },
    dark: {
      default: "#192231",
      paper: "#24344d",
    },
  },
};

const createCustomTheme = (mode) => {
  const paletteMode = mode === "dark" ? "dark" : "light";

  return createTheme({
    palette: {
      mode: paletteMode,
      primary: {
        main: themeOptions.primary[paletteMode],
      },
      secondary: {
        main: themeOptions.secondary[paletteMode],
      },
      background: themeOptions.background[paletteMode],
      text: {
        title: commonColors.textTitle,
      },
      greenButton: commonColors.greenButton,
    },
  });
};

const Theme = ({ mode }) => createCustomTheme(mode);

export default Theme;
