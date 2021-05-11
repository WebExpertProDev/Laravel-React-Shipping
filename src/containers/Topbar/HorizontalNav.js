import React, {Component} from "react";
import {connect} from "react-redux";
import {Menu} from "antd";
import {Link} from "react-router-dom";
import IntlMessages from "../../util/IntlMessages";
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL
} from "../../constants/ThemeSetting";
import './index.css';


const SubMenu = Menu.SubMenu;

class HorizontalNav extends Component {

  getNavStyleSubMenuClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve";
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-inside-submenu-popup-curve";
      case NAV_STYLE_BELOW_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-below-submenu-popup-curve";
      case NAV_STYLE_ABOVE_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-above-submenu-popup-curve";
      default:
        return "gx-menu-horizontal";

    }
  };

  render() {
    const {pathname, navStyle} = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    const {isAdmin} = this.props;
    return (

      <Menu
        defaultOpenKeys={[defaultOpenKeys]}
        selectedKeys={[selectedKeys]}
        mode="horizontal">

        {/* <SubMenu className={this.getNavStyleSubMenuClass(navStyle)} key="main"
                 title={<IntlMessages id="sidebar.main"/>}> */}
          <Menu.Item key="dashboard">
            <Link to="/dashboard"><i className="icon icon-company"/>
              <IntlMessages id="sidebar.info"/></Link>
          </Menu.Item>
        {/* </SubMenu> */}

          <Menu.Item key="booknow">
            <Link to="/booknow"><i className="icon icon-hotel-booking"/>
              <IntlMessages id="sidebar.booknow"/></Link>
          </Menu.Item>

          <Menu.Item key="tracking">
            <Link to="/tracking"><i className="icon icon-product-list"/>
              <IntlMessages id="sidebar.tracking"/></Link>
          </Menu.Item>

          <Menu.Item key="prices">
            <Link to="/prices"><i className="icon icon-pricing-table"/>
              <IntlMessages id="sidebar.prices"/></Link>
          </Menu.Item>

          {
            isAdmin &&
            <SubMenu className={this.getNavStyleSubMenuClass(navStyle)} key="admin"
                 title={<IntlMessages id="sidebar.admin"/>}>
              <Menu.Item key="users">
                <Link to="/admin/users"><i className="icon icon-user"/>
                  <IntlMessages id="sidebar.admin.users"/></Link>
              </Menu.Item>
              <Menu.Item key="adminbooks">
                <Link to="/admin/books"><i className="icon icon-user"/>
                  <IntlMessages id="sidebar.admin.books"/></Link>
              </Menu.Item>
            </SubMenu>
          }

      </Menu>

    );
  }
}

HorizontalNav.propTypes = {};
const mapStateToProps = ({settings, auth}) => {
  const {themeType, navStyle, pathname, locale} = settings;
  const {isAdmin} = auth;
  return {themeType, navStyle, pathname, locale, isAdmin}
};
export default connect(mapStateToProps)(HorizontalNav);

