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
