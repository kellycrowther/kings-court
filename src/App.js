import React, { useState } from "react";
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
import StateQualifiersHome from "./containers/StateQualifiersHome/StateQualifiersHome";
import KingsCourtHome from "./containers/KingsCourtHome/KingsCourtHome";
import Home from "./containers/Home/Home";
import { DialogProviders } from "./context";
import oisraLogo from "./assets/oisra-logo.png";
import { routes } from "./routes/routes";

const { SubMenu } = Menu;
const { Content, Footer, Sider } = Layout;

const App = () => {
  const { loading } = useAuth0();
  const [currentHeaderMenu, setCurrentHeaderMenu] = useState([]);

  if (loading) {
    return <Spin />;
  }

  return (
    <DialogProviders>
      <Layout className="layout">
        <Router history={history}>
          <Layout>
            <Sider
              width={200}
              style={{ background: "#fff", marginBottom: "24px" }}
              breakpoint="lg"
              collapsedWidth="0"
            >
              <div className="app-logo">
                <img src={oisraLogo} alt="logo" />
              </div>
              <Menu
                mode="inline"
                defaultSelectedKeys={[]}
                defaultOpenKeys={[]}
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
                          <Menu.Item
                            onClick={() =>
                              setCurrentHeaderMenu(route.headerMenu)
                            }
                            key={sub.key}
                          >
                            {sub.name}
                            <Link to={sub.path}></Link>
                          </Menu.Item>
                        );
                      })}
                    </SubMenu>
                  ) : (
                    <Menu.Item
                      onClick={() => setCurrentHeaderMenu(route.headerMenu)}
                      key={route.key}
                    >
                      <Icon type={route.icon} />
                      <span>{route.name}</span>
                      <Link to={route.path}></Link>
                    </Menu.Item>
                  );
                })}
              </Menu>
            </Sider>
            <Layout>
              <AppHeader items={currentHeaderMenu} />
              <Content className="content" style={{ padding: "0 24px 24px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
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
                    <PrivateRoute
                      path="/kings-court/manage"
                      component={Manage}
                    />
                    <Route path="/kings-court/results">
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

export default App;
