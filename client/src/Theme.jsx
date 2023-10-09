import { createTheme } from "@mui/material/styles";

const themeOptions = {
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#fafafa",
      paper: "#fff",
    },
    text: {
      title: "#FFF",
    },
  },
};

const createCustomTheme = (mode) => {
  const primaryMain = mode === "dark" ? "#366096" : "#3f51b5";
  const secondaryMain = mode === "dark" ? "#24344d" : "#f50057";
  const backgroundDefault = mode === "dark" ? "#192231" : "#fafafa";
  const backgroundPaper = mode === "dark" ? "#24344d" : "#ebebeb";
  const textTitle = "#FFF";

  const palette = {
    ...themeOptions.palette,
    mode,
    primary: {
      ...themeOptions.palette.primary,
      main: primaryMain,
    },
    secondary: {
      ...themeOptions.palette.secondary,
      main: secondaryMain,
    },
    background: {
      ...themeOptions.palette.background,
      default: backgroundDefault,
      paper: backgroundPaper,
    },
    text: {
      ...themeOptions.palette.text,
      title: textTitle,
    },
    greenButton: {
      main: "green",
      hover: "darkgreen",
    },
  };

  return createTheme({ palette });
};

const Theme = ({ mode }) => createCustomTheme(mode);

export default Theme;
