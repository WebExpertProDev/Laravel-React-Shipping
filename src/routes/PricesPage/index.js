import React, {Component} from "react";
import {Card, Divider, Icon, Table, Form, Row, Col} from "antd";
import {connect} from "react-redux";
import InfoView from "components/InfoView";

const FormItem = Form.Item;

class PricesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {


    const columns = [
      {
        title: 'Weight max.Kg',
        dataIndex: 'weight',
        key: 'weight',
      },
      {
        title: 'Price per package incl. VAT',
        dataIndex: 'priceInclVAT',
        key: 'priceInclVAT',
      },
      {
        title: 'Price per package excl. VAT',
        dataIndex: 'priceExclVAT',
        key: 'priceExclVAT',
      },
    ];
    
    const data = [
      {
        key: '1',
        weight: '3',
        priceInclVAT: 225,
        priceExclVAT: '180',
      },
      {
        key: '2',
        weight: '5',
        priceInclVAT: 270,
        priceExclVAT: '216',
      },
      {
        key: '3',
        weight: '10',
        priceInclVAT: 335,
        priceExclVAT: '268',
      },
      {
        key: '4',
        weight: '15',
        priceInclVAT: 385,
        priceExclVAT: '308',
      },{
        key: '5',
        weight: '20',
        priceInclVAT: 450,
        priceExclVAT: '360',
      }
    ];

    const postnordParcelPriceData = [
      {
        key: '1',
        weight: '3',
        priceInclVAT: 405,
      },
      {
        key: '2',
        weight: '5',
        priceInclVAT: 485,
      },
      {
        key: '3',
        weight: '10',
        priceInclVAT: 685,
      },
      {
        key: '4',
        weight: '15',
        priceInclVAT: 885,
      },{
        key: '5',
        weight: '20',
        priceInclVAT: 1085
      }
    ];

    return (
      <>
      <Card className="gx-card" title="Shipping Cost in Sweden">
          <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <Table className="gx-table-responsive" columns={columns} dataSource={data}/>
              </Col>
          </Row>
      </Card>

      <Card className="gx-card" title="Shipping Cost outside Sweden">
          <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <Table className="gx-table-responsive" columns={columns} dataSource={postnordParcelPriceData}/>
              </Col>
          </Row>
      </Card>
      </>
    );
  }
}

const WrappedPricesPageForm = Form.create()(PricesPage);
const mapStateToProps = ({auth}) => {
  const {token} = auth;
  return {token}
};

export default connect(mapStateToProps)(WrappedPricesPageForm);
