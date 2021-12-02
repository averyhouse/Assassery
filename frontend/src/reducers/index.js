import { combineReducers } from 'redux';
import auth from "./auth";
import game from "./game";

const assasseryFrontend = combineReducers({
  auth,
  game
})

export default assasseryFrontend;