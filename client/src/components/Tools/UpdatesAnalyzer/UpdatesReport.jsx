import React from "react";
import { Box, Typography } from "@mui/material";
import UpdatesTable from "./UpdatesTable";
import UpdatesDiagram from "./UpdatesDiagram";
import ProductTable from "./ProductTable";
import style from "./UpdatesReport.module.css";
const UpdatesReport = React.memo(({ currentLanguage, scanInfo }) => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 1,
        borderRadius: 2,
      }}
      className={style.updates_report}
    >
      {scanInfo ? (
        <Box className={style.updates_report_content}>
          <Typography variant="body1">
            {currentLanguage === "ENG"
              ? "An update audit is a process in which the status of general system and application software updates, deployed in the information system, is analyzed. This type of audit is significant in the process of ensuring information security, as most code vulnerabilities are eliminated by installing missing security updates."
              : "Аудит обновлений представляет собой процесс, в ходе которого анализируется статус обновлений общесистемного и прикладного программного обеспечения, развернутых в информационной системе. Этот вид аудита является значимым в процессе обеспечения безопасности информации, так как большинство уязвимостей кода устраняются путем установки недостающих обновлений безопасности."}
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {currentLanguage === "ENG"
                ? "Creation time: "
                : "Формирование отчета: "}
            </Box>
            {scanInfo.creation_time}
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {currentLanguage === "ENG"
                ? "Start/End Scan: "
                : "Начало/завершение сканирования: "}
            </Box>
            {`${scanInfo.start_time} / ${scanInfo.end_time}`}
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {currentLanguage === "ENG" ? "Hosts: " : "Хосты: "}
            </Box>
            {scanInfo.target_hosts}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
            {currentLanguage === "ENG"
              ? "Table of Updates Distribution by Hosts"
              : "Таблица распределения обновлений по хостам"}
          </Typography>

          <UpdatesTable
            currentLanguage={currentLanguage}
            updatesData={scanInfo.updates}
          />
          <Typography variant="body1" sx={{ mt: 5, mb: 1, fontWeight: "bold" }}>
            {currentLanguage === "ENG"
              ? "Table of Updates Distribution by Products"
              : "Таблица распределения обновлений по продуктам"}
          </Typography>

          <ProductTable
            currentLanguage={currentLanguage}
            updatesData={scanInfo.products}
          />
          <Typography variant="body1" sx={{ mt: 5, mb: 1, fontWeight: "bold" }}>
            {currentLanguage === "ENG"
              ? "Updates Distribution Diagram by Risk Levels"
              : "Диаграмма распределения обновлений по уровням риска"}
          </Typography>
          <UpdatesDiagram
            updatesData={scanInfo.updates}
            currentLanguage={currentLanguage}
            percent={scanInfo.percent}
          />
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {currentLanguage === "ENG"
              ? "Select or upload the RedCheck updates audit report"
              : "Выберите или загрузите отчёт аудита обновлений RedCheck"}
          </Typography>
        </Box>
      )}
    </Box>
  );
});

export default UpdatesReport;
