import React, { useState, useEffect } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Aside from "./components/Aside/Aside";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Theme from "./Theme";
import MainPage from "./components/MainPage/MainPage";
import ExploitsTable from "./components/Tools/ExploitsTable/ExploitsTable";
import VulnerabilityAnalyzer from "./components/Tools/VulnerabilityAnalyzer/VulnerabilityAnalyzer";
import { io } from "socket.io-client";
import config from "./config";
import "./App.css";

const App = () => {
  const [mode, setMode] = useState(
    () => localStorage.getItem("mode") || "dark"
  );
  const [currentLanguage, setCurrentLanguage] = useState(
    () => localStorage.getItem("language") || "ENG"
  );
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect(config.apiURL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("language", currentLanguage);
  }, [currentLanguage]);

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
          <Route path="/" element={<MainPage />} />
          <Route
            path="/exploits-table"
            element={
              <ExploitsTable
                socket={socket}
                currentLanguage={currentLanguage}
              />
            }
          />
          <Route
            path="/vulnerability-analyzer"
            element={
              <VulnerabilityAnalyzer currentLanguage={currentLanguage} />
            }
          />
        </Routes>
        <Footer currentLanguage={currentLanguage} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
