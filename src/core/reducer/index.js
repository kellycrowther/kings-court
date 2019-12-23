import { combineReducers } from "redux";
import auth from "./auth.reducer";
import racesState from "./races.reducer";

export default combineReducers({
  auth,
  racesState
});
