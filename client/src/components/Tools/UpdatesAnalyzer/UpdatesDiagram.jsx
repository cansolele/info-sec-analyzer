import React, { useMemo } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Box } from "@mui/material";

const riskColors = {
  Critical: "#87171a",
  High: "#cc0000",
  Medium: "#f5770f",
  Low: "#00705c",
  Unavailable: "#696969",
};

const UpdatesDiagram = ({ updatesData, currentLanguage, percent }) => {
  const riskLevels = {
    Critical: currentLanguage === "ENG" ? "Critical" : "Критические",
    High: currentLanguage === "ENG" ? "High" : "Высокие",
    Medium: currentLanguage === "ENG" ? "Medium" : "Средние",
    Low: currentLanguage === "ENG" ? "Low" : "Низкие",
    Unavailable: currentLanguage === "ENG" ? "Unavailable" : "Недоступные",
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
    </Box>
  );
};

export default UpdatesDiagram;
