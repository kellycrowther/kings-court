import React, { useState, useEffect } from "react";
import { Row, Col, Select, Button } from "antd";
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
import { Subscription } from "@apollo/react-components";
import { gql } from "@apollo/client";

const { Option } = Select;

// subscriptions will not work locally
// make sure to change the Insomnia environment too
const MODIFY_RACE_SUBSCRIPTION = `
  subscription ModifiedRaceSub {
    modifyRace {
      name
      id
      results {
        teamName
        round1Heat
        round1Result
        seed
        round2Result
        round3Result
        bib
        firstName
        lastName
        fullName
        gender
        uuid
      }
    }
  }
`;

const Results = ({
  races,
  currentRace,
  getRaceById,
  getAllRaces,
  history,
  setCurrentRace,
  removeAllRaces
}) => {
  const [filteredRacers, setFilteredRacers] = useState([]);
  const [raceId, setRaceId] = useState("");

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
      <Row type="flex" justify="space-between" className="results-row">
        <Col>
          <h2>Results</h2>
        </Col>
        <Col>
          <Select
            className="select-race"
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
            className="search-racers-results"
          />
        </Col>
      </Row>

      {/* subscription will not work locally, must use production environment */}
      <Subscription subscription={gql(MODIFY_RACE_SUBSCRIPTION)}>
        {({ data, loading }) => {
          console.info("SUBSCRIBED DATA: ", data);

          // if results and race id matches currently selected race, set the filtered racers with the new data
          if (
            data &&
            data.modifyRace &&
            data.modifyRace.results &&
            data.id === currentRace.id
          ) {
            setFilteredRacers(data.modifyRace.results);
          }
          return <h1>New Item: {JSON.stringify(data)}</h1>;
        }}
      </Subscription>
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
