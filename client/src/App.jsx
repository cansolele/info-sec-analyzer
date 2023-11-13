import React, { useState, useEffect } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Aside from "./components/Aside/Aside";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Theme from "./Theme";
import useSocket from "./hooks/useSocket";
import { useLocalStorage } from "./hooks/useLocalStorage";
import routes from "./routes";
import "./App.css";

const App = () => {
  const [mode, setMode] = useLocalStorage("mode", "dark");
  const [currentLanguage, setCurrentLanguage] = useLocalStorage(
    "language",
    "ENG"
  );
  const socket = useSocket();

  return (
    <ThemeProvider theme={Theme({ mode })}>
      <CssBaseline />
      <Box className="app">
        <Header
          mode={mode}
          setMode={setMode}
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
        />
        <Aside />
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={React.createElement(route.component, {
                socket,
                currentLanguage,
              })}
            />
          ))}
        </Routes>
        <Footer currentLanguage={currentLanguage} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
