import React from "react";
import { gql } from "@apollo/client";
import { Subscription } from "@apollo/react-components";

function KingsCourtHome() {
  const ADD_BATTLESTAR_SUBSCRIPTION = `
    subscription addRace {
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
      <Subscription subscription={gql(ADD_BATTLESTAR_SUBSCRIPTION)}>
        {({ data, loading }) => {
          console.info("SUBSCRIBED DATA: ", data);
          return <div>New Item: {JSON.stringify(data)}</div>;
        }}
      </Subscription>
    </div>
  );
}

export default KingsCourtHome;
