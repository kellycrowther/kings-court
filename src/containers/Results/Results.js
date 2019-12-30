import React, { useState, useEffect } from "react";
import { Row, Col, Select, Button } from "antd";
// import socketIOClient from "socket.io-client";
import "./Results.css";
import ResultsTables from "../../components/ResultsTables/ResultsTables";
import SearchRacers from "../../components/SearchRacers/SearchRacers";
import {
  getRaceById,
  getRaces,
  setCurrentRace,
  removeAllRaces
} from "../../core/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const { Option } = Select;

const Results = ({
  races,
  currentRace,
  getRaceById,
  getAllRaces,
  history,
  setCurrentRace,
  removeAllRaces
}) => {
  // const [racers, setRacers] = useState([]);
  const [filteredRacers, setFilteredRacers] = useState([]);
  // const [races, setRaces] = useState([]);
  const [raceId, setRaceId] = useState("");

  /* Socket Code
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
  */

  // hack to make sure user cannot alter current race results
  // should protect route instead
  useEffect(() => {
    history.listen(() => {
      setCurrentRace();
      removeAllRaces();
    });
    window.onbeforeunload = () => {
      setCurrentRace();
      removeAllRaces();
    };
  }, [setCurrentRace, removeAllRaces, history]);

  useEffect(() => {
    setFilteredRacers(currentRace.results);
  }, [currentRace]);

  useEffect(() => {
    getAllRaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectRace = raceId => {
    setRaceId(raceId);
    getRaceById(raceId);
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
          <Button
            type="primary"
            className="refresh-btn"
            onClick={() => getRaceById(raceId)}
          >
            Refresh Results
          </Button>
        </Col>
        <Col>
          <SearchRacers
            racers={currentRace && currentRace.results}
            setFilteredRacers={setFilteredRacers}
          />
        </Col>
      </Row>

      <ResultsTables racers={filteredRacers} />
    </div>
  );
};

const mapStateToProps = state => ({
  races: state.racesState.races,
  currentRace: state.racesState.currentRace
});

const mapDispatchToProps = dispatch => ({
  getRaceById: id => dispatch(getRaceById({ id })),
  getAllRaces: () => dispatch(getRaces()),
  setCurrentRace: () =>
    dispatch(setCurrentRace({ name: "", id: "", results: [] })),
  removeAllRaces: () => dispatch(removeAllRaces())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Results));
