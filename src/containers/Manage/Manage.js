import React, { useState, useEffect } from "react";
import { Upload, message, Button, Icon, Table, Form, Select } from "antd";

import parse from "csv-parse";

var data = require("../../mocks/mock-data.json");

const { Option } = Select;

function readCSV(info) {
  const csvData = [];
  let reader = new FileReader();
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
  let currentFemaleHeat = 1;
  let currentMaleHeat = 2;
  let currentFemaleCount = 0;
  let currentMaleCount = 0;
  csvData.map(row => {
    if (row.Gender === "Female" && currentFemaleCount <= 6) {
      row.Round1Heat = currentFemaleHeat;
      currentFemaleCount = currentFemaleCount < 6 ? currentFemaleCount + 1 : 1;
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
    editable: true
  }
];

const columnsRound2 = [
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
    title: "Round 2 Heat",
    dataIndex: "Round2Heat"
  },
  {
    title: "Round 2 Result",
    dataIndex: "Round2Result",
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

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    // title in props
    const { children, dataIndex, record } = this.props;
    // const { editing } = this.state;
    return this.state.editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [],
          initialValue: record[dataIndex]
        })(
          <Select
            ref={node => (this.input = node)}
            onSelect={this.save}
            onBlur={this.save}
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
        {/* fix the edit so it is not dependent on toggle, but heat */}
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

  const handleSave = row => {
    const index = racers.findIndex(item => row.Bib === item.Bib);
    const editRacers = [...racers];
    editRacers[index] = row;
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
        handleSave: handleSave
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
        handleSave: handleSave
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

      <h3>Round 2</h3>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        columns={columnsEditableRound2}
        dataSource={racers}
        rowKey="Bib"
      />
    </div>
  );
}
