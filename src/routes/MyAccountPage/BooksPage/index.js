import React, {Component} from "react";
import {Button, Card, Form, Icon, Input, message, Row, Col, Select, Table} from "antd";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import InfoView from "components/InfoView";
import {getUserBooks} from "../../../appRedux/actions/User"

const FormItem = Form.Item;
const Option = Select.Option;

  const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }, {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
  }];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

class BooksPage extends Component {

    
  constructor(props) {
    super(props);
    this.state = {
        
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
        //this.props.postUserDetails({payload: values, token: token})
      }
    });
  }

  componentDidMount(){
    let user = this.props.authUser;
    if(!user) { user = {}; }
    console.log("user", user);
    let {token} = this.props;
    let payload = {
        uuid: user.id
    }
    this.props.getUserBooks({payload, token})
}

  render() {

    const {getFieldDecorator} = this.props.form;
    const {books} = this.props;

    const columns = [{
      title: 'Company Name',
      dataIndex: 'companyName',
  }, {
    title: 'OrderID',
    dataIndex: 'orderId',
    render: text => <span className="gx-link">{text}</span>,
  }, {
    title: 'Pickup Time',
    dataIndex: 'pickupTime',
  }, {
    title: 'Booking Date',
    dataIndex: 'created_at',
  }];

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

    return (
      <>
      <Card className="gx-card" title="My Booking List">

        <Form>

        <Table className="gx-table-responsive" rowSelection={rowSelection} columns={columns} dataSource={books}/>

          <FormItem {...tailFormItemLayout}>
            <Button type="default" htmlType="submit"><Link to="/dashboard">Back</Link></Button>
            {/* <Button type="primary" htmlType="submit">Edit</Button> */}
          </FormItem>
        </Form>
        
        <InfoView/>
      </Card>
      </>
    );
  }
}

const WrappedBooksPageForm = Form.create()(BooksPage);
const mapStateToProps = ({auth, user}) => {
  const {token, authUser} = auth;
  const {books} = user;
  //console.log("book list", authUser);
  return {token, authUser, books}
};

export default connect(mapStateToProps, {getUserBooks})(WrappedBooksPageForm);
