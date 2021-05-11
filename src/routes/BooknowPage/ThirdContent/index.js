import React, {Component} from "react";
import {Button, Card, Form, Input, Select, Row, Col, Icon, DatePicker} from "antd";
import {connect} from "react-redux";
import {goToPrevStep} from "../../../appRedux/actions/Book";
import {postBookShipment} from "../../../appRedux/actions/Book";
import {getCountries} from  "country-state-picker";
import InfoView from "components/InfoView";

const FormItem = Form.Item;
const Option = Select.Option;

class ThirdContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        countries: []
    };
    this.handleClickButtonPrevStep = this.handleClickButtonPrevStep.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        let serviceName = this.props.service.serviceName;
        //let serviceNameLower = '';
        let serviceNameLower = serviceName.toLowerCase();
        console.log("service name", serviceNameLower);
        // Should format date value before submit.
        const payload = {
           ...values, 
          'readyPickupDate': values['readyPickupDate'].format('YYYY-MM-DDTHH:mm:ss.sssZ'),
          'latestPickupDate': values['latestPickupDate'].format('YYYY-MM-DDTHH:mm:ss.sssZ'),
          'earliestPickupDate': values['earliestPickupDate'].format('YYYY-MM-DDTHH:mm:ss.sssZ'),
          'basicServiceCode': this.props.service.serviceCode,
          'typeOfItem': serviceNameLower,
          'serviceCompany': this.props.service.serviceCompany,
          'items': this.props.items,
          'id': this.props.authUser.id
        };
        const token = this.props.token;

        console.log('Received values of form: ', payload);

        this.props.postBookShipment({payload, token});

      });
  }

  handleClickButtonPrevStep() {
    this.props.goToPrevStep();
  }

  componentDidMount() {
    let countries = getCountries();
    this.setState({countries});

    const {bookFrom, bookTo} = this.props;
    this.props.form.setFieldsValue({
        receiverPostalCode: bookTo.postalCode,
        receiverCountryCode: bookTo.countryCode,
        senderPostalCode: bookFrom.postalCode,
        senderCountryCode: bookFrom.countryCode
      });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {adnlServices} = this.props;
    const {countries} = this.state;
    const formItemLayout = {
        labelCol: {
          xs: {span: 24},
          sm: {span: 8},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
      };
      const config = {
        rules: [{type: 'object', required: true, message: 'Please select time!'}],
      };
    return (
      <>
        <Form onSubmit={this.handleSubmit}>

            <Card className="gx-card" title="Address Information">
                <Row>    
                    <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                        <h3 style={{marginBottom: 20, textAlign: "left"}}>Receiver:</h3>
                        <FormItem
                            label="Fist Name"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverFirstName', {
                            rules: [{required: true, message: 'Please input first name'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Last Name"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverLastName', {
                            rules: [{required: true, message: 'Please input last name'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Company Name"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverCompanyName', {
                            rules: [{}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Street Name"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverStreetName', {
                            rules: [{required: true, message: 'Please input street name'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Street Number"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverStreetNumber', {
                            rules: [{required: true, message: 'Please input street number'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Address"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverAddress1', {
                            rules: [{}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="City"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverCity', {
                            rules: [{required: true, message: 'Please input city'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Postal Code"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverPostalCode', {
                            rules: [],
                            })(
                            <Input placeholder="" disabled/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Country"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverCountryCode', {
                            rules: [],
                            })(
                                <Select
                                showSearch
                                placeholder=""
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                disabled
                                >
                                    {countries.map(item => <Option value={item.code}>{item.name}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="Phone Number"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverPhoneNumber', {
                            rules: [{required: true, message: 'Please input phone number'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Email Address"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('receiverEmailAddress', {
                            rules: [{}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                    </Col>
    
                    <Col xl={12} lg={12} md={12} sm={12} xs={24}>
                    <h3 style={{marginBottom: 20, textAlign: "left"}}>Receiver:</h3>
                        <FormItem
                            label="Fist Name"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderFirstName', {
                            rules: [{required: true, message: 'Please input first name'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Last Name"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderLastName', {
                            rules: [{required: true, message: 'Please input last name'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Company Name"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderCompanyName', {
                            rules: [{}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Street Name"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderStreetName', {
                            rules: [{required: true, message: 'Please input street name'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Street Number"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderStreetNumber', {
                            rules: [{required: true, message: 'Please input street number'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Address"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderAddress1', {
                            rules: [{}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="City"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderCity', {
                            rules: [{required: true, message: 'Please input city'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Postal Code"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderPostalCode', {
                            rules: [],
                            })(
                            <Input placeholder="" disabled/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Country"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderCountryCode', {
                            rules: [],
                            })(
                                <Select
                                showSearch
                                placeholder=""
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                disabled
                                >
                                    {countries.map(item => <Option value={item.code}>{item.name}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="Phone Number"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderPhoneNumber', {
                            rules: [{required: true, message: 'Please input phone number'}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                        <FormItem
                            label="Email Address"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('senderEmailAddress', {
                            rules: [{}],
                            })(
                            <Input placeholder=""/>
                            )}
                        </FormItem>
                    </Col>    
                </Row>
            </Card>
            
            <Card className="gx-card" title="ADDITIONAL SERVICE TYPE">
                
                <FormItem
                    label="Additional Shipment type"
                    labelCol={{xs: 24, sm: 5}}
                    wrapperCol={{xs: 24, sm: 12}}
                >
                    {getFieldDecorator('additionalServiceCode', {
                    //rules: [{required: true, message: 'Please select your additional shipment type!'}],
                    })(
                    <Select
                        placeholder="Select an additional shipment type"
                        
                    >
                        {adnlServices.map(item => <Option value={item.adnlServiceCode}>{item.adnlServiceName}</Option>)}
                    </Select>
                    )}
                </FormItem>
                <FormItem
                    wrapperCol={{xs: 24, sm: {span: 12, offset: 5}}}
                ></FormItem>

            </Card>

<>
{/*
            <Card className="gx-card" title="Location Information">
                <Row>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="Place"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('place', {
                            rules: [{required: true, message: 'Please input company name or information about pickup place e.g. garage!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="place" onChange={this.handleChangeInput}/>
                            )}
                        </FormItem>       
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="Street Name"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('streetName', {
                            rules: [{required: true, message: 'Please input street name!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Street Name"/>
                            )}
                        </FormItem>       
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="Street Number"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('streetNumber', {
                            rules: [{required: true, message: 'Please input street number!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="street number"/>
                            )}
                        </FormItem>       
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="Postal Code"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('postalCode', {
                            rules: [{required: true, message: 'Please input postal code!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Postal code"/>
                            )}
                        </FormItem>       
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="City"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('city', {
                            rules: [{required: true, message: 'Please input city!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="city"/>
                            )}
                        </FormItem>       
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="Country Code"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('countryCode', {
                            rules: [{required: true, message: 'Please input country code!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="country code"/>
                            )}
                        </FormItem>       
                    </Col>
                </Row>
            </Card>

            <Card className="gx-card" title="Order Information">
                <Row>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="Customer Number"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('customerNumber', {
                            rules: [{required: true, message: 'Please input customer number!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Customer Number"/>
                            )}
                        </FormItem>       
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="Contact Name"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('contactName', {
                            rules: [{required: true, message: 'Please input contact mame!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Contact Name"/>
                            )}
                        </FormItem>       
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="Contact Email"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('contactEmail', {
                            rules: [{required: true, message: 'Please input contact email!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Contact Email"/>
                            )}
                        </FormItem>       
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="Phone Number"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('phoneNumber', {
                            rules: [{required: true, message: 'Please input phone number!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Phone Number"/>
                            )}
                        </FormItem>       
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="SMS Number"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('smsNumber', {
                            rules: [{required: true, message: 'Please input sms number!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Sms Number"/>
                            )}
                        </FormItem>       
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="Entry Code"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('entryCode', {
                            rules: [{required: true, message: 'Please input entry code!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Entry Code"/>
                            )}
                        </FormItem>       
                    </Col>
                </Row>
            </Card>
*/}
</>

<>
{/*            <Card className="gx-card" title="Pick up Information">
                <Row>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            label="No Units"
                            labelCol={{xs: 24, sm: 5}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('noUnits', {
                            rules: [{required: true, message: 'Please input no units!'}],
                            })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="No Units"/>
                            )}
                        </FormItem>       
                    </Col>
                </Row>
            </Card>
*/}
</>

            <Card className="gx-card" title="Date and Times">
                <Row>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            {...formItemLayout}
                            label="Ready Pickup Date"
                        >
                            {getFieldDecorator('readyPickupDate', config)(
                            <DatePicker className="gx-mb-3 gx-w-100" showTime format="YYYY-MM-DD HH:mm:ss"/>
                            )}
                        </FormItem> 
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            {...formItemLayout}
                            label="Latest Pickup Date"
                        >
                            {getFieldDecorator('latestPickupDate', config)(
                            <DatePicker className="gx-mb-3 gx-w-100" showTime format="YYYY-MM-DD HH:mm:ss"/>
                            )}
                        </FormItem> 
                    </Col>
                </Row>
                <Row>
                    <Col lg={12} md={12} sm={12} xs={24}>   
                        <FormItem
                            {...formItemLayout}
                            label="Earliest Pickup Date"
                        >
                            {getFieldDecorator('earliestPickupDate', config)(
                            <DatePicker className="gx-mb-3 gx-w-100" showTime format="YYYY-MM-DD HH:mm:ss"/>
                            )}
                        </FormItem> 
                    </Col>
                </Row>
            </Card>

            <Card className="gx-card" title="Confirmation">

                <FormItem
                    wrapperCol={{xs: 24, sm: {span: 12, offset: 5}}}
                >
                    <Button type="default" htmlType="submit" onClick={this.handleClickButtonPrevStep}>
                    Previous
                    </Button>
                    <Button type="primary" htmlType="submit">
                    Submit
                    </Button>
                </FormItem>
            
            </Card>
            
            <InfoView/>
        </Form>
        
      </>
    );
  }
}
const WrappedNormalThirdContent = Form.create()(ThirdContent);

const mapStateToProps = ({auth, book}) => {
    const {token, authUser} = auth;
    const {service, adnlServices, bookFrom, bookTo, items} = book;

    //console.log("third state");
    //console.log(service);
    //console.log(adnlServices);
    //console.log("bookFrom:", bookFrom);
    //console.log("bookTo:", bookTo);
    //console.log("items:", items)
    
    return {token, authUser, service, adnlServices, bookFrom, bookTo, items}
  };
  
export default connect(mapStateToProps, {goToPrevStep, postBookShipment})(WrappedNormalThirdContent);
