import React from "react";
import {Tag} from "antd";

function EventItem({data}) {
  const {eventDescription, city, country, eventTime, status} = data;

  return (
    <div className="gx-media gx-featured-item">

      <div className="gx-featured-thumb">
        {/* <img className="gx-rounded-lg" src="" alt="..."/> */}
      </div>
      <div className="gx-media-body gx-featured-content">
        <div className="gx-featured-content-left">
          {/* <Tag className="gx-rounded-xs gx-text-uppercase" color="#06BB8A">{status}</Tag> */}
          <h3 className="gx-mb-2">{eventDescription}</h3>
          <div className="ant-row-flex">
            <div className="gx-media gx-text-grey gx-mb-1">
              <i className={`icon icon-location gx-fs-lg gx-mr-2 gx-d-inline-flex gx-vertical-align-middle`}/>
              <span className="gx-media-body gx-ml-1">{city} {country}</span>
            </div>
          </div>
        </div>
        <div className="gx-featured-content-right gx-profile-content-right">
          <h2 className="gx-text-primary gx-mb-1">
            <i className={`icon icon-calendar gx-fs-lg gx-mr-2 gx-d-inline-flex gx-vertical-align-middle`}/> <span
            className="gx-d-inline-flex gx-vertical-align-middle">{eventTime}</span>
          </h2>
          {/* <p className="gx-text-primary gx-text-truncate gx-mt-sm-auto gx-mb-0 gx-pointer">Check in detail <i
            className={`icon icon-long-arrow-right gx-fs-xxl gx-ml-1 gx-ml-sm-2 gx-d-inline-flex gx-vertical-align-middle`}/>
          </p> */}
        </div>

      </div>
    </div>
  );
}

export default EventItem;
