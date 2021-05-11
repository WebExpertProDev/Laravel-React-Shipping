import React, {Component} from "react";
import {Button, Card, Form, Icon, Input, message, Row, Col, Table} from "antd";
import {connect} from "react-redux";
import InfoView from "components/InfoView";
import {getBooks} from "../../../appRedux/actions/Admin";
import { THEME_COLOR_SELECTION } from "../../../constants/ThemeSetting";

const FormItem = Form.Item;
class BooksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        filteredInfo: null,
        sortedInfo: null,
    };
    this.onSelectDeleteUser = this.onSelectDeleteUser.bind(this);
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  onSelectDeleteUser = (id) => {
    const payload = {id};
    const {token} = this.props;
    this.props.deleteUser({payload, token});
  }

  componentDidMount() {
    const {token} = this.props;
    this.props.getBooks({token});
  }

  render() {
    const {books} = this.props;
    console.log(books);
    let {sortedInfo, filteredInfo} = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [{
      title: 'Name',
      dataIndex: 'user.name',
      key: 'name',
      sorter: (a, b) => a.user.name.length - b.user.name.length,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    }, {
      title: 'Email',
      dataIndex: 'user.email',
      key: 'email',
      //sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
    }, {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
        sorter: (a, b) => a.companyName.length - b.companyName.length,
        sortOrder: sortedInfo.columnKey === 'companyName' && sortedInfo.order,
    }, {
        title: 'orderId',
        dataIndex: 'orderId',
        key: 'orderId',
        sorter: (a, b) => a.orderId.length - b.orderId.length,
        sortOrder: sortedInfo.columnKey === 'orderId' && sortedInfo.order,
    }, {
        title: 'Pickup Time',
        dataIndex: 'pickupTime',
        key: 'pickupTime',
        sorter: (a, b) => a.pickupTime.length - b.pickupTime.length,
        sortOrder: sortedInfo.columnKey === 'pickupTime' && sortedInfo.order,
    }, {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => a.created_at.length - b.created_at.length,
      sortOrder: sortedInfo.columnKey === 'created_at' && sortedInfo.order,
    }];

    return (
      <>
      <Card className="gx-card" title="Users">

        <Table className="gx-table-responsive" columns={columns} dataSource={books} onChange={this.handleChange}/>
    
      </Card>
      </>
    );
  }
}

const WrappedBooksPageForm = Form.create()(BooksPage);
const mapStateToProps = ({auth, admin}) => {
  const {token} = auth;
  const {users, books} = admin;
  return {token, users, books}
};

export default connect(mapStateToProps, {getBooks})(WrappedBooksPageForm);
