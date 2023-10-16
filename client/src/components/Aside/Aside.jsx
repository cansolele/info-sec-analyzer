import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";
import exploit_icon from "./icons/exploit_icon.png";
import vulnerability_icon from "./icons/vulnerability_icon.png";
import style from "./Aside.module.css";

const Aside = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(location.pathname);

  useEffect(() => {
    setActiveButton(location.pathname);
  }, [location]);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    navigate(buttonId);
  };

  const styleButton = (path) => ({
    width: "70px",
    height: "70px",
    padding: 0,
    borderRadius: 0,
    margin: "10px auto",
    marginBottom: 0,
    ...(activeButton === path && {
      border: "3px solid",
      borderColor: "secondary.main",
    }),
  });

  return (
    <Box sx={{ bgcolor: "primary.main" }} className={style.aside}>
      <IconButton
        sx={{
          ...styleButton("/exploits-table"),
          marginTop: 0,
        }}
        onClick={() => handleButtonClick("/exploits-table")}
      >
        <img className={style.icon} src={exploit_icon} alt="exploits icon" />
      </IconButton>
      <Typography
        variant="subtitle1"
        sx={{ textAlign: "center", color: "text.title", fontSize: 12 }}
      >
        Exploits table
      </Typography>
      <IconButton
        sx={{
          ...styleButton("/vulnerability-analyzer"),
          marginTop: 0,
        }}
        onClick={() => handleButtonClick("/vulnerability-analyzer")}
      >
        <img
          className={style.icon}
          src={vulnerability_icon}
          alt="vulnerability icon"
        />
      </IconButton>
      <Typography
        variant="subtitle1"
        sx={{ textAlign: "center", color: "text.title", fontSize: 12 }}
      >
        Vulnerability analyzer
      </Typography>
    </Box>
  );
};

export default Aside;
