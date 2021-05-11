import React, {Component} from "react";
import {Button, Card, Form, Input, Select, InputNumber, Row, Col} from "antd";
import {getCountries} from  "country-state-picker";
import {connect} from "react-redux";
import {firstStepSubmit} from "../../../appRedux/actions/Book";
import InfoView from "components/InfoView";
const postalCodes = require('postal-codes-js');


const FormItem = Form.Item;
const Option = Select.Option;

class FirstContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        countries: [],
        countryFrom: null,
        postalCodeFrom: null,
        countryTo: null,
        postalCodeTo: null,
        shipmentType: null,
        containerTypeDisabledFlag: true,
        weightDisabledFlag: true,
        lengthDisabledFlag: true,
        widthDisabledFlag:true,
        heightDisabledFlag: true,
        containerTypeValue: null,
        weightValue: null,
        lengthValue: null,
        widthValue: null,
        heightValue: null,
        unitsValue: null,
    };

    this.handleSelectChangeShipmentType = this.handleSelectChangeShipmentType.bind(this);
    this.handleSelectChangeCountryFrom = this.handleSelectChangeCountryFrom.bind(this);
    this.validatePostalCodesFrom = this.validatePostalCodesFrom.bind(this);
    this.validatePostalCodesTo = this.validatePostalCodesTo.bind(this);
    this.handleSelectChangeContainerType = this.handleSelectChangeContainerType.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let payload = {
            shipmentType: this.state.shipmentType,
            countryFrom: this.state.countryFrom,
            postalCodeFrom: this.state.postalCodeFrom,
            countryTo: this.state.countryTo,
            postalCodeTo: this.state.postalCodeTo,
            containerType: this.state.containerTypeValue,
            items : [{
              units: values['shipment-size-units'],
              weight: values['shipment-size-weight'],
              length: values['shipment-size-length'],
              width: values['shipment-size-width'],
              height: values['shipment-size-height']            
            }],
            token: this.props.token
        }
        this.props.firstStepSubmit({payload});
      }
    });
    
  }
  handleSelectChange = (value) => {
    console.log(value);
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  }

  handleSelectChangeShipmentType = (value) => {
    console.log(value);
    this.setState({shipmentType: value});
    if (value == "1"){
      this.setState({weightDisabledFlag: false});
      this.setState({lengthDisabledFlag: false});
      this.setState({widthDisabledFlag: false});
      this.setState({heightDisabledFlag: false});
      this.setState({containerTypeDisabledFlag: true});
    } else if (value == "2"){
      this.setState({weightDisabledFlag: false});
      this.setState({lengthDisabledFlag: false});
      this.setState({widthDisabledFlag: false});
      this.setState({heightDisabledFlag: false});
      this.setState({containerTypeDisabledFlag: true});
    } else if (value == "3"){
      this.setState({containerTypeDisabledFlag: false});
      this.setState({weightDisabledFlag: true});
      this.setState({lengthDisabledFlag: true});
      this.setState({widthDisabledFlag: true});
      this.setState({heightDisabledFlag: true});
    } else if (value == "4") {
      this.setState({containerTypeDisabledFlag: true});
      this.setState({weightDisabledFlag: false});
      this.setState({lengthDisabledFlag: true});
      this.setState({widthDisabledFlag: true});
      this.setState({heightDisabledFlag: true});
    }
  }

  handleSelectChangeCountryFrom = (value) => {
    console.log(value);
    this.setState({countryFrom: value});
  }

  handleSelectChangeCountryTo = (value) => {
    console.log(value);
    this.setState({countryTo: value});
  }

  validatePostalCodesFrom = (rule, value, callback) => {
    const form = this.props.form;
    let countryCode = this.state.countryFrom;
    if (countryCode == null || countryCode == undefined || countryCode == ''){
      callback('Select a country!');
    }
    let postalCode = value;
    let isValidPostalCode = postalCodes.validate(countryCode, postalCode);
    //console.log(countryCode + postalCode);
    //console.log("postal code validation:", flag);
    if (isValidPostalCode !== true) {
        console.log(this.state.countryFrom);
        console.log(value);
      callback('Postal Codes that you enter is not correct!');
    } else {
      callback();
      console.log(value);
      this.setState({postalCodeFrom: value});
    }
  }

  validatePostalCodesTo = (rule, value, callback) => {
    const form = this.props.form;
    let countryCode = this.state.countryTo;
    if (countryCode == null || countryCode == undefined || countryCode == ''){
      callback('Select a country!');
    }
    let postalCode = value;
    let isValidPostalCode = postalCodes.validate(countryCode, postalCode);
    //console.log(countryCode + postalCode);
    //console.log("postal code validation:", flag);
    if (isValidPostalCode !== true) {
        console.log(this.state.countryTo);
        console.log(value);
      callback('Postal Codes that you enter is not correct!');
    } else {
      callback();
      console.log(value);
      this.setState({postalCodeTo: value});
    }
  }

  handleSelectChangeContainerType = (value) => {
    console.log(value);
    this.setState({containerTypeValue: value});
  }

  handleChnageInputUnits = (value) => {
    console.log(value);
    this.setState({unitsValue: value});
  }

  handleChnageInputWeight = (value) => {
    console.log(value);
    this.setState({weightValue: value});
  }
  
  handleChnageInputLength = (value) => {
    console.log(value);
    this.setState({lengthValue: value});
  }

  handleChnageInputWidth = (value) => {
    console.log(value);
    this.setState({widthValue: value});
  }

  handleChnageInputHeight = (value) => {
    console.log(value);
    this.setState({heightValue: value});
  }
  

  componentDidMount() {
    let countries = getCountries();
    //console.log(countries);
    this.setState({countries});
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {countries} = this.state;
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
            <Card className="gx-card" title="SHIPMENT TYPE">
                <Row>
                    <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                    <FormItem
                        label="Shipment type"
                        labelCol={{xs: 24, sm: 12}}
                        wrapperCol={{xs: 24, sm: 12}}
                    >
                        {getFieldDecorator('shipment type', {
                        rules: [{required: true, message: 'Please select your shipment type!'}],
                        })(
                        <Select
                            placeholder="Select a shipment type"
                            onChange={this.handleSelectChangeShipmentType}
                        >
                            <Option value="1">Package</Option>
                            <Option value="2">Pallet</Option>
                            <Option value="3">Container</Option>
                            <Option value="4">Document</Option>
                        </Select>
                        )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                    <FormItem
                          label="Select container type"
                          labelCol={{xs: 24, sm: 12}}
                          wrapperCol={{xs: 24, sm: 12}}
                      >
                          {getFieldDecorator('shipment-size-container-type', {
                            initialValue: "0",
                            rules: [{required: true, message: 'Please select container type!'}],
                          })(
                            <Select 
                                placeholder="Select container type"
                                disabled = {this.state.containerTypeDisabledFlag}
                                onChange = {this.handleSelectChangeContainerType}
                            >
                                <Option value="0" >None</Option>
                                <Option value="1">20 feet</Option>
                                <Option value="2">40 feet</Option>
                            </Select>
                          )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                    <FormItem
                            label="Units"
                            labelCol={{xs: 24, sm: 12}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('shipment-size-units', {
                              initialValue: 1,
                            rules: [{required: true, message: 'Please select units!'}],
                            })(
                              <InputNumber min={0} max={100}
                              onChange = {this.handleChnageInputUnits}
                              />
                            )}
                      </FormItem>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                      <FormItem
                            label="Weight per unit"
                            labelCol={{xs: 24, sm: 12}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('shipment-size-weight', {
                            rules: [{required: true, message: 'Please select units!'}],
                            initialValue: 10,
                            })(
                              <InputNumber min={0} max={100} formatter={value => `${value}Kg`} parser={value => value.replace('Kg', '')}
                              disabled = {this.state.weightDisabledFlag}
                              onChange = {this.handleChnageInputWeight}
                              />
                            )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                    <FormItem
                            label="Length(max)"
                            labelCol={{xs: 24, sm: 12}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('shipment-size-length', {
                              initialValue: 40,
                            rules: [{required: true, message: 'Please input length!'}],
                            })(
                              <InputNumber min={0} max={100} value={this.state.lengthValue} formatter={value => `${value}Cm`} parser={value => value.replace('Cm', '')}
                              disabled = {this.state.lengthDisabledFlag}
                              onChange = {this.handleChnageInputLength}
                              />
                            )}
                      </FormItem>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                      <FormItem
                            label="Width(max)"
                            labelCol={{xs: 24, sm: 12}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('shipment-size-width', {
                              initialValue: 20,
                            rules: [{required: true, message: 'Please select units!'}],
                            })(
                              <InputNumber min={0} max={100} formatter={value => `${value}Cm`} parser={value => value.replace('Cm', '')}
                              disabled = {this.state.widthDisabledFlag}
                              onChange = {this.handleChnageInputWidth}/>
                            )}
                      </FormItem>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={24}>
                      <FormItem
                            label="Height(max)"
                            labelCol={{xs: 24, sm: 12}}
                            wrapperCol={{xs: 24, sm: 12}}
                        >
                            {getFieldDecorator('shipment-size-height', {
                              initialValue: 50,
                            rules: [{required: true, message: 'Please select units!'}],
                            })(
                              <InputNumber min={0} max={100}  formatter={value => `${value}Cm`} parser={value => value.replace('Cm', '')}
                              disabled = {this.state.heightDisabledFlag}
                              onChange = {this.handleChnageInputHeight}/>
                            )}
                      </FormItem>
                    </Col>
                </Row>
                
                
               
                {/* <FormItem
                    wrapperCol={{xs: 24, sm: {span: 12, offset: 5}}}
                ></FormItem> */}
                
            </Card>

            <Card className="gx-card" title="From">

                <FormItem
                    label="Country"
                    labelCol={{xs: 24, sm: 5}}
                    wrapperCol={{xs: 24, sm: 12}}
                >
                    {getFieldDecorator('country', {
                    rules: [{required: true, message: 'Please select country!'}],
                    })(
                    <Select
                        showSearch
                        placeholder="Select a country"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={this.handleSelectChangeCountryFrom}
                    >
                        {countries.map(item => <Option value={item.code}>{item.name}</Option>)}
                    </Select>
                    )}
                </FormItem>
            
                <FormItem
                    label="Postal Code"
                    labelCol={{xs: 24, sm: 5}}
                    wrapperCol={{xs: 24, sm: 12}}
                >
                    {getFieldDecorator('postal-code', {
                    rules: [{
                        required: true, message: 'Please input a postal code!'
                    }, {
                            validator: this.validatePostalCodesFrom,
                        }],
                    })(
                    <Input/>
                    )}
                </FormItem>
                
                <FormItem
                    wrapperCol={{xs: 24, sm: {span: 12, offset: 5}}}
                >
                </FormItem>
            
            </Card>

            <Card className="gx-card" title="To">

                <FormItem
                    label="Country"
                    labelCol={{xs: 24, sm: 5}}
                    wrapperCol={{xs: 24, sm: 12}}
                >
                    {getFieldDecorator('country1', {
                    rules: [{required: true, message: 'Please select country!'}],
                    })(
                    <Select
                        showSearch
                        placeholder="Select a country"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        onChange={this.handleSelectChangeCountryTo}
                    >
                        {countries.map(item => <Option value={item.code}>{item.name}</Option>)}
                    </Select>
                    )}
                </FormItem>
            
                <FormItem
                    label="Postal Code"
                    labelCol={{xs: 24, sm: 5}}
                    wrapperCol={{xs: 24, sm: 12}}
                >
                    {getFieldDecorator('postal-code1', {
                    rules: [{
                        required: true, message: 'Please input a postal code!'
                    }, {
                            validator: this.validatePostalCodesTo,
                        }],
                    })(
                    <Input/>
                    )}
                </FormItem>
                
                <FormItem
                    wrapperCol={{xs: 24, sm: {span: 12, offset: 5}}}
                >
                    <Button type="primary" htmlType="submit">
                    Next
                    </Button>
                </FormItem>
                
            </Card>
          <InfoView/>

        
        </Form>
      </>
    );
  }
}
const WrappedNormalFirstContent = Form.create()(FirstContent);

const mapStateToProps = ({auth}) => {
    const {token} = auth;
    return {token}
  };
  
export default connect(mapStateToProps, {firstStepSubmit})(WrappedNormalFirstContent);
