import { setSeed } from "../../helpers/setSeed";

const racers = (state = [], action) => {
  switch (action.type) {
    case "SET_RACERS": {
      return action.racers;
    }

    case "SET_SEED":
      const racers = [...state];
      const { row, heatIndex, resultIndex, place } = action.payload;
      const index = racers.findIndex(item => row.Bib === item.Bib);
      racers[index][resultIndex] = place;
      racers[index] = setSeed(row, racers, resultIndex, heatIndex);
      return racers;
    default:
      return state;
  }
};

export default racers;
