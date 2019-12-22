export const setRacersToStore = racers => ({
  type: "SET_RACERS",
  racers
});

export const setSeed = payload => ({
  type: "SET_SEED",
  payload
});

export const RacerActions = {
  SET_RACERS: "SET_RACERS",
  SET_SEED: "SET_SEED"
};

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
  CREATE_RACE_FAILURE: "CREATE_RACE_FAILURE"
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
