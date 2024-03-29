import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { useLocation, useNavigate } from "react-router-dom";

import style from "./Header.module.css";
import config from "../../config";

const titles = {
  "/": "InfoSec Analyzer",
  "/exploits-table": "Exploits table",
  "/vulnerability-analyzer": "Vulnerability analyzer",
  "/updates-analyzer": "Updates analyzer",
};

const Header = ({ mode, setMode, currentLanguage, setCurrentLanguage }) => {
  const [modalWindow, setModalWindow] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const location = useLocation();

  const toggleColorMode = () => setMode(mode === "dark" ? "light" : "dark");
  const handleClose = () => setModalWindow(false);
  const toggleLanguage = () =>
    setCurrentLanguage(currentLanguage === "ENG" ? "RU" : "ENG");

  const handleSubmit = async () => {
    try {
      const url = `${config.apiURL}/about`;
      const payload = { tool: location.pathname };
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      };

      const response = await fetch(url, options);
      const data = await response.text();
      setModalDescription(data);
      setModalWindow(true);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <Box sx={{ bgcolor: "primary.main" }} className={style.header}>
      <Typography sx={{ color: "text.title", fontSize: "30px" }}>
        {titles[location.pathname] || "Page Title"}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{ position: "absolute", right: 0 }}
      >
        <Button onClick={toggleLanguage}>
          <Typography sx={{ color: "text.title", fontSize: "20px" }}>
            {currentLanguage}
          </Typography>
        </Button>
        <IconButton size="20px" onClick={toggleColorMode} color="inherit">
          {mode === "dark" ? (
            <Brightness7Icon fontSize="20px" />
          ) : (
            <Brightness4Icon fontSize="20px" htmlColor="white" />
          )}
        </IconButton>
        <IconButton size="20px" onClick={handleSubmit} color="inherit">
          <QuestionMarkIcon fontSize="20px" htmlColor="white" />
        </IconButton>
      </Stack>

      <Modal open={modalWindow} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
            }}
            variant="h6"
            component="h2"
          >
            {titles[location.pathname]}
          </Typography>
          <Typography sx={{ mt: 2 }}>{modalDescription}</Typography>
        </Box>
      </Modal>
    </Box>
  );
};
export default Header;
