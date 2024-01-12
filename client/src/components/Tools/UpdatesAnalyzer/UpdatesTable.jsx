import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { orderBy } from "lodash";

const UpdatesTable = ({ updatesData, currentLanguage }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortKey, setSortKey] = useState("Total");
  const [sortOrder, setSortOrder] = useState("desc");

  const headerCells = [
    {
      id: "Critical",
      label: currentLanguage === "ENG" ? "Critical" : "Критические",
      color: "#87171a",
    },
    {
      id: "High",
      label: currentLanguage === "ENG" ? "High" : "Высокие",
      color: "#cc0000",
    },
    {
      id: "Medium",
      label: currentLanguage === "ENG" ? "Medium" : "Средние",
      color: "#f5770f",
    },
    {
      id: "Low",
      label: currentLanguage === "ENG" ? "Low" : "Низкие",
      color: "#00705c",
    },
    {
      id: "Unavailable",
      label: currentLanguage === "ENG" ? "Unavailable" : "Недоступные",
      color: "#696969",
    },
    {
      id: "Total",
      label: currentLanguage === "ENG" ? "Total" : "Всего",
      color: "#000000",
    },
  ];

  useEffect(() => {
    const sorted = orderBy(
      Object.keys(updatesData).map((host) => ({
        Host: host,
        ...updatesData[host],
        Total:
          updatesData[host].Critical +
          updatesData[host].High +
          updatesData[host].Medium +
          updatesData[host].Low +
          updatesData[host].Unavailable,
      })),
      sortKey,
      sortOrder
    );
    setSortedData(sorted);
  }, [updatesData, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const calculateTotalRow = () => {
    const totalRow = {
      Host: currentLanguage === "ENG" ? "Total" : "Всего",
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
      Unavailable: 0,
      Total: 0,
    };

    sortedData.forEach((row) => {
      totalRow.Critical += row.Critical;
      totalRow.High += row.High;
      totalRow.Medium += row.Medium;
      totalRow.Low += row.Low;
      totalRow.Unavailable += row.Unavailable;
      totalRow.Total += row.Total;
    });

    return totalRow;
  };

  const headerStyles = {
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
    padding: 0,
    borderBottom: "2px solid white",
    borderRight: "2px solid white",
    color: "white",
    fontSize: "1.1rem",
  };
  const tableCellStyles = {
    textAlign: "center",
    backgroundColor: "#eff4fb",
    borderBottom: "2px solid white",
    borderRight: "2px solid white",
    color: "black",
    fontSize: "1.1rem",
    fontWeight: "400",
    padding: 0,
  };

  const dataWithTotal = useMemo(() => {
    return [...sortedData, calculateTotalRow()];
  }, [sortedData]);

  const renderHeaderCell = (cell) => (
    <TableCell
      key={cell.id}
      sx={{ ...headerStyles, backgroundColor: cell.color }}
      onClick={() => handleSort(cell.id)}
    >
      {cell.label}
      {sortKey === cell.id && (sortOrder === "asc" ? " ▲" : " ▼")}
    </TableCell>
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "fit-content",
        minWidth: "70%",
        maxWidth: "80%",
      }}
    >
      <Table aria-label="updates table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                ...headerStyles,
                cursor: "default",
                textAlign: "left",
                paddingLeft: 1.5,
                backgroundColor: "#d9d9d9",
                color: "black",
              }}
            >
              {currentLanguage === "ENG" ? "Host/Risk" : "Хост/Риск"}
            </TableCell>
            {headerCells.map(renderHeaderCell)}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataWithTotal.map((row, index) => (
            <TableRow key={row.Host}>
              <TableCell
                sx={{
                  ...tableCellStyles,
                  textAlign: "left",
                  paddingLeft: 1.5,
                  backgroundColor: "#d9d9d9",
                  color: "black",
                  fontWeight:
                    index === dataWithTotal.length - 1 ? "bold" : "400",
                }}
              >
                {row.Host}
                {row.Host !== (currentLanguage === "ENG" ? "Total" : "Всего") &&
                row.CPE
                  ? ` | ${row.CPE}`
                  : ""}
              </TableCell>
              <TableCell
                sx={{
                  ...tableCellStyles,
                  fontWeight:
                    index === dataWithTotal.length - 1 ? "bold" : "400",
                }}
              >
                {row.Critical}
              </TableCell>
              <TableCell
                sx={{
                  ...tableCellStyles,
                  fontWeight:
                    index === dataWithTotal.length - 1 ? "bold" : "400",
                }}
              >
                {row.High}
              </TableCell>
              <TableCell
                sx={{
                  ...tableCellStyles,
                  fontWeight:
                    index === dataWithTotal.length - 1 ? "bold" : "400",
                }}
              >
                {row.Medium}
              </TableCell>
              <TableCell
                sx={{
                  ...tableCellStyles,
                  fontWeight:
                    index === dataWithTotal.length - 1 ? "bold" : "400",
                }}
              >
                {row.Low}
              </TableCell>
              <TableCell
                sx={{
                  ...tableCellStyles,
                  fontWeight:
                    index === dataWithTotal.length - 1 ? "bold" : "400",
                }}
              >
                {row.Unavailable}
              </TableCell>
              <TableCell
                sx={{
                  ...tableCellStyles,
                  fontWeight:
                    index === dataWithTotal.length - 1 ? "bold" : "400",
                }}
              >
                {row.Total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UpdatesTable;
