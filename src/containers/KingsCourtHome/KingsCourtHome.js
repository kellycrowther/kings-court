import React from "react";
import { gql } from "@apollo/client";
import { Subscription } from "@apollo/react-components";

function KingsCourtHome() {
  // subscriptions will not work locally
  // make sure to change the Insomnia environment too
  const ADD_RACE_SUBSCRIPTION = `
    subscription AddedRaceSub {
      addRace {
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
      <Subscription subscription={gql(ADD_RACE_SUBSCRIPTION)}>
        {({ data, loading }) => {
          console.info("SUBSCRIBED DATA: ", data);
          return <h1>New Item: {JSON.stringify(data)}</h1>;
        }}
      </Subscription>
    </div>
  );
}

export default KingsCourtHome;
