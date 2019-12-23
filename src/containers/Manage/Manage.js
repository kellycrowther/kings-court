import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Button, Icon, Popconfirm, Row, Col, message, Select } from "antd";
import socketIOClient from "socket.io-client";
import "./Manage.css";
import ResultsTables from "../../components/ResultsTables/ResultsTables";
import { connect } from "react-redux";
import {
  setRacersToStore,
  getRacesByUser,
  createRace
} from "../../core/actions";
import { useAuth0 } from "../../auth0";
import CreateRace from "../../components/CreateRace/CreateRace";
import { useCover } from "../../context/cover";

const { Parser } = require("json2csv");
const endpoint = process.env.REACT_APP_API_ENDPOINT;
const socket = socketIOClient(endpoint);
const { Option } = Select;

// TODO: DNS or no shows
// TODO: DNF
// TODO: Ties
// TODO: make button to finalize round results and display next table
// TODO: Add search for racer name on manage page
// BUG: What happens if some racers don't have a place in a round? The user forgets or intentionally does not place a racer. Undefined error, make select required
// TODO: Messaging that all racers in round need place within heat to correctly seed next round. Related to above ^^^
// BUG: Heat filters disappear after page refresh
// TODO: each created race should be passed with a user id
// TODO: each race should have it's own websocket to connect to and broadcast events from
// BUG: refreshing page with Social login like Google logs me out; issue https://community.auth0.com/t/getting-logged-out-after-refreshing-on-localhost-react-js-spa/28474/2

function emitResults(racers) {
  socket.emit("incoming-data", racers);
}

function DeleteButton({ setRacers }) {
  function confirm() {
    setRacers([]);
    localStorage.removeItem("racers");
    socket.emit("incoming-data", []);
  }
  return (
    <Popconfirm
      title="Are you sure you want to delete all the data?"
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

const save = (racers, isMessage = true) => {
  localStorage.setItem("racers", JSON.stringify(racers));
  socket.emit("incoming-data", racers);
  if (isMessage) {
    message.success("Successfully saved data!");
  }
};

function SaveButton({ racers }) {
  return (
    <Button onClick={() => save(racers)} type="primary" className="save-button">
      <Icon type="save" /> Save
    </Button>
  );
}

function Manage({
  history,
  racers,
  setRacersToStore,
  getRacesByUser,
  createRace
}) {
  const { user } = useAuth0();
  const { openCoverScreen } = useCover();

  function openCreateRaceModal() {
    openCoverScreen(
      <CreateRace createRace={createRace} setRacersToStore={setRacersToStore} />
    );
  }

  function downloadCSV() {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(racers);
    let hiddenElement = document.createElement("a");
    // important to use URI and not blob so Safari iPad works
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = "final-results.csv";
    hiddenElement.click();
  }

  useEffect(() => {
    getRacesByUser({ userId: user.sub });
    // retrieve data from local storage
    let savedRacers = localStorage.getItem("racers");
    savedRacers = JSON.parse(savedRacers);
    if (savedRacers) {
      setRacersToStore(savedRacers);
    }
  }, [setRacersToStore, getRacesByUser, user]);

  // listen for navigation and page refresh changes and save the racers
  useEffect(() => {
    history.listen(() => {
      save(racers, false);
    });
    window.onbeforeunload = () => {
      save(racers, false);
    };
  }, [racers, history]);

  useEffect(() => {
    emitResults(racers);
  });

  const handleRaceSelect = () => {
    console.info("HANDLE RACE SELECT");
  };

  console.info("Manage->racers->", racers);

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
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </Col>
        <Col span={8} className="delete-container">
          <SaveButton racers={racers} />
          <DeleteButton setRacers={setRacersToStore} />
        </Col>
      </Row>

      <ResultsTables racers={racers} />

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
  racers: state.racers
});

const mapDispatchToProps = dispatch => ({
  setRacersToStore: racers => dispatch(setRacersToStore(racers)),
  getRacesByUser: userId => dispatch(getRacesByUser(userId)),
  createRace: race => dispatch(createRace(race))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Manage));
