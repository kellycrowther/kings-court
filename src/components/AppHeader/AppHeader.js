import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Layout } from "antd";
import { useAuth0 } from "../../auth0";
import { withRouter } from "react-router-dom";
import "./AppHeader.css";

const { Header } = Layout;

const AppHeader = ({ items }) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  items = items.filter(item => {
    if (!item.requiresAuthentication) {
      return item;
    }

    if (item.requiresAuthentication && isAuthenticated) {
      return item;
    }
    return null;
  });
  return (
    <Header className="custom-header">
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        style={{ lineHeight: "64px" }}
      >
        {items.map(item => {
          return (
            <Menu.Item key={item.key}>
              <Icon type={item.icon} />
              {item.name}
              <Link to={item.path}></Link>
            </Menu.Item>
          );
        })}
        {!isAuthenticated && (
          <Menu.Item onClick={() => loginWithRedirect({})}>
            <Icon type="login" />
            Login
          </Menu.Item>
        )}
        {isAuthenticated && (
          <Menu.Item onClick={() => logout()}>
            <Icon type="logout" />
            Logout
          </Menu.Item>
        )}
        {/* {isAuthenticated && (
          <Menu.Item>
            <Icon type="profile" />
            Profile<Link to="/profile"></Link>
          </Menu.Item>
        )} */}
      </Menu>
    </Header>
  );
};

export default withRouter(AppHeader);
