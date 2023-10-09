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

const Header = ({ mode, setMode, currentLanguage, setCurrentLanguage }) => {
  const [modalWindow, setModalWindow] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const titles = {
    "/": "InfoSec Analyzer",
    "/exploits-table": "Exploits table",
  };
  const toggleColorMode = () => {
    mode === "dark" ? setMode("light") : setMode("dark");
  };
  const toggleLanguage = () => {
    currentLanguage === "ENG"
      ? setCurrentLanguage("RU")
      : setCurrentLanguage("ENG");
  };
  const handleSubmit = async () => {
    const url = `${config.apiURL}/about`;

    const payload = {
      tool: location.pathname,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(url, options);
    const data = await response.text();
    setModalDescription(data);
    setModalWindow(true);
  };
  const handleClose = () => setModalWindow(false);

  return (
    <Box sx={{ bgcolor: "primary.main" }} className={style.header}>
      <Typography variant="h3" sx={{ color: "text.title" }}>
        {titles[location.pathname]}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{ position: "absolute", right: 0 }}
      >
        <Button onClick={toggleLanguage}>
          <Typography sx={{ color: "text.title", fontSize: "30px" }}>
            {currentLanguage}
          </Typography>
        </Button>
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === "dark" ? (
            <Brightness7Icon fontSize="large" />
          ) : (
            <Brightness4Icon fontSize="large" htmlColor="white" />
          )}
        </IconButton>
        <IconButton size="large" onClick={handleSubmit} color="inherit">
          <QuestionMarkIcon fontSize="large" htmlColor="white" />
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
