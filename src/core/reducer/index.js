import { combineReducers } from "redux";
import racers from "./racer.reducer";
import auth from "./auth.reducer";

export default combineReducers({
  racers,
  auth
});
