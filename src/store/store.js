import React, { createContext, useReducer } from "react";
import { setSeed } from "../helpers/setSeed";

const initialState = {
  color: "red",
  racers: []
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_RACERS": {
        const state = { ...initialState };
        state.racers = action.payload;
        return state;
      }

      case "SET_SEED": {
        const racers = [...state.racers];
        const { row, heatIndex, resultIndex, place } = action.payload;
        const index = racers.findIndex(item => row.Bib === item.Bib);
        racers[index][resultIndex] = place;
        racers[index] = setSeed(row, racers, resultIndex, heatIndex);
        state = { ...state, state: [...racers] };
        return state;
      }
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
