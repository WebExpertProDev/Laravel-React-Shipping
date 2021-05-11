import React from "react";
import {Route, Switch} from "react-router-dom";
import asyncComponent from "../../util/asyncComponent";

const MyAccount = ({match}) => (
  <Switch>
    <Route path={`${match.url}/profile`} component={asyncComponent(() => import('./ProfilePage/index'))}/>
    <Route path={`${match.url}/books`} component={asyncComponent(() => import('./BooksPage/index'))}/>
  </Switch>
);

export default MyAccount;
