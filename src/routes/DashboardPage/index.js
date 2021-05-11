import React from "react";

import IntlMessages from "util/IntlMessages";

const DashboardPage = () => {
  return (
    <div>
      <h2 className="title gx-mb-4"><IntlMessages id="sidebar.info"/></h2>

      <div className="gx-d-flex justify-content-center">
        <h4>Start booking your shipment. Happy Travel!</h4>
      </div>

    </div>
  );
};

export default DashboardPage;
