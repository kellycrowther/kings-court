import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Menu, Icon, Breadcrumb, Layout, message, Typography } from "antd";
import "./App.css";

import Manage from "./containers/Manage/Manage";
import Results from "./containers/Results/Results";
import LoginModal from "./components/LoginModal/LoginModal";
import { store } from "./store/store";

const { Header, Content, Footer } = Layout;
const { Paragraph } = Typography;

export default function BasicExample() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const globalState = useContext(store);
  const { dispatch } = globalState;

  const handleLogin = password => {
    if (password === "bMoGL4XY5tei") {
      setIsLoggedIn(true);
      dispatch({ type: "SET_LOGGED_IN", payload: { isLoggedIn: true } });
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
      message.success("You have been successfully logged in.");
    } else {
      message.error("The password you entered was incorrect.");
    }
  };

  useEffect(() => {
    let storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    storedIsLoggedIn = JSON.parse(storedIsLoggedIn);
    setIsLoggedIn(storedIsLoggedIn);
    dispatch({
      type: "SET_LOGGED_IN",
      payload: { isLoggedIn: storedIsLoggedIn }
    });
  }, [dispatch]);

  return (
    <Layout className="layout">
      <Router>
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
            {isLoggedIn ? (
              <Menu.Item>
                <Icon type="database" />
                Manage
                <Link to="/manage"></Link>
              </Menu.Item>
            ) : null}
            <Menu.Item>
              <Icon type="dashboard" />
              Results
              <Link to="/results"></Link>
            </Menu.Item>
            <Menu.Item onClick={() => setLoginVisible(true)}>
              <Icon type="login" />
              Login
            </Menu.Item>
          </Menu>
        </Header>
        <Content className="content">
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
          <LoginModal
            visible={loginVisible}
            setLoginVisible={setLoginVisible}
            handleLogin={handleLogin}
          />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          kellycrowther.io ©{new Date().getFullYear()} Created by Kelly Crowther
        </Footer>
      </Router>
    </Layout>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>
        Head over to the Manage page for the magic.{" "}
        <span role="img" aria-label="sparkles">
          🎇
        </span>
      </p>
      <div>
        The password to login is: <Paragraph copyable>bMoGL4XY5tei</Paragraph>
      </div>
    </div>
  );
}
