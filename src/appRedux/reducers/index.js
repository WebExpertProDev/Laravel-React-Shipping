import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import Settings from "./Settings";
import Auth from "./Auth";
import Common from "./Common";
import Book from "./Book";
import Tracking from "./Tracking";
import Admin from "./Admin";
import User from "./User";

const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  commonData: Common,
  book: Book,
  tracking: Tracking,
  admin: Admin,
  user: User
});

export default reducers;
