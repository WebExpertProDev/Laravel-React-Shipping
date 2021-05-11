import React, {Component} from "react";
import {Button, Card, Form, Icon, Input, message, Row, Col, Table} from "antd";
import {connect} from "react-redux";
import InfoView from "components/InfoView";
import {getUsers, deleteUser} from "../../../appRedux/actions/Admin";
import { THEME_COLOR_SELECTION } from "../../../constants/ThemeSetting";

const FormItem = Form.Item;
class UsersPage extends Component {
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
  clearFilters = () => {
    this.setState({filteredInfo: null});
  };
  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };
  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    });
  };

  onSelectDeleteUser = (id) => {
    const payload = {id};
    const {token} = this.props;
    this.props.deleteUser({payload, token});
  }

  componentDidMount() {
    const {token} = this.props;
    this.props.getUsers({token});
  }

  render() {
    const {users} = this.props;
    console.log(users);
    let {sortedInfo, filteredInfo} = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // filters: [
      //   {text: 'Joe', value: 'Joe'},
      //   {text: 'Jim', value: 'Jim'},
      // ],
      //filteredValue: filteredInfo.name || null,
      //onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      //sorter: (a, b) => a.age - b.age,
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
    },  {
      title: 'ID',
      dataIndex: 'id',
      key: 'uuid',
      //sorter: (a, b) => a.age - b.age,
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
    },
    
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      // filters: [
      //   {text: 'London', value: 'London'},
      //   {text: 'New York', value: 'New York'},
      // ],
      //filteredValue: filteredInfo.created_at || null,
      //onFilter: (value, record) => record.created_at.includes(value),
      sorter: (a, b) => a.created_at.length - b.created_at.length,
      sortOrder: sortedInfo.columnKey === 'created_at' && sortedInfo.order,
    }, {
      title: 'Action', dataIndex: 'id', key: 'id', render: (id, record, index) => <span className="gx-link" onClick={() => this.onSelectDeleteUser(id)}>Delete</span>
    }];

    return (
      <>
      <Card className="gx-card" title="Users">

        {/* <div className="table-operations">
          <Button onClick={this.setAgeSort}>Sort age</Button>
          <Button onClick={this.clearFilters}>Clear filters</Button>
          <Button onClick={this.clearAll}>Clear filters and sorters</Button>
        </div> */}
        <Table className="gx-table-responsive" columns={columns} dataSource={users} onChange={this.handleChange}/>
    
      </Card>
      </>
    );
  }
}

const WrappedUsersPageForm = Form.create()(UsersPage);
const mapStateToProps = ({auth, admin}) => {
  const {token} = auth;
  const {users} = admin;
  return {token, users}
};

export default connect(mapStateToProps, {getUsers, deleteUser})(WrappedUsersPageForm);
