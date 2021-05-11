import React, {Component} from "react";
import {Button, Card, message, Steps} from "antd";
import FirstContent from "./FirstContent/index";
import SecondContent from "./SecondContent/index";
import ThirdContent from "./ThirdContent/index";
import IntlMessages from "util/IntlMessages";
import {connect} from "react-redux";
import "./index.css";
import InfoView from "components/InfoView";

const Step = Steps.Step;

const steps = [{
  title: 'Find Possible Services',
  content: <FirstContent/>,
}, {
  title: 'Select Service',
  content: <SecondContent/>,
}, {
  title: 'Request a Shipment',
  content: <ThirdContent/>,
}];

class BooknowPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  // next() {
  //   const current = this.state.current + 1;
  //   this.setState({current});
  // }

  // prev() {
  //   const current = this.state.current - 1;
  //   this.setState({current});
  // }

  render() {
    const current = this.props.current;
    return (
      <>
      <Card className="gx-card" title="Easy Steps for Booking">
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title}/>)}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {/* {
            current < steps.length - 1
            &&
            <Button type="primary" onClick={() => this.next()}>Next</Button>
          }
          {
            current === steps.length - 1
            &&
            <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
          }
          {
            current > 0
            &&
            <Button style={{marginLeft: 8}} onClick={() => this.prev()}>
              Previous
            </Button>
          } */}
        </div>
      </Card>
      
      </>
    );
  }
}

const mapStateToProps = ({auth, book}) => {
  const {token} = auth;
  const {current} = book;
  return {token, current}
};

export default connect(mapStateToProps)(BooknowPage);
