import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Menu, Icon } from "antd";

export default function BasicExample() {
  return (
    <Router>
      <Menu mode="horizontal">
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
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
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
    </Router>
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

function Manage() {
  return (
    <div>
      <h2>Manage</h2>
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
