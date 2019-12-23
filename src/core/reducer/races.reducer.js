import { RacesActions } from "../actions";

const INITIAL_STATE = {
  loading: {
    createRace: false,
    getRacesByUser: false
  },
  loaded: {
    createRace: false,
    getRacesByUser: false
  },
  races: []
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
        races: action.payload
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
        races: [...state.races, action.payload]
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
    default:
      return state;
  }
};

export default racesState;
