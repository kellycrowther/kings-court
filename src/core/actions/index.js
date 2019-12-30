export const setIsLoggedIn = payload => ({
  type: "SET_IS_LOGGED_IN",
  payload
});

export const AuthActions = {
  SET_IS_LOGGED_IN: "SET_IS_LOGGED_IN"
};

export const RacesActions = {
  GET_RACES_BY_USER: "GET_RACES_BY_USER",
  GET_RACES_BY_USER_SUCCESS: "GET_RACES_BY_USER_SUCCESS",
  GET_RACES_BY_USER_FAILURE: "GET_RACES_BY_USER_FAILURE",

  CREATE_RACE: "CREATE_RACE",
  CREATE_RACE_SUCCESS: "CREATE_RACE_SUCCESS",
  CREATE_RACE_FAILURE: "CREATE_RACE_FAILURE",

  SET_CURRENT_RACE: "SET_CURRENT_RACE",

  SET_CURRENT_RACE_SEED: "SET_CURRENT_RACE_SEED",

  REMOVE_ALL_RACES: "REMOVE_ALL_RACES",

  UPDATE_RACE: "UPDATE_RACE",
  UPDATE_RACE_SUCCESS: "UPDATE_RACE_SUCCESS",
  UPDATE_RACE_FAILURE: "CUPDATE_RACE_FAILURE",

  DELETE_RACE: "DELETE_RACE",
  DELETE_RACE_SUCCESS: "DELETE_RACE_SUCCESS",
  DELETE_RACE_FAILURE: "DELETE_RACE_FAILURE",

  GET_RACE_BY_ID: "GET_RACE_BY_ID",
  GET_RACE_BY_ID_SUCCESS: "GET_RACE_BY_ID_SUCCESS",
  GET_RACE_BY_ID_FAILURE: "GET_RACE_BY_ID_FAILURE",

  GET_ALL_RACES: "GET_ALL_RACES",
  GET_ALL_RACES_SUCCESS: "GET_ALL_RACES_SUCCESS",
  GET_ALL_RACES_FAILURE: "GET_ALL_RACES_FAILURE"
};

export const getRacesByUser = payload => ({
  type: RacesActions.GET_RACES_BY_USER,
  payload
});

export const getRacesByUserSuccess = payload => ({
  type: RacesActions.GET_RACES_BY_USER_SUCCESS,
  payload
});

export const getRacesByUserFailure = payload => ({
  type: RacesActions.GET_RACES_BY_USER_FAILURE,
  payload
});

export const createRace = payload => ({
  type: RacesActions.CREATE_RACE,
  payload
});

export const createRaceSuccess = payload => ({
  type: RacesActions.CREATE_RACE_SUCCESS,
  payload
});

export const createRaceFailure = payload => ({
  type: RacesActions.CREATE_RACE_FAILURE,
  payload
});

export const setCurrentRace = payload => ({
  type: RacesActions.SET_CURRENT_RACE,
  payload
});

export const setCurrentRaceSeed = payload => ({
  type: RacesActions.SET_CURRENT_RACE_SEED,
  payload
});

export const updateRace = payload => ({
  type: RacesActions.UPDATE_RACE,
  payload
});

export const updateRaceSuccess = payload => ({
  type: RacesActions.UPDATE_RACE_SUCCESS,
  payload
});

export const updateRaceFailure = payload => ({
  type: RacesActions.UPDATE_RACE_FAILURE,
  payload
});

export const deleteRace = payload => ({
  type: RacesActions.DELETE_RACE,
  payload
});

export const deleteRaceSuccess = payload => ({
  type: RacesActions.DELETE_RACE_SUCCESS,
  payload
});

export const deleteRaceFailure = payload => ({
  type: RacesActions.DELETE_RACE_FAILURE,
  payload
});

export const getRaceById = payload => ({
  type: RacesActions.GET_RACE_BY_ID,
  payload
});

export const getRaceByIdSuccess = payload => ({
  type: RacesActions.GET_RACE_BY_ID_SUCCESS,
  payload
});

export const getRaceByIdFailure = payload => ({
  type: RacesActions.GET_RACE_BY_ID_FAILURE,
  payload
});

export const getRaces = payload => ({
  type: RacesActions.GET_ALL_RACES,
  payload
});

export const getRacesSuccess = payload => ({
  type: RacesActions.GET_ALL_RACES_SUCCESS,
  payload
});

export const getRacesFailure = payload => ({
  type: RacesActions.GET_ALL_RACES_FAILURE,
  payload
});

export const removeAllRaces = payload => ({
  type: RacesActions.REMOVE_ALL_RACES,
  payload
});
