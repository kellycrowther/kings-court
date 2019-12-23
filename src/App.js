import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Breadcrumb, Layout, Spin } from "antd";
import "./App.css";

import Manage from "./containers/Manage/Manage";
import Results from "./containers/Results/Results";
import { useAuth0 } from "./auth0";
import history from "./helpers/history";
import Profile from "./components/Profile/Profile";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AppHeader from "./components/AppHeader/AppHeader";
import { DialogProviders } from "./context";

const { Content, Footer } = Layout;

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
                <PrivateRoute path="/manage" component={Manage} />
                <Route path="/results">
                  <Results />
                </Route>
                <PrivateRoute path="/profile" component={Profile} />
              </Switch>
            </div>
          </Content>
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
    </div>
  );
}

export default App;
