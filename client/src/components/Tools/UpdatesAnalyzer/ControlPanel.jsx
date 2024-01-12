import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import config from "../../../config";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import style from "./ControlPanel.module.css";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import FileOpenIcon from "@mui/icons-material/FileOpen";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const ControlPanel = React.memo(({ currentLanguage, setScanInfo, socket }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);
  const handleFileChange = useCallback(({ target }) => {
    setFile(target.files[0]);
  }, []);
  const fetchReportHistory = async () => {
    try {
      const response = await axios.get(
        `${config.apiURL}/updates/report-history`
      );
      if (response.status === 200) {
        setReportHistory(response.data.reverse());
      } else {
        throw new Error(`Failed to fetch, status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching file history:", error);
    }
  };
  useEffect(() => {
    fetchReportHistory();
    if (socket) {
      socket.on("reportHistoryUpdated", fetchReportHistory);
      return () => {
        socket.off("reportHistoryUpdated", fetchReportHistory);
      };
    }
  }, [socket]);
  const fetchReportData = async (filename) => {
    try {
      const response = await axios.get(
        `${config.apiURL}/updates/get-report/${filename}`
      );
      if (response.status === 200) {
        setScanInfo(response.data);
      } else {
        console.error(`Failed to fetch report data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const handleReportClick = (filename) => {
    fetchReportData(filename);
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post(
          `${config.apiURL}/updates/make-updates-analysis`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setScanInfo(response.data);
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    },
    [file]
  );
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 1,
        borderRadius: 2,
      }}
      className={style.control_panel}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
      <form onSubmit={handleSubmit}>
        {file ? (
          <Typography variant="body1" sx={{ mt: 1, textAlign: "center" }}>
            {currentLanguage === "ENG"
              ? `Uploaded File: ${file.name}`
              : `Загруженный файл: ${file.name}`}
          </Typography>
        ) : (
          <Typography vvariant="body1" sx={{ mt: 1, textAlign: "center" }}>
            {currentLanguage === "ENG"
              ? "No file uploaded"
              : "Файл не загружен"}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              disabled={isLoading}
            >
              {currentLanguage === "ENG" ? "Upload" : "Загрузить"}
              <VisuallyHiddenInput
                type="file"
                accept=".xml"
                onChange={handleFileChange}
              />
            </Button>
            <Button
              type="submit"
              disabled={!file || isLoading}
              variant="contained"
              endIcon={isLoading ? <HourglassBottomIcon /> : <SendIcon />}
              sx={{ ml: 2 }}
            >
              {isLoading
                ? currentLanguage === "ENG"
                  ? "Processing..."
                  : "Обработка..."
                : currentLanguage === "ENG"
                ? "Process"
                : "Обработать"}
            </Button>
          </Box>
        </Box>
      </form>
      <Typography
        sx={{ textAlign: "center", mt: 2, fontWeight: "bold" }}
        variant="h6"
      >
        {currentLanguage === "ENG" ? "Report History" : "История отчетов"}
      </Typography>

      <Box className={style.file_history_list}>
        <List>
          {reportHistory.length > 0 ? (
            reportHistory.map((report, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  onClick={() => handleReportClick(report.filename)}
                >
                  <ListItemText
                    primary={report.report_name}
                    secondary={report.time}
                  />
                  <FileOpenIcon style={{ marginLeft: "auto" }} />
                </ListItem>
                {index < reportHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Typography sx={{ textAlign: "center" }}>
              {currentLanguage === "ENG"
                ? "No reports found"
                : "Отчеты не найдены"}
            </Typography>
          )}
        </List>
      </Box>
    </Box>
  );
});

export default ControlPanel;
