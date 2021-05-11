import React, {Component} from "react";
import {Button, Card, Form, Icon, Input, message, Row, Col, AutoComplete, Select, Tooltip} from "antd";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import InfoView from "components/InfoView";
import {getCountries} from  "country-state-picker";
import {postUserDetails} from "../../../appRedux/actions/User"

const FormItem = Form.Item;
const Option = Select.Option;

class ProfilePage extends Component {

    
  constructor(props) {
    super(props);
    this.state = {
        confirmDirty: false,
        countries: []
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
        values = {
            ...values,
            uuid: this.props.authUser.id
        }
        const {token} = this.props;
        this.props.postUserDetails({payload: values, token: token})
      }
    });
  }

  handleSubmitPreviousStep = (e) => {
    e.preventDefault();
    this.props.goToPrevStep();    
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }

  componentDidMount(){
    let user = this.props.authUser;
    if(!user) { user = {}; }
    console.log("user", user);
    this.props.form.setFieldsValue({
        email: user.email,
        username: user.name,
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber,
        address: user.address,
        city: user.city,
        country: user.country,
        postalcode: user.postalcode,
        status: user.status
      });

      let countries = getCountries();
      //console.log(countries);
      this.setState({countries});
}

  render() {

    const {getFieldDecorator} = this.props.form;

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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    // const prefixSelector = getFieldDecorator('prefix', {
    //   initialValue: '86',
    // })(
    //   <Select style={{width: 70}}>
    //     <Option value="86">+86</Option>
    //     <Option value="87">+87</Option>
    //   </Select>
    // );
    
    const {countries} = this.state;

    return (
      <>
      <Card className="gx-card" title="Profile Information">

      <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="E-mail"
          >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'The input is not valid E-mail!',
              }, {
                required: true, message: 'Please input your E-mail!',
              }],
            })(
              <Input id="email1" disabled/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                User Name&nbsp;
                <Tooltip title="User name can not be updated">
                <Icon type="question-circle-o"/>
              </Tooltip>
            </span>
            )}
          >
            {getFieldDecorator('username', {
              rules: [{required: true, message: 'Please input your user name!', whitespace: true}],
            })(
              <Input disabled/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="First Name"
          >
            {getFieldDecorator('firstname', {
              rules: [{required: true, message: 'Please input your first name!', whitespace: true}],
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Last Name"
          >
            {getFieldDecorator('lastname', {
              rules: [{required: true, message: 'Please input your last name!', whitespace: true}],
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Phone Number"
          >
            {getFieldDecorator('phonenumber', {
              rules: [{required: true, message: 'Please input your phone number!'}],
            })(
            //   <Input addonBefore={prefixSelector} style={{width: '100%'}}/>
            <Input style={{width: '100%'}}/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Address"
          >
            {getFieldDecorator('address', {
              rules: [{required: true, message: 'Please input your address!', whitespace: true}],
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Postal Code"
          >
            {getFieldDecorator('postalcode', {
              rules: [{required: true, message: 'Please input your postal code!', whitespace: true}],
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="City"
          >
            {getFieldDecorator('city', {
              rules: [{required: true, message: 'Please input your city!', whitespace: true}],
            })(
              <Input/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Country"
          >
            {getFieldDecorator('country', {
              rules: [{required: true, message: 'Please input your country!', whitespace: true}],
            })(
                <Select
                showSearch
                placeholder="Select a country"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                
                >
                    {countries.map(item => <Option value={item.code}>{item.name}</Option>)}
                </Select>
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="default" htmlType="submit"><Link to="/dashboard">Back</Link></Button>
            <Button type="primary" htmlType="submit">Edit</Button>
          </FormItem>
        </Form>
        
        <InfoView/>
      </Card>
      </>
    );
  }
}

const WrappedProfilePageForm = Form.create()(ProfilePage);
const mapStateToProps = ({auth}) => {
  const {token, authUser} = auth;
  console.log("me", authUser);
  return {token, authUser}
};

export default connect(mapStateToProps, {postUserDetails})(WrappedProfilePageForm);
