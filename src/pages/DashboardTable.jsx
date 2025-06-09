import React, { useEffect, useMemo, useState } from "react";
import { useTable, useGlobalFilter, useFilters } from "react-table";
import { io } from "socket.io-client";
import { FaFilter, FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./DashboardTable.css";
import CampaignDetails from "./CampaignDetails";

import PieChartWithCenterLabel from "./PieChartWithCenterLabel";
import CalendarRangePicker from "../components/CalendarRangePicker";

// Match these keys to your actual data keys exactly
const columnsList = [
  
  { Header: "ITL Code", accessor: "ITL" },
  { Header: "Tactic", accessor: "Tactic" },
  { Header: "Start Date", accessor: "Start Date" },
  { Header: "End Date", accessor: "Deadline" },
  { Header: "Pacing", accessor: "Pacing" },
  { Header: "Delivery Day", accessor: "Delivery Days" },
  { Header: "Allocation (Leads Booked)", accessor: "Leads Booked" },
  { Header: "Delivered (Leads Sent)", accessor: "Lead Sent" },
  { Header: "Shortfall", accessor: "Shortfall" },
];

const DashboardTable = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null); // Add status selection state

  const [data, setData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [connected, setConnected] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [allData, setAllData] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false); // Prevent WS overwrite during filtering

  const [socket] = useState(() =>
    io(process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      autoConnect: true,
      // Add fallback options
      withCredentials: true,
      // Handle connection timeout
      pingTimeout: 60000,
      pingInterval: 25000
    })
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket:", socket.id);
      console.log("🚀 Transport:", socket.io.engine.transport.name);
      setConnected(true);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ WebSocket connection error:", err.message);
      console.error("🔍 Error details:", err);
      console.error("🌐 Trying to connect to:", socket.io.uri);
      setConnected(false);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ WebSocket disconnected. Reason:", reason);
      setConnected(false);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 WebSocket reconnected after", attemptNumber, "attempts");
      setConnected(true);
    });

    socket.on("reconnect_error", (err) => {
      console.error("❌ WebSocket reconnection error:", err.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ WebSocket reconnection failed after all attempts");
      setConnected(false);
    });

    socket.on("error", (error) => {
      console.error("❌ Server error:", error.message);
    });

    socket.on("sheetDataUpdated", (incomingData) => {
      if (!isFiltering) {
        const formatted = formatDatesForDisplay(incomingData);
        setData(formatted);
        setAllData(formatted); // Stores original unfiltered dataset
        console.log("📊 Data updated:", incomingData.length, "rows");
      }
    });

    // Handle initial connection attempt
    if (!socket.connected) {
      console.log("🔄 Attempting to connect to WebSocket...");
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, [socket, isFiltering]);

  const formatDatesForDisplay = (rows) => {
    return rows.map((row) => ({
      ...row,
      "Start Date": row["Start Date"]
        ? new Date(row["Start Date"]).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
      Deadline: row["Deadline"]
        ? new Date(row["Deadline"]).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
    }));
  };

  const columns = useMemo(
    () =>
      columnsList.map((col) => ({
        ...col,
        Filter: ({ column: { filterValue, setFilter } }) =>
          showFilters ? (
            <input
              value={filterValue || ""}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter..."
            />
          ) : null,
      })),
    [showFilters]
  );

  const tableInstance = useTable(
    { columns, data },
    useFilters,
    useGlobalFilter
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state: { globalFilter },
  } = tableInstance;

  const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(rows.map((r) => r.values));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredData");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(dataBlob, "FilteredData.xlsx");
};

// 🔁 Show campaign details if an ITL is clicked
if (selectedCampaign) {
  return (
    <CampaignDetails
      campaign={selectedCampaign}
      onClose={() => setSelectedCampaign(null)}
    />
  );
}

  
  return (
    <div className="dashboard-container">
      {/* Breadcrumb Navigation */}
      {selectedStatus && (
        <div className="breadcrumb-nav">
          <button 
            onClick={() => setSelectedStatus(null)}
            className="breadcrumb-back"
          >
            ← Back to Dashboard
          </button>
          <span className="breadcrumb-current">
            / {selectedStatus} Campaigns
          </span>
        </div>
      )}

      {!selectedStatus && (
        <>
          <CalendarRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onFilter={(start, end) => {
              setIsFiltering(true);
              try {
                const filtered = allData.filter((row) => {
                  const rowStart = new Date(row["Start Date"]);
                  return rowStart >= start && rowStart <= end;
                });
                setData(filtered);
              } catch (err) {
                console.error("❌ Error filtering data:", err.message);
              } finally {
                setIsFiltering(false);
              }
            }}
          />

          <div className="PieChartBlock">
            <PieChartWithCenterLabel 
              campaignData={allData} 
              onStatusSelect={setSelectedStatus}
              selectedStatus={selectedStatus}
            />
          </div>

          <div className="dashboard-controls">
            <div className="left-controls">
              <button onClick={() => setShowFilters(!showFilters)}>
                <FaFilter /> Filter
              </button>
              <input
                className="search-input"
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
              />
            </div>
            <div className="right-controls">
              <button onClick={exportToExcel}>
                <FaFileExport /> Export
              </button>
            </div>
          </div>
        </>
      )}

      {selectedStatus && (
        <PieChartWithCenterLabel 
          campaignData={allData} 
          onStatusSelect={setSelectedStatus}
          selectedStatus={selectedStatus}
        />
      )}

      {!selectedStatus && (
        <>
          {!connected ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              🔄 Connecting to server...
            </div>
          ) : (
            <table {...getTableProps()} className="styled-table">
              <thead>
                {headerGroups.map((headerGroup) => {
                  const { key, ...rest } = headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={key} {...rest}>
                      {headerGroup.headers.map((column) => {
                        const { key: colKey, ...restCol } = column.getHeaderProps();
                        return (
                          <th key={colKey} {...restCol}>
                            <div>{column.render("Header")}</div>
                            {column.canFilter ? column.render("Filter") : null}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} style={{ textAlign: "center" }}>
                      No data available.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    prepareRow(row);
                    const { key, ...rowProps } = row.getRowProps();
                    return (
                      <tr key={key} {...rowProps}>
                        {row.cells.map((cell) => {
                          const { key: cellKey, ...cellProps } = cell.getCellProps();
                          return (
                            <td key={cellKey} {...cellProps}>
                              {cell.column.id === "ITL" ? (
                                <button
                                  onClick={() => setSelectedCampaign(row.original)}
                                  style={{ color: "#007bff", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                                >
                                  {cell.render("Cell")}
                                </button>
                              ) : (
                                cell.render("Cell")
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardTable;
