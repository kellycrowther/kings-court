import React, { useEffect, useContext, useRef } from "react";
import { withRouter } from "react-router-dom";
import { Button, Icon, Popconfirm, Row, Col, message } from "antd";
import Papa from "papaparse";
import socketIOClient from "socket.io-client";
import "./Manage.css";
import { store } from "../../store/store.js";
import ResultsTables from "../../components/ResultsTables/ResultsTables";

const { Parser } = require("json2csv");
const endpoint = process.env.REACT_APP_API_ENDPOINT;
const socket = socketIOClient(endpoint);

// TODO: DNS or no shows
// TODO: DNF
// TODO: Ties
// TODO: make button to finalize round results and display next table
// TODO: Add search for racer name on manage page
// BUG: What happens if some racers don't have a place in a round? The user forgets or intentionally does not place a racer. Undefined error, make select required
// TODO: Messaging that all racers in round need place within heat to correctly seed next round. Related to above ^^^
// BUG: Heat filters disappear after page refresh

function readCSV(info) {
  let reader = new FileReader();
  // need promise to ensure program doesn't continuing executing without having processed the data
  return new Promise(resolve => {
    reader.addEventListener("error", () => {
      message.error(
        "There was a problem uploading the CSV. Refresh the page and try again."
      );
      console.error("Manage->readCSV()->error");
      reader.abort();
    });
    reader.onload = e => {
      // ipad Numbers adds extra lines - this removes them to normalize it
      let result = e.target.result;
      if (result.includes("Table 1,,,,,,,,,")) {
        result = result.replace("Table 1,,,,,,,,,", "");
      }
      if (result.includes(",,,,,,,,,")) {
        result = result.replace(",,,,,,,,,", "");
      }
      const csvData = Papa.parse(result, {
        dynamicTyping: true,
        columns: true,
        skipEmptyLines: true,
        header: true
      });
      if (csvData.errors.length > 0) {
        message.error(
          "There was a problem parsing the CSV. Make sure the CSV is in the correct format. Only include column headers and associated data.",
          5
        );
      }
      setHeats(csvData.data);
      resolve(csvData.data);
    };
    reader.readAsText(info);
  });
}

function setHeats(csvData) {
  // females start with heat 1, males 2
  let currentFemaleHeat = 1;
  let currentMaleHeat = 2;
  let currentFemaleCount = 0;
  let currentMaleCount = 0;
  csvData.map(row => {
    // we are hardcoding the heats to have 6 and less skiers
    if (row.Gender === "Female" && currentFemaleCount <= 6) {
      row.Round1Heat = currentFemaleHeat;
      // add 1 to the skier count and reset if the count is equal to 6
      currentFemaleCount = currentFemaleCount < 6 ? currentFemaleCount + 1 : 1;
      // we are alternating odd / even heats with girls being odd number and boys even so add two to the initial heat
      currentFemaleHeat =
        currentFemaleCount < 6 ? currentFemaleHeat : currentFemaleHeat + 2;
    }
    if (row.Gender === "Male" && currentMaleCount <= 6) {
      row.Round1Heat = currentMaleHeat;
      currentMaleCount = currentMaleCount < 6 ? currentMaleCount + 1 : 1;
      currentMaleHeat =
        currentMaleCount < 6 ? currentMaleHeat : currentMaleHeat + 2;
    }
    return row;
  });
}

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
      <Button type="danger">Delete</Button>
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
      Save
    </Button>
  );
}

function UploadFile({ inputFile }) {
  function handleSelect(info) {
    inputFile.current.click();
  }
  return (
    <Button onClick={handleSelect}>
      <Icon type="upload" /> Click to Upload
    </Button>
  );
}

function Manage({ history }) {
  const globalState = useContext(store);
  const { dispatch } = globalState;
  const { racers } = globalState.state;

  function setRacers(racers) {
    dispatch({ type: "SET_RACERS", payload: racers });
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
    // retrieve data from local storage
    let savedRacers = localStorage.getItem("racers");
    savedRacers = JSON.parse(savedRacers);
    if (savedRacers) {
      dispatch({ type: "SET_RACERS", payload: savedRacers });
    }
  }, [dispatch]);

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

  const inputFile = useRef(null);

  function onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    readCSV(file).then(csvData => {
      setRacers(csvData);
    });
  }

  console.info("Manage->racers->", racers);

  return (
    <div>
      <h2>Manage</h2>
      <h3>Create Race</h3>
      <Row>
        <Col span={8} className="manage--create-btns">
          <UploadFile inputFile={inputFile} />
          <input
            type="file"
            id="file"
            accept=".csv, text/csv"
            ref={inputFile}
            onChange={onChangeFile}
            style={{ display: "none" }}
          />
          <SaveButton racers={racers} />
        </Col>
        <Col span={8} offset={8} className="delete-container">
          <DeleteButton setRacers={setRacers} />
        </Col>
      </Row>

      <ResultsTables racers={racers} />

      <Button onClick={downloadCSV} type="primary">
        <Icon type="download" /> Download Final Results
      </Button>
    </div>
  );
}

export default withRouter(Manage);
