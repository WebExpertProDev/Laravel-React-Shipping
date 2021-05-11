import React, {Component} from "react";
import {Button, Card, Form, Icon, Input, message, Row, Col, AutoComplete} from "antd";
import {connect} from "react-redux";
import {getTrackingInfo} from "../../appRedux/actions/Tracking";
import InfoView from "components/InfoView";

const FormItem = Form.Item;

class TrackingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("values", values);
      if (!err) {
        //this.props.showAuthLoader();
        this.props.getTrackingInfo({payload: values, token: this.props.token});
      }
    });
  }

  componentDidUpdate() {
    
  }

  render() {

    const {getFieldDecorator} = this.props.form;
    const {error} = this.props;
    
    return (
      <>
      <Card className="gx-card" title="Save your package">
      
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <p>you can access information about your shipments whenever and wherever you want. Tracking information about your shipments is always 
                    available on DHL and POSTNORD  and through other optional services.</p>

                <p>Fill in your order or package number.</p>

                <p>Test value for Postnord is 96932007555SE</p>
                <p>Test value for Bring is TESTPACKAGE-AT-PICKUPPOINT</p>
            </Col>
          </Row>

          <Row>
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>

              </Col>
          
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                <Form onSubmit={this.handleSubmit} className="gx-login-form gx-form-row0">
                    <FormItem>
                        {getFieldDecorator('id', {
                        rules: [{required: true, message: 'Please input your order ID!'}],
                        })(
                        <Input placeholder="Order ID"/>
                        )}
                    </FormItem>
                    <FormItem className="gx-text-center gx-pt-sm-3">
                        <Button type="primary" htmlType="submit" className="gx-btn gx-btn-primary gx-text-white gx-mb-1" onClick={this.handleSubmit} >
                        TRACK YOUR PACKAGE
                        </Button>
                    </FormItem>

                    {error && 
                    <div className="gx-text-center gx-pt-sm-3 gx-text-red">
                        <p>{error}</p>
                    </div>
                    }
                    
                </Form>

              </Col>
          
              <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                  
              </Col>
          </Row>
        <InfoView/>
      </Card>
      </>
    );
  }
}

const WrappedTrackingPageForm = Form.create()(TrackingPage);
const mapStateToProps = ({auth, tracking}) => {
  const {token} = auth;
  const {error} = tracking;
  return {token, error}
};

export default connect(mapStateToProps, {getTrackingInfo})(WrappedTrackingPageForm);
