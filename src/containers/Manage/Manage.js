import React, { useState, useEffect } from "react";
import { Upload, message, Button, Icon, Table, Form, Select } from "antd";
import parse from "csv-parse";
import { uniqBy } from "lodash";

var data = require("../../mocks/mock-data.json");

const { Option } = Select;

let heatFilters = [];

// TODO: Save results to local storage
// TODO: Delete all results
// TODO: Export final results to CSV
// BUG: When not selecting places in order (choose place 5 before, place 4 as been selected), getting type error: TypeError: Cannot read property 'Round2Seed' of undefined

function readCSV(info) {
  const csvData = [];
  let reader = new FileReader();
  // need promise to ensure program doesn't continuing executing without having processed the data
  return new Promise(resolve => {
    reader.readAsText(info.file.originFileObj);
    reader.onload = e => {
      const result = e.target.result;
      parse(result, {
        delimiter: ",",
        columns: true,
        from_line: 2
      })
        .on("data", function(csvrow) {
          // do something with csvrow
          csvData.push(csvrow);
        })
        .on("end", function() {
          // do something with csvData
          // console.log(csvData);
          setHeats(csvData);
          resolve(csvData);
        });
    };
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
  heatFilters = createFilterOptions(csvData);
  console.info("ALL HEATS: ", heatFilters);
}

function setSeed(row, racers, roundResultKey, heatDataIndex) {
  // get the current seed index
  let currentRoundSeedIndex;
  if (heatDataIndex === "Round1Heat") {
    currentRoundSeedIndex = "Seed";
  } else if (heatDataIndex === "Round2Heat") {
    currentRoundSeedIndex = "Round2Seed";
  } else if (heatDataIndex === "Round3Heat") {
    currentRoundSeedIndex = "Round3Seed";
  }

  // get the next round seed index
  let nextRoundSeed;
  if (heatDataIndex === "Round2Heat") {
    nextRoundSeed = "Round3Seed";
  } else if (heatDataIndex === "Round1Heat") {
    nextRoundSeed = "Round2Seed";
  } else if (heatDataIndex === "Round3Heat") {
    nextRoundSeed = "FinalResult";
  }

  // get the next round heat index
  let nextHeatIndex;
  if (heatDataIndex === "Round1Heat") {
    nextHeatIndex = "Round2Heat";
  } else if (heatDataIndex === "Round2Heat") {
    nextHeatIndex = "Round3Heat";
  }

  // get all the racers in the selected racer's heat and sort them by highest to lowest seed
  const racerHeat = racers
    .filter(racer => racer[heatDataIndex] === row[heatDataIndex])
    .sort((a, b) => a - b);

  // copy the racers around to use for getting the last heat
  const sortRacers = [...racers];

  // get the last heat
  const lastHeat = sortRacers
    .sort((a, b) => b[heatDataIndex] - a[heatDataIndex])
    .find(racer => racer.Gender === row.Gender)[heatDataIndex];

  // get the index of the object of the seed that corresponds to the racer's placement after the heat
  const indexOfPostRaceSeedWithinCurrentRound = row[roundResultKey] - 1;

  // using the index, get the index of what seed they actually placed as based on their results
  const seedWithinCurrentRound = parseInt(
    racerHeat[indexOfPostRaceSeedWithinCurrentRound][currentRoundSeedIndex]
  );

  // find the heat within the current round
  const heatWithinCurrentRound = parseInt(
    racerHeat[indexOfPostRaceSeedWithinCurrentRound][heatDataIndex]
  );

  // handle the heat 1 edge since racers seeded 1-4 will just move on to next round
  if (row.Round1Heat === 1 && row[roundResultKey] <= 4) {
    row[nextRoundSeed] = seedWithinCurrentRound;
    row[nextHeatIndex] = heatWithinCurrentRound;
  }
  // racers 5-6 increase their seed by two and increment the heat by two
  if (row.Round1Heat === 1 && row[roundResultKey] > 4) {
    row[nextRoundSeed] = seedWithinCurrentRound + 2;
    row[nextHeatIndex] = heatWithinCurrentRound + 2;
  }

  // handle all the heats between the first and the last heat
  // racers who are the top two in the heat move up two seeds and up a heat
  if (row.Round1Heat > 1 && row[roundResultKey] <= 2) {
    row[nextRoundSeed] = seedWithinCurrentRound - 2;
    row[nextHeatIndex] = heatWithinCurrentRound - 2;
  }
  // racers who placed in the middle two retain their current seed and heat
  if (
    row.Round1Heat > 1 &&
    row[roundResultKey] > 2 &&
    row[roundResultKey] <= 4
  ) {
    row[nextRoundSeed] = seedWithinCurrentRound;
    row[nextHeatIndex] = heatWithinCurrentRound;
  }
  // racers who are the last two in their heat move down two seeds and increment heat by two
  if (row.Round1Heat > 1 && row[roundResultKey] > 4) {
    row[nextRoundSeed] = seedWithinCurrentRound + 2;
    row[nextHeatIndex] = heatWithinCurrentRound + 2;
  }

  // handle the last heat edge since racers seeded 3-6 will just move on to next round and stay in the same heat
  if (row[heatDataIndex] === lastHeat && row[roundResultKey] <= 2) {
    row[nextRoundSeed] = seedWithinCurrentRound - 2;
    row[nextHeatIndex] = heatWithinCurrentRound - 2;
  }
  if (row[heatDataIndex] === lastHeat && row[roundResultKey] > 2) {
    row[nextRoundSeed] = seedWithinCurrentRound;
    row[nextHeatIndex] = heatWithinCurrentRound;
  }
  // consider creating a handler to set final results instead of hacking this
  if (nextRoundSeed === "FinalResult") {
    row[nextRoundSeed] = seedWithinCurrentRound;
  }
  return row;
}

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

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: true
  };

  toggleEdit = () => {
    // const editing = !this.state.editing;
    // this.setState({ editing }, () => {
    //   if (editing) {
    //     this.input.focus();
    //   }
    // });
  };

  save = (e, dataIndex, heatDataIndex) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values }, dataIndex, heatDataIndex);
    });
  };

  renderCell = form => {
    this.form = form;
    // title in props
    const { children, dataIndex, record, heatDataIndex } = this.props;
    // const { editing } = this.state;
    // replace editing so it is not dependent on toggle, but heat
    return this.state.editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [],
          initialValue: record[dataIndex]
        })(
          <Select
            ref={node => (this.input = node)}
            onSelect={event => this.save(event, dataIndex, heatDataIndex)}
            onBlur={event => this.save(event, dataIndex, heatDataIndex)}
            style={{ width: 120 }}
          >
            <Option value={1}>1</Option>
            <Option value={2}>2</Option>
            <Option value={3}>3</Option>
            <Option value={4}>4</Option>
            <Option value={5}>5</Option>
            <Option value={6}>6</Option>
          </Select>
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      heatDataIndex,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

export function Manage() {
  const [racers, setRacers] = useState([]);

  // Load mock data
  useEffect(() => {
    setHeats(data);
    setRacers(data);
  }, []);

  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    accept: ".csv",
    headers: {
      authorization: "authorization-text"
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        readCSV(info).then(csvData => {
          setRacers(csvData);
        });
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };

  const handleSave = (row, dataIndex, heatDataIndex) => {
    const index = racers.findIndex(item => row.Bib === item.Bib);
    const editRacers = [...racers];
    editRacers[index] = row;
    editRacers[index] = setSeed(
      editRacers[index],
      editRacers,
      dataIndex,
      heatDataIndex
    );
    setRacers(editRacers);
  };

  const columnsEditable = columns.map(col => {
    col.filters = heatFilters;
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
        heatDataIndex: col.heatDataIndex
      })
    };
  });

  const columnsEditableRound2 = columnsRound2.map(col => {
    col.filters = heatFilters;
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
        heatDataIndex: col.heatDataIndex
      })
    };
  });

  const columnsEditableRound3 = columnsRound3.map(col => {
    col.filters = heatFilters;
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
        heatDataIndex: col.heatDataIndex
      })
    };
  });

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell
    }
  };

  console.info("RACERS: ", racers);

  return (
    <div>
      <h2>Manage</h2>
      <h3>Create Race</h3>
      <Upload {...props}>
        <Button>
          <Icon type="upload" /> Click to Upload
        </Button>
      </Upload>

      <h3>Round 1</h3>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        columns={columnsEditable}
        dataSource={racers}
        rowKey="Bib"
      />

      <hr />
      <div style={{ padding: "30px" }}></div>
      <h3>Round 2</h3>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        columns={columnsEditableRound2}
        dataSource={racers}
        rowKey="Bib"
      />

      <hr />
      <div style={{ padding: "30px" }}></div>
      <h3>Round 3</h3>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        columns={columnsEditableRound3}
        dataSource={racers}
        rowKey="Bib"
      />

      <hr />
      <div style={{ padding: "30px" }}></div>
      <h3>Final Results</h3>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        columns={columnsFinalResults}
        dataSource={racers}
        rowKey="Bib"
      />
    </div>
  );
}
