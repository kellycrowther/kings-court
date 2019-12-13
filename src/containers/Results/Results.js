import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import socketIOClient from "socket.io-client";
import "./Results.css";
import ResultsTables from "../../components/ResultsTables/ResultsTables";
import SearchRacers from "../../components/SearchRacers/SearchRacers";

export default function Results() {
  const [racers, setRacers] = useState([]);
  const [filteredRacers, setFilteredRacers] = useState([]);

  const endpoint = process.env.REACT_APP_API_ENDPOINT;
  const socket = socketIOClient(endpoint);

  useEffect(() => {
    socket.on("outgoing-data", data => {
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
