import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Menu, Icon, Breadcrumb, Layout } from "antd";
import Manage from "./containers/Manage/Manage";

const { Header, Content, Footer } = Layout;

export default function BasicExample() {
  return (
    <Layout className="layout">
      <Router>
        <Header>
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
            <Menu.Item>
              <Icon type="database" />
              Manage
              <Link to="/manage"></Link>
            </Menu.Item>
            <Menu.Item>
              <Icon type="dashboard" />
              Results
              <Link to="/results"></Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/manage">
                <Manage />
              </Route>
              <Route path="/results">
                <Results />
              </Route>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Router>
    </Layout>
  );
}

// You can think of these components as "pages"
// in your app.

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Results() {
  return (
    <div>
      <h2>Results</h2>
    </div>
  );
}
