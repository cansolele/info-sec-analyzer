import React, { useMemo, useRef } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Box } from "@mui/material";
import { toPng } from "html-to-image";
import DownloadIcon from "@mui/icons-material/Download";
import { IconButton } from "@mui/material";

const riskColors = {
  Critical: "#87171a",
  High: "#cc0000",
  Medium: "#f5770f",
  Low: "#00705c",
  Unavailable: "#696969",
};

const UpdatesDiagram = ({ updatesData, currentLanguage, percent }) => {
  const boxRef = useRef(null);
  const riskLevels = {
    Critical: currentLanguage === "ENG" ? "Critical" : "Критические",
    High: currentLanguage === "ENG" ? "High" : "Высокие",
    Medium: currentLanguage === "ENG" ? "Medium" : "Средние",
    Low: currentLanguage === "ENG" ? "Low" : "Низкие",
    Unavailable: currentLanguage === "ENG" ? "Unavailable" : "Недоступные",
  };
  const downloadPng = () => {
    const boxElement = boxRef.current;
    const originalBackgroundColor = boxElement.style.backgroundColor;
    boxElement.style.backgroundColor = "white";
    const textElements = boxElement.querySelectorAll(
      " g.MuiChartsLegend-series > text"
    );
    const originalStyles = [];
    textElements.forEach((textElement, index) => {
      originalStyles[index] = textElement.getAttribute("style");
      textElement.style.fill = "black";
    });
    toPng(boxElement)
      .then((dataUrl) => {
        boxElement.style.backgroundColor = originalBackgroundColor;
        textElements.forEach((textElement, index) => {
          textElement.setAttribute("style", originalStyles[index]);
        });
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "updates diagram.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error("Could not download PNG", err);
        boxElement.style.backgroundColor = originalBackgroundColor;
        textElements.forEach((textElement, index) => {
          textElement.setAttribute("style", originalStyles[index]);
        });
      });
  };

  const chartData = useMemo(() => {
    return Object.keys(riskLevels).map((level) => ({
      value: Object.values(updatesData).reduce(
        (acc, hostData) => acc + hostData[level],
        0
      ),
      label: riskLevels[level] + " (" + percent[level] + "%)",
      color: riskColors[level],
    }));
  }, [updatesData, currentLanguage]);

  return (
    <Box
      ref={boxRef}
      position="relative"
      sx={{
        width: "1000px",
        height: "500px",
      }}
    >
      <PieChart
        series={[
          {
            arcLabel: (item) => `${item.value}`,
            arcLabelMinAngle: 15,
            innerRadius: 100,
            paddingAngle: 1,
            cornerRadius: 5,
            data: chartData,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "bold",
          },
        }}
      />
      <IconButton
        onClick={downloadPng}
        sx={{
          position: "absolute",
          top: -40,
          left: "45%",
        }}
      >
        <DownloadIcon />
      </IconButton>
    </Box>
  );
};

export default UpdatesDiagram;
