import React, { useState } from "react";
import { Upload, message, Button, Icon, Table } from "antd";

import parse from "csv-parse";

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
          resolve(csvData);
        });
    };
  });
}

const columns = [
  {
    title: "Seed",
    dataIndex: "Place"
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
    title: "Round 1 Result",
    dataIndex: "Round1Result"
  }
];

export function Manage() {
  const [racers, setRacers] = useState([]);

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

      <Table columns={columns} dataSource={racers} rowKey="Place" />
    </div>
  );
}
