import React, { useState, useEffect } from "react";
import { Table, Typography, Select } from "antd";
import { uniqBy } from "lodash";
import UploadCsv from "../../components/UploadCsv/UploadCsv";
import DownloadCsv from "../../components/DownloadCsv/DownloadCsv";
import "./StateQualifiersHome.css";

const { Title } = Typography;
const { Option } = Select;

function StateQualifiersHome() {
  const [allRacers, setAllRacers] = useState([]);
  const [qualifiers, setQualifiers] = useState([]);
  const [tableColumns, setColumns] = useState([]);
  const [numberOfRacesToQualify, setNumberOfRacesToQualify] = useState(3);

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName"
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName"
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName"
    },
    {
      title: "School",
      dataIndex: "school",
      key: "school",
      filters: [],
      onFilter: (value, record) => {
        record.school = record.school || "";
        return record.school.includes(value);
      },
      sorter: (a, b) => {
        a.school = a.school || "";
        b.school = b.school || "";
        return a.school.localeCompare(b.school);
      }
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "gender"
    }
  ];

  function createFilterOptions() {
    const uniqueSchools = uniqBy(qualifiers, "school");
    return uniqueSchools
      .map(racer => {
        racer.school = racer.school || "";
        return {
          text: racer.school.toString(),
          value: racer.school
        };
      })
      .sort((a, b) => a.value - b.value);
  }

  function findKidsWithThreeRaces(csvData) {
    const kidsWithThreeRaces = [];
    csvData.forEach((row, rowIndex) => {
      let rowCount = 0;
      csvData.forEach((item, itemIndex) => {
        if (item.fullName.toLowerCase() === row.fullName.toLowerCase()) {
          rowCount = rowCount + 1;
        }
        if (rowCount >= numberOfRacesToQualify) {
          row.fullName = row.fullName.toLowerCase();
          kidsWithThreeRaces.push(row);
        }
        if (itemIndex + 1 === csvData.length) {
          rowCount = 0;
        }
      });
    });
    const uniqueList = uniqBy(kidsWithThreeRaces, "fullName");
    return uniqueList;
  }

  const handleUpload = data => {
    setAllRacers(data);
    const calculatedQualifiers = findKidsWithThreeRaces(data);
    setQualifiers(calculatedQualifiers);
  };

  useEffect(() => {
    let schoolCol = columns.find(col => col.key === "school");
    schoolCol.filters = createFilterOptions();
    setColumns(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qualifiers, columns]);

  useEffect(() => {
    const calculatedQualifiers = findKidsWithThreeRaces(allRacers);
    setQualifiers(calculatedQualifiers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfRacesToQualify, allRacers]);

  return (
    <div>
      <h2>State Qualifiers</h2>
      <p>
        Welcome to the State Qualifiers tool. Simply upload your formatted
        results to calculate the state qualifiers.
      </p>
      <UploadCsv name="Upload Results" handleClick={handleUpload} />

      <div className="select-qualifying-races">
        <strong>Select number of races to qualify.</strong>
        <strong className="d-block">*Defaults to 3 races.</strong>
      </div>
      <Select
        onSelect={selection => setNumberOfRacesToQualify(selection)}
        style={{ width: 100 }}
        defaultValue={3}
      >
        <Option value={1}>1</Option>
        <Option value={2}>2</Option>
        <Option value={3}>3</Option>
        <Option value={4}>4</Option>
        <Option value={5}>5</Option>
        <Option value={6}>6</Option>
      </Select>

      <Title level={4} style={{ marginTop: "2rem" }}>
        All Racers
      </Title>
      <Table dataSource={allRacers} columns={tableColumns} rowKey="uuid" />

      <Title level={4} style={{ marginTop: "2rem" }}>
        Qualified Racers
      </Title>
      <Table dataSource={qualifiers} columns={tableColumns} rowKey="uuid" />

      <DownloadCsv
        btnName="Download Qualifiers"
        fileName="qualifiers.csv"
        data={qualifiers}
        style={{ marginTop: "2rem" }}
      />
    </div>
  );
}

export default StateQualifiersHome;
