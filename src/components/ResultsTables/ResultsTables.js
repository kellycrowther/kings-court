import React from "react";
import { Table } from "antd";

const columns = [
  {
    title: "Seed",
    dataIndex: "Seed",
    sorter: (a, b) => a.Seed - b.Seed
  },
  {
    title: "Name",
    dataIndex: "Name"
  },
  {
    title: "Gender",
    dataIndex: "Gender",
    sorter: (a, b) => a.Gender.localeCompare(b.Gender)
  },
  {
    title: "Team Name",
    dataIndex: "Team name",
    sorter: (a, b) => a["Team name"].localeCompare(b["Team name"])
  },
  {
    title: "Round 1 Heat",
    dataIndex: "Round1Heat",
    sorter: (a, b) => a.Round1Heat - b.Round1Heat,
    filters: [
      /* set dynamically in Manage component */
    ],
    filterMultiple: false,
    filter: true,
    onFilter: (value, record) => record.Round1Heat === value
  },
  {
    title: "Round 1 Result",
    dataIndex: "Round1Result",
    heatDataIndex: "Round1Heat",
    editable: true
  }
];

const columnsRound2 = [
  {
    title: "Seed",
    dataIndex: "Round2Seed",
    sorter: (a, b) => a.Round2Seed - b.Round2Seed
  },
  {
    title: "Name",
    dataIndex: "Name"
  },
  {
    title: "Gender",
    dataIndex: "Gender",
    sorter: (a, b) => a.Gender.localeCompare(b.Gender)
  },
  {
    title: "Team Name",
    dataIndex: "Team name",
    sorter: (a, b) => a["Team name"].localeCompare(b["Team name"])
  },
  {
    title: "Round 2 Heat",
    dataIndex: "Round2Heat",
    sorter: (a, b) => a.Round2Heat - b.Round2Heat,
    filters: [
      /* set dynamically in Manage component */
    ],
    filterMultiple: false,
    filter: true,
    onFilter: (value, record) => record.Round2Heat === value
  },
  {
    title: "Round 2 Result",
    dataIndex: "Round2Result",
    heatDataIndex: "Round2Heat",
    editable: true
  }
];

const columnsRound3 = [
  {
    title: "Seed",
    dataIndex: "Round3Seed",
    sorter: (a, b) => a.Round3Seed - b.Round3Seed
  },
  {
    title: "Name",
    dataIndex: "Name"
  },
  {
    title: "Gender",
    dataIndex: "Gender",
    sorter: (a, b) => a.Gender.localeCompare(b.Gender)
  },
  {
    title: "Team Name",
    dataIndex: "Team name",
    sorter: (a, b) => a["Team name"].localeCompare(b["Team name"])
  },
  {
    title: "Round 3 Heat",
    dataIndex: "Round3Heat",
    sorter: (a, b) => a.Round3Heat - b.Round3Heat,
    filters: [
      /* set dynamically in Manage component */
    ],
    filterMultiple: false,
    filter: true,
    onFilter: (value, record) => record.Round3Heat === value
  },
  {
    title: "Round 3 Result",
    dataIndex: "Round3Result",
    heatDataIndex: "Round3Heat",
    editable: true
  }
];

const columnsFinalResults = [
  {
    title: "Final Result",
    dataIndex: "FinalResult",
    sorter: (a, b) => a.FinalResult - b.FinalResult
  },
  {
    title: "Name",
    dataIndex: "Name"
  },
  {
    title: "Gender",
    dataIndex: "Gender",
    sorter: (a, b) => a.Gender.localeCompare(b.Gender)
  },
  {
    title: "Team Name",
    dataIndex: "Team name"
  }
];

export default function ResultsTables({ racers }) {
  return (
    <div>
      <h3>Round 1</h3>
      <Table
        columns={columns}
        dataSource={racers}
        scroll={{ x: 650 }}
        rowKey="Bib"
      />
      <div style={{ padding: "30px" }}></div>
      <h3>Round 2</h3>
      <Table
        columns={columnsRound2}
        dataSource={racers}
        scroll={{ x: 650 }}
        rowKey="Bib"
      />
      <div style={{ padding: "30px" }}></div>
      <h3>Round 3</h3>
      <Table
        columns={columnsRound3}
        dataSource={racers}
        scroll={{ x: 650 }}
        rowKey="Bib"
      />
      <div style={{ padding: "30px" }}></div>
      <h3>Final Results</h3>
      <Table
        columns={columnsFinalResults}
        dataSource={racers}
        scroll={{ x: 650 }}
        rowKey="Bib"
      />
    </div>
  );
}
