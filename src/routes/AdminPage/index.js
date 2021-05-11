import React from "react";
import {Route, Switch} from "react-router-dom";
import asyncComponent from "../../util/asyncComponent";

const Admin = ({match}) => (
  <Switch>
    {/* <Route path={`${match.url}/layouts`} component={Layouts}/> */}
    <Route path={`${match.url}/users`} component={asyncComponent(() => import('./UsersPage/index'))}/>
    <Route path={`${match.url}/books`} component={asyncComponent(() => import('./BooksPage/index'))}/>
  </Switch>
);

export default Admin;
