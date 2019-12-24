import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Button, Icon, Popconfirm, Row, Col, Select } from "antd";
import "./Manage.css";
import ResultsTables from "../../components/ResultsTables/ResultsTables";
import { connect } from "react-redux";
import {
  getRacesByUser,
  createRace,
  updateRace,
  setCurrentRace,
  deleteRace
} from "../../core/actions";
import { useAuth0 } from "../../auth0";
import CreateRace from "../../components/CreateRace/CreateRace";
import { useCover } from "../../context/cover";
import { emitSocket } from "../../sockets/sockets";

const { Parser } = require("json2csv");
const { Option } = Select;

// TODO: DNS or no shows
// TODO: DNF
// TODO: Ties
// TODO: make button to finalize round results and display next table
// TODO: Add search for racer name on manage page
// BUG: What happens if some racers don't have a place in a round? The user forgets or intentionally does not place a racer. Undefined error, make select required
// TODO: Messaging that all racers in round need place within heat to correctly seed next round. Related to above ^^^
// BUG: Heat filters disappear after page refresh
// TODO: socket need to remember last emitted data for each room

function DeleteButton({ deleteRace, currentRace }) {
  function confirm() {
    deleteRace(currentRace);
    // emitSocket({});
  }
  return (
    <Popconfirm
      title="Are you sure you want to delete this race?"
      onConfirm={confirm}
      okText="Yes"
      cancelText="No"
    >
      <Button type="danger">
        <Icon type="delete" />
        Delete
      </Button>
    </Popconfirm>
  );
}

function Manage({
  history,
  getRacesByUser,
  createRace,
  races,
  updateRace,
  setCurrentRace,
  currentRace,
  deleteRace
}) {
  const { user } = useAuth0();
  const { openCoverScreen } = useCover();

  function openCreateRaceModal() {
    openCoverScreen(
      <CreateRace createRace={createRace} setCurrentRace={setCurrentRace} />
    );
  }

  function downloadCSV() {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(currentRace.results);
    let hiddenElement = document.createElement("a");
    // important to use URI and not blob so Safari iPad works
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = "final-results.csv";
    hiddenElement.click();
  }

  useEffect(() => {
    getRacesByUser({ userId: user.sub });
  }, [getRacesByUser, user]);

  // listen for navigation and page refresh changes and save the racers
  useEffect(() => {
    history.listen(() => {
      updateRace(currentRace);
    });
    window.onbeforeunload = () => {
      updateRace(currentRace);
    };
  }, [currentRace, updateRace, history]);

  useEffect(() => {
    emitSocket(currentRace);
  });

  const handleRaceSelect = raceId => {
    const currentRace = races.find(race => race.id === raceId);
    setCurrentRace(currentRace);
  };

  console.info("Manage->currentRace->", currentRace);

  return (
    <div>
      <h2>Manage</h2>
      <Row className="manage-actions">
        <Col span={8}>
          <h3>Create Race</h3>
          <Button onClick={openCreateRaceModal}>
            <Icon type="rocket" /> Create Race
          </Button>
        </Col>
        <Col span={8}>
          <h3>Manage Existing Race</h3>
          <Select
            style={{ width: 300 }}
            onChange={handleRaceSelect}
            placeholder="Select Previously Created Race"
          >
            {races &&
              races.map(race => {
                return (
                  <Option value={race.id} key={race.id}>
                    {race.name}
                  </Option>
                );
              })}
          </Select>
        </Col>
        <Col span={8} className="delete-container">
          <Button
            onClick={() => updateRace(currentRace)}
            type="primary"
            className="save-button"
          >
            <Icon type="save" /> Save
          </Button>
          <DeleteButton deleteRace={deleteRace} currentRace={currentRace} />
        </Col>
      </Row>

      <ResultsTables racers={currentRace.results} />

      <Button
        onClick={downloadCSV}
        type="primary"
        className="download-final-btn"
      >
        <Icon type="download" /> Download Final Results
      </Button>
    </div>
  );
}

const mapStateToProps = state => ({
  races: state.racesState.races,
  currentRace: state.racesState.currentRace
});

const mapDispatchToProps = dispatch => ({
  getRacesByUser: userId => dispatch(getRacesByUser(userId)),
  createRace: race => dispatch(createRace(race)),
  updateRace: race => dispatch(updateRace(race)),
  setCurrentRace: race => dispatch(setCurrentRace(race)),
  deleteRace: race => dispatch(deleteRace(race))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Manage));
