import React, { useState, useEffect } from "react";
import { Upload, message, Button, Icon, Table, Form, Select } from "antd";
import parse from "csv-parse";

var data = require("../../mocks/mock-data.json");

const { Option } = Select;

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
}

// TODO: NEEDS TO HANDLE DIFFERENT ROUNDS
// TODO: NEEDS TO SET THE USERS NEXT ROUND HEAT
function setSeed(row, racers, roundResultKey, heatDataIndex) {
  console.info("ROUND KEY: ", roundResultKey);
  console.info("Heat DATA INDEX: ", heatDataIndex);

  let roundSeed;
  if (heatDataIndex === "Round2Heat") {
    roundSeed = "Round3Seed";
  } else if (heatDataIndex === "Round1Heat") {
    roundSeed = "Round2Seed";
  }
  // get all the racers in the selected racer's heat and sort them by highest to lowest seed
  const racerHeat = racers
    .filter(racer => racer[heatDataIndex] === row[heatDataIndex])
    .sort((a, b) => a - b);

  const sortRacers = [...racers];

  // get the last heat
  const lastHeat = sortRacers
    .sort((a, b) => b[heatDataIndex] - a[heatDataIndex])
    .find(racer => racer.Gender === row.Gender)[heatDataIndex];

  // get the index of the object of the seed that corresponds to the racer's placement after the heat
  const indexOfPostRaceSeedWithinCurrentRound = row[roundResultKey] - 1;

  // using the index, get the index of what seed they actually placed as based on their results
  const seedWithinCurrentRound = parseInt(
    racerHeat[indexOfPostRaceSeedWithinCurrentRound].Seed
  );

  // handle the heat 1 edge since racers seeded 1-4 will just move on to next round
  if (row.Round1Heat === 1 && row[roundResultKey] <= 4) {
    row[roundSeed] = seedWithinCurrentRound;
  }
  if (row.Round1Heat === 1 && row[roundResultKey] > 4) {
    row[roundSeed] = seedWithinCurrentRound + 2;
  }

  // handle all the heats between the first and the last heat
  // racers who are the top two in the heat move up two seeds
  if (row.Round1Heat > 1 && row[roundResultKey] <= 2) {
    row[roundSeed] = seedWithinCurrentRound - 2;
  }
  // racers who placed in the middle two retain their current seed
  if (
    row.Round1Heat > 1 &&
    row[roundResultKey] > 2 &&
    row[roundResultKey] <= 4
  ) {
    row[roundSeed] = seedWithinCurrentRound;
  }
  // racers who are the last two in their heat move down two seeds
  if (row.Round1Heat > 1 && row[roundResultKey] > 4) {
    row[roundSeed] = seedWithinCurrentRound + 2;
  }

  // handle the last heat edge since racers seeded 3-6 will just move on to next round
  if (row[heatDataIndex] === lastHeat && row[roundResultKey] <= 2) {
    row[roundSeed] = seedWithinCurrentRound - 2;
  }
  if (row[heatDataIndex] === lastHeat && row[roundResultKey] > 2) {
    row[roundSeed] = seedWithinCurrentRound;
  }
  return row;
}

const columns = [
  {
    title: "Seed",
    dataIndex: "Seed"
  },
  {
    title: "Name",
    dataIndex: "Name"
  },
  {
    title: "Gender",
    dataIndex: "Gender"
  },
  {
    title: "Team Name",
    dataIndex: "Team name"
  },
  {
    title: "Round 1 Heat",
    dataIndex: "Round1Heat"
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
    dataIndex: "Round2Seed"
  },
  {
    title: "Name",
    dataIndex: "Name"
  },
  {
    title: "Gender",
    dataIndex: "Gender"
  },
  {
    title: "Team Name",
    dataIndex: "Team name"
  },
  {
    title: "Round 2 Heat",
    dataIndex: "Round2Heat"
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
    dataIndex: "Round3Seed"
  },
  {
    title: "Name",
    dataIndex: "Name"
  },
  {
    title: "Gender",
    dataIndex: "Gender"
  },
  {
    title: "Team Name",
    dataIndex: "Team name"
  },
  {
    title: "Round 3 Heat",
    dataIndex: "Round3Heat"
  },
  {
    title: "Round 3 Result",
    dataIndex: "Round3Result",
    heatDataIndex: "Round3Heat",
    editable: true
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
    </div>
  );
}
