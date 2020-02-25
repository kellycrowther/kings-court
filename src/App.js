import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Breadcrumb, Layout, Spin, Menu, Icon } from "antd";
import "./App.css";

import Manage from "./containers/Manage/Manage";
import Results from "./containers/Results/Results";
import { useAuth0 } from "./auth0";
import history from "./helpers/history";
import Profile from "./components/Profile/Profile";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AppHeader from "./components/AppHeader/AppHeader";
import { DialogProviders } from "./context";
import { gql } from "@apollo/client";
import { Subscription } from "@apollo/react-components";

const { SubMenu } = Menu;
const { Content, Footer, Sider } = Layout;

const routes = [
  {
    app: "home",
    name: "Home",
    icon: "home",
    path: "/",
    subMenu: [],
    key: "sub3"
  },
  {
    app: "stateQualifiers",
    name: "State Qualifiers",
    icon: "rocket",
    path: "/state-qualifiers",
    key: "sub1",
    subMenu: [
      {
        name: "Qualifiers",
        path: "/state-qualifiers",
        key: "1"
      },
      {
        name: "Borderline",
        path: "/borderline",
        key: "2"
      }
    ]
  },
  {
    app: "kingsCourt",
    name: "Kings Court",
    icon: "crown",
    path: "/kings-court",
    subMenu: [],
    key: "sub2"
  }
];

const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Spin />;
  }

  return (
    <DialogProviders>
      <Layout className="layout">
        <Router history={history}>
          <AppHeader />
          <Layout>
            <Sider
              width={200}
              style={{ background: "#fff", marginBottom: "24px" }}
              breakpoint="lg"
              collapsedWidth="0"
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%", borderRight: 0 }}
              >
                {routes.map(route => {
                  return route.subMenu.length ? (
                    <SubMenu
                      key={route.key}
                      title={
                        <span>
                          <Icon type={route.icon} />
                          {route.name}
                        </span>
                      }
                    >
                      {route.subMenu.map(sub => {
                        return (
                          <Menu.Item key={sub.key}>
                            {sub.name}
                            <Link to={sub.path}></Link>
                          </Menu.Item>
                        );
                      })}
                    </SubMenu>
                  ) : (
                    <Menu.Item key={route.key}>
                      <Icon type={route.icon} />
                      <span>{route.name}</span>
                      <Link to={route.path}></Link>
                    </Menu.Item>
                  );
                })}
              </Menu>
            </Sider>
            <Layout style={{ padding: "0 24px 24px" }}>
              <Content className="content">
                <Breadcrumb style={{ margin: "16px 0" }}>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div
                  style={{ background: "#fff", padding: 24, minHeight: 280 }}
                >
                  <Switch>
                    <Route exact path="/">
                      <Home />
                    </Route>
                    <Route exact path="/state-qualifiers">
                      <StateQualifiersHome />
                    </Route>
                    <Route exact path="/kings-court">
                      <KingsCourtHome />
                    </Route>
                    <PrivateRoute path="/manage" component={Manage} />
                    <Route path="/results">
                      <Results />
                    </Route>
                    <PrivateRoute path="/profile" component={Profile} />
                  </Switch>
                </div>
              </Content>
            </Layout>
          </Layout>
          <Footer style={{ textAlign: "center" }}>
            kellycrowther.io ©{new Date().getFullYear()} Created by Kelly
            Crowther
          </Footer>
        </Router>
      </Layout>
    </DialogProviders>
  );
};

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>
        Welcome to the OISRA Nordic management tool. Choose an application to
        run on the left.
      </p>
    </div>
  );
}

function StateQualifiersHome() {
  return (
    <div>
      <h2>State Qualifiers</h2>
      <p>
        Welcome to the State Qualifiers tool. Simply upload your formatted
        results to calculate the state qualifiers.
      </p>
    </div>
  );
}

function KingsCourtHome() {
  const ADD_BATTLESTAR_SUBSCRIPTION = `
    subscription AddBattleStar {
      addBattleStar {
        name
      }
    }
  `;
  return (
    <div>
      <h2>Kings Court</h2>
      <p>
        Head over to the Manage page for the magic.{" "}
        <span role="img" aria-label="sparkles">
          🎇
        </span>
      </p>
      <div>
        If you are managing a race, login to create your race, upload your
        seeded racers, and begin setting their places.
      </div>
      <div>
        If you are a interested in finding your results, go to the results page
        to see your live results.
      </div>
      <Subscription subscription={gql(ADD_BATTLESTAR_SUBSCRIPTION)}>
        {({ data, loading }) => {
          console.info("SUBSCRIBED DATA: ", data);
          return <div>New Item: {JSON.stringify(data)}</div>;
        }}
      </Subscription>
    </div>
  );
}

export default App;
