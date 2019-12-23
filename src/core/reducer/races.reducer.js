import { RacesActions } from "../actions";
import { setSeed } from "../../helpers/setSeed";

const INITIAL_STATE = {
  loading: {
    createRace: false,
    getRacesByUser: false,
    updateRace: false,
    deleteRace: false
  },
  loaded: {
    createRace: false,
    getRacesByUser: false,
    updateRace: false,
    deleteRace: false
  },
  races: [],
  currentRace: {
    results: []
  }
};

const racesState = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RacesActions.GET_RACES_BY_USER: {
      return {
        ...state,
        loading: {
          ...state.loading,
          getRacesByUser: true
        },
        loaded: {
          ...state.loaded,
          getRacesByUser: false
        }
      };
    }

    case RacesActions.GET_RACES_BY_USER_SUCCESS: {
      return {
        ...state,
        loading: {
          ...state.loading,
          getRacesByUser: false
        },
        loaded: {
          ...state.loaded,
          getRacesByUser: true
        },
        races: [...action.payload]
      };
    }

    case RacesActions.GET_RACES_BY_USER_FAILURE: {
      return {
        ...state,
        loading: {
          ...state.loading,
          getRacesByUser: false
        },
        loaded: {
          ...state.loaded,
          getRacesByUser: false
        }
      };
    }

    case RacesActions.CREATE_RACE: {
      return {
        ...state,
        loading: {
          ...state.loading,
          createRace: true
        },
        loaded: {
          ...state.loaded,
          createRace: false
        }
      };
    }

    case RacesActions.CREATE_RACE_SUCCESS: {
      return {
        ...state,
        loading: {
          ...state.loading,
          createRace: false
        },
        loaded: {
          ...state.loaded,
          createRace: true
        },
        races: [...state.races, action.payload],
        currentRace: action.payload
      };
    }

    case RacesActions.CREATE_RACE_FAILURE: {
      return {
        ...state,
        loading: {
          ...state.loading,
          getRacesByUser: false
        },
        loaded: {
          ...state.loaded,
          getRacesByUser: false
        }
      };
    }

    case RacesActions.SET_CURRENT_RACE: {
      return {
        ...state,
        currentRace: action.payload
      };
    }

    case RacesActions.SET_CURRENT_RACE_SEED: {
      const racers = [...state.currentRace.results];
      const { row, heatIndex, resultIndex, place } = action.payload;
      const index = racers.findIndex(item => row.Bib === item.Bib);
      racers[index][resultIndex] = place;
      racers[index] = setSeed(row, racers, resultIndex, heatIndex);
      return {
        ...state,
        currentRace: {
          ...state.currentRace,
          results: racers
        }
      };
    }

    case RacesActions.UPDATE_RACE: {
      return {
        ...state,
        loading: {
          ...state.loading,
          updateRace: true
        },
        loaded: {
          ...state.loaded,
          updateRace: false
        }
      };
    }

    case RacesActions.UPDATE_RACE_SUCCESS: {
      const updatedRace = action.payload;
      const raceToUpdate = state.races.findIndex(
        race => race.id === updatedRace.id
      );
      let updatedRaces = [...state.races];
      updatedRaces[raceToUpdate] = updatedRace;
      return {
        ...state,
        loading: {
          ...state.loading,
          updateRace: false
        },
        loaded: {
          ...state.loaded,
          updateRace: true
        },
        races: updatedRaces
      };
    }

    case RacesActions.UPDATE_RACE_FAILURE: {
      return {
        ...state,
        loading: {
          ...state.loading,
          updateRace: false
        },
        loaded: {
          ...state.loaded,
          updateRace: false
        }
      };
    }

    case RacesActions.DELETE_RACE: {
      return {
        ...state,
        loading: {
          ...state.loading,
          deleteRace: true
        },
        loaded: {
          ...state.loaded,
          deleteRace: false
        }
      };
    }
    case RacesActions.DELETE_RACE_SUCCESS: {
      const index = state.races.findIndex(
        race => race.id === action.payload.id
      );
      const newRaces = [...state.races];
      newRaces.splice(index, 1);
      return {
        ...state,
        loading: {
          ...state.loading,
          deleteRace: false
        },
        loaded: {
          ...state.loaded,
          deleteRace: true
        },
        currentRace: {},
        races: newRaces
      };
    }
    case RacesActions.DELETE_RACE_FAILURE: {
      return {
        ...state,
        loading: {
          ...state.loading,
          deleteRace: false
        },
        loaded: {
          ...state.loaded,
          deleteRace: false
        }
      };
    }
    default:
      return state;
  }
};

export default racesState;
