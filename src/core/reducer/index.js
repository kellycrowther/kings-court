import { combineReducers } from "redux";
import racers from "./racer.reducer";
import auth from "./auth.reducer";
import races from "./races.reducer";

export default combineReducers({
  racers,
  auth,
  races
});
