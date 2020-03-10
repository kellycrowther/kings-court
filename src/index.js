import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./core/reducer";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { composeWithDevTools } from "redux-devtools-extension";
import { Auth0Provider } from "./auth0";
import history from "./helpers/history";
import { createEpicMiddleware } from "redux-observable";
import epics from "./core/epics";
import { AWSAppSyncClient } from "aws-appsync";
import { ApolloProvider } from "@apollo/react-hooks";
import { Rehydrated } from "./components/Rehydrated/Rehydrated";

// subscriptions will not work locally
// make sure to change the React environment and Insomnia environment
const awsclient = new AWSAppSyncClient({
  url: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  region: "us-west-1",
  auth: {
    type: "API_KEY",
    apiKey: process.env.REACT_APP_GRAPHQL_API_KEY
  }
});

const epicMiddleware = createEpicMiddleware();

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(epicMiddleware))
);

epicMiddleware.run(epics);

const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

// redirect the user to the correct place after login
const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={auth0Domain}
    client_id={auth0ClientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <ApolloProvider client={awsclient}>
      <Rehydrated>
        <Provider store={store}>
          <App />
        </Provider>
      </Rehydrated>
    </ApolloProvider>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
