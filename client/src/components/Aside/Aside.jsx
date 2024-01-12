import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";
import exploit_icon from "./icons/exploit_icon.png";
import vulnerability_icon from "./icons/vulnerability_icon.png";
import updates_icon from "./icons/updates_icon.png";
import style from "./Aside.module.css";

const buttons = [
  { id: "/exploits-table", icon: exploit_icon, label: "Exploits table" },
  {
    id: "/vulnerability-analyzer",
    icon: vulnerability_icon,
    label: "Vulnerability analyzer",
  },
  { id: "/updates-analyzer", icon: updates_icon, label: "Updates analyzer" },
];

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
    width: "60px",
    height: "60px",
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
      {buttons.map(({ id, icon, label }) => (
        <React.Fragment key={id}>
          <IconButton
            sx={{ ...styleButton(id), marginTop: 0 }}
            onClick={() => handleButtonClick(id)}
          >
            <img className={style.icon} src={icon} alt={`${label} icon`} />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: "center", color: "text.title", fontSize: 11 }}
          >
            {label}
          </Typography>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default Aside;
