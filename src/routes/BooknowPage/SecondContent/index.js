import React, {Component} from "react";
import {Button, Card, Form, Input, Select, Row, Col} from "antd";
import {connect} from "react-redux";
import {goToPrevStep} from "../../../appRedux/actions/Book";
import Widget from "components/Widget/index";
import {secondStepSubmit} from "../../../appRedux/actions/Book";
import InfoView from "components/InfoView";

const FormItem = Form.Item;
const Option = Select.Option;

class SecondContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        
    };
    this.handleClickButton = this.handleClickButton.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.goToPrevStep();    
  }

  handleClickButton = (value) => {
      //console.log(value);
      const {services} = this.props;
      let service = services.filter( element => element[0] == value).slice(0, 1);
      console.log(service);
      let service_new = service[0][1];
      let adnlServiceCode = service[0][1]['adnlServiceCode'];
      console.log("service:", service_new);
      console.log("additional services", adnlServiceCode);
      let payload = {
        ...service_new
      };
      this.props.secondStepSubmit({payload});
  }

  render() {
    const ButtonGroup = Button.Group;
    const {services} = this.props;
    //console.log(services);

/*    const services = [
      [
        "18",
        {
          adnlServiceCode: [],
          amountWithVAT: "Unkonwn ",
          amountWithoutVAT: "Unkonwn",
          deliveryType: "",
          descriptionText: "",
          displayName: "",
          formattedExpectedDeliveryDate: "",
          helpText: "",
          mainDisplayCategory: "",
          maxWeightInKgs: "",
          productName: "",
          serviceCode: "18",
          serviceCompany: "PostNord",
          serviceName: "Parcel",
          shortName: "",
          subDisplayCategory: "",
          vat: "",
          workingDays: "Unkonwn",
          currencyCode: "SEK"
        }
      ],
      [
        "0330",
        {
          adnlServiceCode: [],
          amountWithVAT: "468.51",
          amountWithoutVAT: "374.81",
          deliveryType: "Dør",
          descriptionText: "Pakken kan spores og utleveres på døren mellom kl. 8-16.",
          displayName: "Business Parcel",
          formattedExpectedDeliveryDate: "Unknown",
          helpText: "Business Parcel leveres på døren til bedrift mellom kl. 8 og 16. Sendingen kan spores ved hjelp av sporingsnummeret.",
          mainDisplayCategory: "Pakke",
          maxWeightInKgs: "35",
          productName: "Business Parcel",
          serviceCode: "0330",
          serviceCompany: "Bring",
          serviceName: "Pakke",
          shortName: "Business Parcel",
          subDisplayCategory: "Til bedrift",
          vat: "93.70",
          workingDays: "Unkonwn",
          currencyCode: "SEK"
        }
      ]
    ]; */
    

    return (
      <>
        <Form onSubmit={this.handleSubmit}>
        

            
            <Row>
                {services && services.map(item =>
                    <Col xl={6} lg={12} md={12} sm={12} xs={24}>
                      <Widget styleName="gx-ch-capitalize gx-card-sm-px" //extra={
                        // <ul className="gx-list-inline gx-ml-auto gx-mb-0 gx-text-grey">
                        //   <li><i className="icon icon-sweet-alert"/></li>
                        //   <li><i className="icon icon-invert-color"/></li>
                        //   <li><Dropdown overlay={menu} trigger={['click']}>
                        //     <span className="gx-link ant-dropdown-link gx-text-grey">
                        //       <i className="icon icon-chevron-down"/>
                        //     </span>
                        //   </Dropdown></li>
                        // </ul> }
                       title={item[1].serviceName}>
                        <div className="gx-text-center gx-pt-sm-3">
                          <img className="gx-mb-3" src={require(`assets/images/logo/${item[1].serviceCompany}.png`)} alt={item[1].serviceCompany}
                            style={{height: "60px", width: "auto", lineHeight: "60px"}}
                          />

                          <h2 className="gx-mb-3 gx-mb-sm-4">{item[1].workingDays} {item[1].workingTimeType}</h2>

                          {/* <ul className="gx-list-inline gx-mb-3 gx-mb-lg-4">
                            <li><Avatar src='https://via.placeholder.com/150x150'/></li>
                            <li><Avatar src='https://via.placeholder.com/150x150'/></li>
                            <li><Avatar src='https://via.placeholder.com/150x150'/></li>
                            <li><Avatar className="gx-bg-primary gx-text-white">Ms</Avatar></li>
                            <li><span className="ant-avatar gx-border gx-border-grey gx-bg-transparent gx-text-grey"><i
                              className="icon icon-add"/></span></li>
                          </ul> */}

                          <h3 className="gx-text-grey">{item[1].amountWithVAT} {item[1].currencyCode}</h3>
                          {/* <h4 className="gx-text-primary gx-mb-3 gx-mb-sm-4">Are You ready to book?</h4> */}
                          <ButtonGroup className="gx-mb-1">
                              <Button className="gx-btn-warning gx-mb-0" onClick={() => this.handleClickButton(item[1].serviceCode)}>Book Now</Button>
                          </ButtonGroup>
                        </div>
                      </Widget>
                    {/* <Widget styleName="gx-ch-capitalize gx-card-sm-px">
                    <div>
                        <div className="ant-card-head-title gx-mb-3">{item[1].serviceCompany}</div>
                        <h2 className="gx-mb-3">{item[1].serviceName}</h2>
                        <p className="gx-text-grey gx-fs-sm">{item[1].workingDays} Working Days</p>
                        <p>{item[1].amountWithVAT}</p>
                        <h4 className="gx-text-primary gx-mb-3 gx-mb-sm-4">Are You ready to book?</h4>
                        <ButtonGroup className="gx-mb-1">
                            <Button className="gx-btn-warning gx-mb-0" onClick={() => this.handleClickButton(item[1].serviceCode)}>Book Now</Button>
                        </ButtonGroup>
                    </div>
                    </Widget> */}
                    </Col>   
                )}
            </Row>
                

            <Card className="gx-card" title="Go Back to Previous Step">
                <FormItem
                    wrapperCol={{xs: 24, sm: {span: 12, offset: 5}}}
                >
                    <Button type="default" htmlType="submit">
                    Previous
                    </Button>
                </FormItem>
            
            </Card>


            <InfoView/>
        </Form>
        
      </>
    );
  }
}
const WrappedNormalSecondContent = Form.create()(SecondContent);

const mapStateToProps = ({auth, book}) => {
    const {token} = auth;
    const {services} = book;
    console.log(services);
    return {token, services}
  };
  
export default connect(mapStateToProps, {goToPrevStep, secondStepSubmit})(WrappedNormalSecondContent);
