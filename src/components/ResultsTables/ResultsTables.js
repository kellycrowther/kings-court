import React, { useEffect, Fragment } from "react";
import { Table, Row, Col } from "antd";
import { uniqBy } from "lodash";
import { withRouter } from "react-router-dom";
import EditableColumn from "../EditableColumn/EditableColumn";

let heatFilters = [];

function createFilterOptions(racers) {
  const uniqueHeats = uniqBy(racers, "Round1Heat");
  return uniqueHeats
    .map(racer => {
      return {
        text: racer.Round1Heat.toString(),
        value: racer.Round1Heat
      };
    })
    .sort((a, b) => a.value - b.value);
}

class ResultColumn {
  constructor(
    title,
    dataIndex,
    sortable,
    filterable,
    editable,
    resultIndex,
    heatIndex
  ) {
    this.title = title;
    this.dataIndex = dataIndex;
    this.filters = [];
    this.filterMultiple = false;
    this.filterable = filterable;
    this.filter = filterable;
    this.editable = editable;
    this.key = title;
    this.canEdit = false;

    if (sortable) {
      this.sorter = (a, b) => {
        if (isNaN(a[this.dataIndex])) {
          return a[this.dataIndex].localeCompare(b[this.dataIndex]);
        } else {
          return a[this.dataIndex] - b[this.dataIndex];
        }
      };
    }

    if (this.filterable) {
      this.onFilter = (value, record) => record[dataIndex] === value;

      this.filters = heatFilters;
    }

    if (this.editable) {
      this.render = (text, row) => {
        const props = {
          row,
          heatIndex,
          resultIndex
        };
        return <EditableColumn {...props} />;
      };
    }
  }
}

const rounds = [
  {
    name: "Round 1",
    columns: [],
    key: "round-1",
    heatName: "Round 1 Heat",
    heatIndex: "Round1Heat",
    resultName: "Round 1 Result",
    resultIndex: "Round1Result",
    seedName: "Seed",
    seedIndex: "Seed"
  },
  {
    name: "Round 2",
    columns: [],
    key: "round-2",
    heatName: "Round 2 Heat",
    heatIndex: "Round2Heat",
    resultName: "Round 2 Result",
    resultIndex: "Round2Result",
    seedName: "Seed",
    seedIndex: "Round2Seed"
  },
  {
    name: "Round 3",
    columns: [],
    key: "round-3",
    heatName: "Round 3 Heat",
    heatIndex: "Round3Heat",
    resultName: "Round 3 Result",
    resultIndex: "Round3Result",
    seedName: "Seed",
    seedIndex: "Round3Seed"
  },
  {
    name: "Final Results",
    columns: [],
    key: "final-results",
    heatName: "Round 3 Heat",
    heatIndex: "Round3Heat",
    resultName: "Round 3 Result",
    resultIndex: "Round3Result",
    seedName: "Final Result",
    seedIndex: "FinalResult"
  }
];

function createColumns() {
  for (let round of rounds) {
    round.columns = [];
    const seedCol = new ResultColumn(
      round.seedName,
      round.seedIndex,
      true,
      false,
      false
    );
    const nameCol = new ResultColumn("Name", "Name", false, false, false);
    const genderCol = new ResultColumn("Gender", "Gender", true, false, false);
    const teamCol = new ResultColumn(
      "Team Name",
      "Team name",
      true,
      false,
      false
    );
    const heatCol = new ResultColumn(
      round.heatName,
      round.heatIndex,
      true,
      true,
      false
    );
    const resultCol = new ResultColumn(
      round.resultName,
      round.resultIndex,
      true,
      false,
      true,
      round.resultIndex,
      round.heatIndex
    );
    if (round.key === "final-results") {
      // don't show heat or result column if it's the final results
      round.columns.push(seedCol, nameCol, genderCol, teamCol);
    } else {
      round.columns.push(
        seedCol,
        nameCol,
        genderCol,
        teamCol,
        heatCol,
        resultCol
      );
    }
  }
}

function createTables(racers) {
  createColumns();
  const tables = [];
  for (let round of rounds) {
    tables.push(
      <Fragment key={round.key}>
        <Row>
          <Col span={8} className="round-header">
            <h3>{round.name}</h3>
            {/* <SaveButton racers={racers} /> */}
          </Col>
        </Row>
        <Table
          dataSource={racers}
          columns={round.columns}
          rowKey="Bib"
          scroll={{ x: 650 }}
        />
      </Fragment>
    );
  }
  return tables;
}

function ResultsTables({ racers }) {
  useEffect(() => {
    heatFilters = createFilterOptions(racers);
  }, [racers]);

  return <div>{createTables(racers)}</div>;
}

export default withRouter(ResultsTables);
