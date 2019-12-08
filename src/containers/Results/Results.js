import React, { useState, useEffect } from "react";
import { Table } from "antd";
import socketIOClient from "socket.io-client";
import "./Results.css";

export default function Results() {
  const [racers, setRacers] = useState([]);
  const endpoint = "http://127.0.0.1:4001";
  const socket = socketIOClient(endpoint);

  const columns = [
    {
      title: "Final Result",
      dataIndex: "FinalResult",
      sorter: (a, b) => a.FinalResult - b.FinalResult
    },
    {
      title: "Name",
      dataIndex: "Name"
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      sorter: (a, b) => a.Gender.localeCompare(b.Gender)
    },
    {
      title: "Team Name",
      dataIndex: "Team name"
    }
  ];

  function sendSocketData() {
    socket.on("outgoing-data", data => {
      console.info("DATA: ", data);
      setRacers(data.racers);
    });
  }
  useEffect(() => {
    sendSocketData();

    return () => {
      socket.off("disconnected");
    };
  }, []);

  return (
    <div>
      <h2>Results</h2>

      <Table
        rowClassName={() => "editable-row"}
        columns={columns}
        dataSource={racers}
        scroll={{ x: 650 }}
        rowKey="Bib"
      />
    </div>
  );
}
