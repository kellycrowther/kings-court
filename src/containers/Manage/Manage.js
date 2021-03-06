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
import * as uploadTemplate from "./upload-template.csv";
import DownloadCsv from "../../components/DownloadCsv/DownloadCsv";

const { Option } = Select;

function DeleteButton({ deleteRace, currentRace }) {
  function confirm() {
    deleteRace(currentRace);
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

function SaveButton({ updateRace, currentRace }) {
  return (
    <Button
      onClick={() => updateRace(currentRace)}
      type="primary"
      className="save-button"
    >
      <Icon type="save" /> Save
    </Button>
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

  useEffect(() => {
    getRacesByUser({ userId: user.sub });
  }, [getRacesByUser, user]);

  // listen for navigation and page refresh changes and save the racers
  // useEffect(() => {
  //   history.listen(() => {
  //     updateRace(currentRace);
  //   });
  //   window.onbeforeunload = () => {
  //     updateRace(currentRace);
  //   };
  // }, [currentRace, updateRace, history]);

  useEffect(() => {
    // emitSocket(currentRace);
  });

  const handleRaceSelect = raceId => {
    const currentRace = races.find(race => race.id === raceId);
    setCurrentRace(currentRace);
  };

  console.info("Manage->currentRace->", currentRace);

  return (
    <div>
      <h2>Manage</h2>
      <h4>Reminders!</h4>
      <ul>
        <li>
          <strong>All racers need a place for each heat.</strong> There is no
          DNF/DNS support.
        </li>
        <li>
          Use the <a href={uploadTemplate}>CSV template</a> to upload results.
          Do not remove or add columns. Use exactly 'Male' and 'Female' in the
          gender column.
        </li>
        <li>
          All values for each column in the CSV <strong>REQUIRE</strong> a
          value. Check the template for reference.
        </li>
        <li>All rows need values. Do not skip rows.</li>
        <li>
          When exporting your Excel or Numbers file to create the CSV, do not
          include table names.
        </li>
        <li>Click Save to broadcast results.</li>
        <li>Any issues, contact Kelly.</li>
      </ul>
      <Row type="flex" className="manage-actions">
        <Col xs={24} md={8}>
          <h3>Create Race</h3>
          <Button onClick={openCreateRaceModal}>
            <Icon type="rocket" /> Create Race
          </Button>
        </Col>
        <Col xs={24} md={8}>
          <h3>Manage Existing Race</h3>
          <Select
            className="select-previous-race"
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
        <Col xs={24} md={8} className="delete-container">
          <SaveButton currentRace={currentRace} updateRace={updateRace} />
          <DeleteButton deleteRace={deleteRace} currentRace={currentRace} />
        </Col>
      </Row>

      <ResultsTables
        racers={currentRace.results}
        saveBtnComponent={
          <SaveButton currentRace={currentRace} updateRace={updateRace} />
        }
      />

      <DownloadCsv data={currentRace.results} />
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
