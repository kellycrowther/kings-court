import React, { useState, useEffect } from "react";
import { Row, Col, Select } from "antd";
import socketIOClient from "socket.io-client";
import "./Results.css";
import ResultsTables from "../../components/ResultsTables/ResultsTables";
import SearchRacers from "../../components/SearchRacers/SearchRacers";

const { Option } = Select;

export default function Results() {
  const [racers, setRacers] = useState([]);
  const [filteredRacers, setFilteredRacers] = useState([]);
  const [races, setRaces] = useState([]);
  const [raceId, setRaceId] = useState("");

  const endpoint = process.env.REACT_APP_API_ENDPOINT;
  const socket = socketIOClient(endpoint);

  useEffect(() => {
    socket.on("outgoing-data", data => {
      setRaces(data.races);
    });

    return () => {
      socket.off("disconnected");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on(raceId, data => {
      setRacers(data.race.results);
      setFilteredRacers(data.race.results);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceId]);

  const handleSelectRace = race => {
    setRaceId(race);
  };

  return (
    <div>
      <Row type="flex" justify="space-between">
        <Col>
          <h2>Results</h2>
        </Col>
        <Col>
          <Select
            style={{ width: 300 }}
            onChange={handleSelectRace}
            placeholder="Select Race"
          >
            {races &&
              races.map((race, index) => {
                return (
                  <Option value={race.id} key={index}>
                    {race.name}
                  </Option>
                );
              })}
          </Select>
        </Col>
        <Col>
          <SearchRacers racers={racers} setFilteredRacers={setFilteredRacers} />
        </Col>
      </Row>

      <ResultsTables racers={filteredRacers} />
    </div>
  );
}
