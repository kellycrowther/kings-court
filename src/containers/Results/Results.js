import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import "./Results.css";
import ResultsTables from "../../components/ResultsTables/ResultsTables";

export default function Results() {
  const [racers, setRacers] = useState([]);
  const endpoint = "http://127.0.0.1:4001";
  const socket = socketIOClient(endpoint);

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

      <ResultsTables racers={racers} />
    </div>
  );
}
