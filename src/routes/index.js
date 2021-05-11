import React from "react";
import {Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";
import InfoView from "components/InfoView";
import Admin from "./AdminPage/index";
import MyAccount from "./MyAccountPage/index";

const App = ({match}) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      <Route path={`${match.url}dashboard`} component={asyncComponent(() => import('./DashboardPage'))}/>
      <Route path={`${match.url}booknow`} component={asyncComponent(() => import('./BooknowPage'))}/>
      <Route path={`${match.url}tracking`} component={asyncComponent(() => import('./TrackingPage'))}/>
      <Route path={`${match.url}prices`} component={asyncComponent(() => import('./PricesPage'))}/>
      <Route path={`${match.url}info`} component={asyncComponent(() => import('./TrackingInfoPage'))}/>
      <Route path={`${match.url}u`} component={MyAccount}/>
      <Route path={`${match.url}admin`} component={Admin}/>
    </Switch> 
  </div>
);

export default App;
