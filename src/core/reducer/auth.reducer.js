import { AuthActions } from "../actions";

const INITIAL_STATE = {
  isLoggedIn: false
};

const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AuthActions.SET_IS_LOGGED_IN: {
      const auth = { ...state };
      const isLoggedIn = action.payload;
      auth.isLoggedIn = isLoggedIn;
      return auth;
    }
    default:
      return state;
  }
};

export default auth;
