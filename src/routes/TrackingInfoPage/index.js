import React, {Component} from "react";
import {Button, Card, Form, Icon, Row, Col, Tag} from "antd";
import {connect} from "react-redux";
import Widget from "components/Widget/index";
import EventItem from "./EventItem";
import InfoView from "components/InfoView";

const FormItem = Form.Item;

class TrackingInfoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {

    const {shipments} = this.props;

    return (
      <>
      
          <Row>
              {shipments.map( (shipment) => 
                    
                    shipment.items.map( item =>
                        <Col xl={18} lg={18} md={18} sm={18} xs={24}>
                                <Widget styleName="gx-card-profile">
                                    <div className="ant-card-head">
                                        <span className="ant-card-head-title gx-mb-1"> Item ID: {item.itemId}</span>
                                        <p className="gx-text-grey gx-fs-sm gx-mb-0">Drop off Date: {item.dropOffDate}</p>
                                        <p className="gx-text-grey gx-fs-sm gx-mb-0">Type of Item: {item.typeOfItem}</p>
                                        <Tag className="gx-rounded-xs gx-text-uppercase" color="#06BB8A">{item.statusText.header}</Tag>
                                    </div>
                                    <div className="gx-pt-md-3">
                                        { item.events.map( eve => 
                                              <EventItem data={{
                                                  eventDescription: eve.eventDescription,
                                                  eventTime: eve.eventTime,
                                                  status: eve.status,
                                                  city: eve.location.city,
                                                  country: eve.location.country
                                                }}/>  
                                        )}
                                    </div>
                                </Widget>
                            </Col>
                    ) 
              )}
              <InfoView/>
          </Row>
        
      </>
    );
  }
}

const WrappedTrackingInfoPageForm = Form.create()(TrackingInfoPage);
const mapStateToProps = ({auth, tracking}) => {
  const {token} = auth;
  const {shipments} = tracking;
  return {token, shipments}
};

export default connect(mapStateToProps)(WrappedTrackingInfoPageForm);
