import React from "react";
import { Select } from "antd";
import { setSeed } from "../../core/actions/index.js";
import { connect } from "react-redux";

const { Option } = Select;

const SelectPlace = ({ row, heatIndex, resultIndex, setSeed }) => {
  return (
    <Select
      onSelect={place => setSeed({ row, heatIndex, resultIndex, place })}
      value={row[resultIndex]}
      style={{ width: 80 }}
    >
      <Option value={1}>1</Option>
      <Option value={2}>2</Option>
      <Option value={3}>3</Option>
      <Option value={4}>4</Option>
      <Option value={5}>5</Option>
      <Option value={6}>6</Option>
    </Select>
  );
};

const mapDispatchToProps = dispatch => ({
  setSeed: ({ row, heatIndex, resultIndex, place }) =>
    dispatch(setSeed({ row, heatIndex, resultIndex, place }))
});

export default connect(null, mapDispatchToProps)(SelectPlace);
