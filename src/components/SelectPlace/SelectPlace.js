import React, { useContext } from "react";
import { Select } from "antd";
import { store } from "../../store/store.js";

const { Option } = Select;

export const SelectPlace = ({ row, heatIndex, resultIndex }) => {
  const globalState = useContext(store);
  const { dispatch } = globalState;
  return (
    <Select
      onSelect={place =>
        dispatch({
          type: "SET_SEED",
          payload: { row, heatIndex, resultIndex, place }
        })
      }
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
