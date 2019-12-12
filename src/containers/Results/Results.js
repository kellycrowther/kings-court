import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import socketIOClient from "socket.io-client";
import "./Results.css";
import ResultsTables from "../../components/ResultsTables/ResultsTables";
import SearchRacers from "../../components/SearchRacers/SearchRacers";

export default function Results() {
  const [racers, setRacers] = useState([]);
  const [filteredRacers, setFilteredRacers] = useState([]);

  // const endpoint = "http://127.0.0.1:4001";
  const endpoint = "http://34.223.91.61:4001";
  const socket = socketIOClient(endpoint);

  useEffect(() => {
    socket.on("outgoing-data", data => {
      console.info("Results->init: ", data);
      setRacers(data.racers);
      setFilteredRacers(data.racers);
    });

    return () => {
      socket.off("disconnected");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Row type="flex" justify="space-between">
        <Col>
          <h2>Results</h2>
        </Col>
        <Col>
          <SearchRacers racers={racers} setFilteredRacers={setFilteredRacers} />
        </Col>
      </Row>

      <ResultsTables racers={filteredRacers} />
    </div>
  );
}
