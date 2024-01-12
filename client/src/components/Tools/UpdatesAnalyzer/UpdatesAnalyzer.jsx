import React, { useState } from "react";
import { Box } from "@mui/material";
import style from "./UpdatesAnalyzer.module.css";
import ControlPanel from "./ControlPanel";
import UpdatesReport from "./UpdatesReport";

const UpdatesAnalyzer = React.memo(({ currentLanguage, socket }) => {
  const [scanInfo, setScanInfo] = useState(null);

  return (
    <Box className={style.updates_analyzer}>
      <ControlPanel
        currentLanguage={currentLanguage}
        setScanInfo={setScanInfo}
        scanInfo={scanInfo}
        socket={socket}
      />
      <UpdatesReport scanInfo={scanInfo} currentLanguage={currentLanguage} />
    </Box>
  );
});
export default UpdatesAnalyzer;
