import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { uniqBy } from "lodash";
import UploadCsv from "../../components/UploadCsv/UploadCsv";

function StateQualifiersHome() {
  const [qualifiers, setQualifiers] = useState([]);
  const [tableColumns, setColumns] = useState([]);

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

  const handleUpload = data => {
    console.info("DATA: ", data);
    setQualifiers(data);
  };

  useEffect(() => {
    let schoolCol = columns.find(col => col.key === "school");
    schoolCol.filters = createFilterOptions();
    setColumns(columns);
  }, [qualifiers]);

  return (
    <div>
      <h2>State Qualifiers</h2>
      <p>
        Welcome to the State Qualifiers tool. Simply upload your formatted
        results to calculate the state qualifiers.
      </p>

      <UploadCsv name="Upload Results" handleClick={handleUpload} />

      <Table dataSource={qualifiers} columns={tableColumns} rowKey="uuid" />
    </div>
  );
}

export default StateQualifiersHome;
