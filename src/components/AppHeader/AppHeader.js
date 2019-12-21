import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Layout } from "antd";
import { useAuth0 } from "../../auth0";
import { withRouter } from "react-router-dom";

const { Header } = Layout;

const AppHeader = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <Header className="custom-header">
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item key="home">
          <Icon type="home" />
          Home
          <Link to="/"></Link>
        </Menu.Item>
        {isAuthenticated && (
          <Menu.Item>
            <Icon type="database" />
            Manage
            <Link to="/manage"></Link>
          </Menu.Item>
        )}
        <Menu.Item>
          <Icon type="dashboard" />
          Results
          <Link to="/results"></Link>
        </Menu.Item>
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
        {isAuthenticated && (
          <Menu.Item>
            <Icon type="profile" />
            Profile<Link to="/profile"></Link>
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
};

export default withRouter(AppHeader);
