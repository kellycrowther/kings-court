import "rxjs";
import { combineEpics } from "redux-observable";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";
import {
  mergeMap,
  takeUntil,
  map,
  retry,
  catchError,
  filter
} from "rxjs/operators";
import { ofType } from "redux-observable";
import {
  RacesActions,
  getRacesByUserSuccess,
  getRacesByUserFailure,
  createRaceSuccess,
  createRaceFailure,
  updateRaceSuccess,
  updateRaceFailure,
  deleteRaceSuccess,
  deleteRaceFailure,
  getRaceByIdFailure,
  getRaceByIdSuccess,
  getRacesSuccess,
  getRacesFailure
} from "../actions";
import { message } from "antd";

// const endpoint = process.env.REACT_APP_SERVERLESS_API_ENDPOINT;
const graphql_endpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT;
const graphql_api_key = process.env.REACT_APP_GRAPHQL_API_KEY;

export const getRaces = actions$ => {
  return actions$.pipe(
    ofType(RacesActions.GET_RACES_BY_USER),
    mergeMap(action => {
      const { userId } = action.payload;
      const body = {
        query: `query getRacesByUserId($userId: String! ) {
          getRacesByUserId(
              userId: $userId
            ) {
              id
              name
              userId
              results {
                teamName
                round1Heat
                round2Heat
                round3Heat
                round1Result
                seed
                round2Seed
                round3Seed
                round2Result
                round3Result
                finalResult
                bib
                firstName
                lastName
                fullName
                gender
                uuid
              }
            } 
          }`,
        variables: { userId }
      };
      return ajax({
        url: graphql_endpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": graphql_api_key
        },
        body: body
      }).pipe(
        map(xhr => getRacesByUserSuccess(xhr.response.data.getRacesByUserId)),
        takeUntil(actions$.ofType(RacesActions.GET_RACES_BY_USER_SUCCESS)),
        retry(2),
        catchError(error => of(getRacesByUserFailure()))
      );
    })
  );
};

export const createRace = actions$ => {
  // using variable pattern in body so the array of result data can be sent
  return actions$.pipe(
    ofType(RacesActions.CREATE_RACE),
    mergeMap(action => {
      const { name, userId, results, wsName } = action.payload;
      const body = {
        query: `mutation putRace($name: String! $userId: String! $wsName: String $results: [ResultInput] ) {
            createRace(
              input: { 
                name: $name, 
                userId: $userId, 
                organization: $wsName
                results: $results 
              }
            ) { 
              name, 
              userId,
              id
              results { 
                teamName
                round1Heat
                round2Heat
                round3Heat
                round1Result
                seed
                round2Seed
                round3Seed
                round2Result
                round3Result
                finalResult
                bib
                firstName
                lastName
                fullName
                gender
                uuid
              } 
            } 
          }`,
        variables: { name, userId, results, wsName }
      };
      return ajax({
        url: graphql_endpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": graphql_api_key
        },
        body: body
      }).pipe(
        map(xhr => createRaceSuccess(xhr.response.data.createRace)),
        takeUntil(actions$.ofType(RacesActions.CREATE_RACE_SUCCESS)),
        retry(2),
        catchError(error => of(createRaceFailure()))
      );
    })
  );
};

export const updateRace = actions$ => {
  return actions$.pipe(
    ofType(RacesActions.UPDATE_RACE),
    filter(({ payload }) => payload.id !== ""),
    mergeMap(action => {
      const { id, name, results } = action.payload;
      const body = {
        query: `mutation updateRace($name: String! $id: String! $results: [ResultInput] ) {
          updateRace(
              input: {
                id: $id,
                name: $name, 
                results: $results 
              }
            ) {
              id
              name, 
              results { 
                teamName
                round1Heat
                round2Heat
                round3Heat
                round1Result
                seed
                round2Seed
                round3Seed
                round2Result
                round3Result
                finalResult
                bib
                firstName
                lastName
                fullName
                gender
                uuid
              } 
            } 
          }`,
        variables: { id, name, results }
      };
      return ajax({
        url: graphql_endpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": graphql_api_key
        },
        body: body
      }).pipe(
        map(xhr => {
          message.success("Successfully saved data!");
          return updateRaceSuccess(xhr.response.data.updateRace);
        }),
        takeUntil(actions$.ofType(RacesActions.UPDATE_RACE_SUCCESS)),
        retry(2),
        catchError(error => of(updateRaceFailure()))
      );
    })
  );
};

export const deleteRace = actions$ => {
  return actions$.pipe(
    ofType(RacesActions.DELETE_RACE),
    mergeMap(action => {
      const { id } = action.payload;
      const body = {
        query: `mutation deleteRace($id: ID! ) {
          deleteRace(
            id: $id
          ) { 
            id
            name
          } 
        }`,
        variables: { id }
      };
      return ajax({
        url: graphql_endpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": graphql_api_key
        },
        body: body
      }).pipe(
        map(xhr => {
          message.success("Successfully deleted the race!");
          return deleteRaceSuccess(xhr.response.data.deleteRace);
        }),
        takeUntil(actions$.ofType(RacesActions.DELETE_RACE_SUCCESS)),
        retry(2),
        catchError(error => of(deleteRaceFailure()))
      );
    })
  );
};

export const getRace = actions$ => {
  return actions$.pipe(
    ofType(RacesActions.GET_RACE_BY_ID),
    mergeMap(action => {
      const { id } = action.payload;
      const body = {
        query: `query getRace($id: ID! ) {
          getRace(
            id: $id
          ) { 
            id
            userId
            name
            results {
              teamName
              round1Heat
              round2Heat
              round3Heat
              round1Result
              seed
              round2Seed
              round3Seed
              round2Result
              round3Result
              finalResult
              bib
              firstName
              lastName
              fullName
              gender
              uuid
            }
          } 
        }`,
        variables: { id }
      };
      return ajax({
        url: graphql_endpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": graphql_api_key
        },
        body: body
      }).pipe(
        map(xhr => getRaceByIdSuccess(xhr.response.data.getRace)),
        takeUntil(actions$.ofType(RacesActions.GET_RACE_BY_ID_SUCCESS)),
        retry(2),
        catchError(error => of(getRaceByIdFailure()))
      );
    })
  );
};

export const getAllRaces = actions$ => {
  // new lines will break these queries
  const GET_ALL_RACES = `listRaces { id, name, userId }`;

  return actions$.pipe(
    ofType(RacesActions.GET_ALL_RACES),
    mergeMap(action => {
      return ajax({
        url: graphql_endpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": graphql_api_key
        },
        body: `{ "query": "{ ${GET_ALL_RACES} }" }`
      }).pipe(
        map(xhr => getRacesSuccess(xhr.response.data.listRaces)),
        takeUntil(actions$.ofType(RacesActions.GET_ALL_RACES_SUCCESS)),
        retry(2),
        catchError(error => of(getRacesFailure()))
      );
    })
  );
};

export default combineEpics(
  getRaces,
  createRace,
  updateRace,
  deleteRace,
  getAllRaces,
  getRace
);

/*
****
**** Deprecated in favor of GraphQL - Leaving for reference ****
****

  import { XMLHttpRequest } from "xmlhttprequest";


  function createXHR() {
    return new XMLHttpRequest();
  }

  export const getAllRaces = actions$ => {
    return actions$.pipe(
      ofType(RacesActions.GET_ALL_RACES),
      mergeMap(action => {
        return ajax({
          url: `${endpoint}/races-all`,
          method: "GET"
        }).pipe(
          map(races => getRacesSuccess(races.response)),
          takeUntil(actions$.ofType(RacesActions.GET_ALL_RACES_SUCCESS)),
          retry(2),
          catchError(error => of(getRacesFailure()))
        );
      })
    );
  };

  export const createRace = actions$ => {
    return actions$.pipe(
      ofType(RacesActions.CREATE_RACE),
      mergeMap(action => {
        return ajax
          .post(`${endpoint}/races`, action.payload, {
            "Content-Type": "application/json"
          })
          .pipe(
            map(race => createRaceSuccess(race.response)),
            takeUntil(actions$.ofType(RacesActions.CREATE_RACE_SUCCESS)),
            retry(2),
            catchError(error => of(createRaceFailure()))
          );
      })
    );
  };

  export const getRace = actions$ => {
  return actions$.pipe(
    ofType(RacesActions.GET_RACE_BY_ID),
    mergeMap(action => {
      const id = action.payload.id;
      return ajax({
        url: `${endpoint}/races/${id}`,
        method: "GET"
      }).pipe(
        map(races => getRaceByIdSuccess(races.response)),
        takeUntil(actions$.ofType(RacesActions.GET_RACE_BY_ID_SUCCESS)),
        retry(2),
        catchError(error => of(getRaceByIdFailure()))
      );
    })
  );
};

export const deleteRace = actions$ => {
    return actions$.pipe(
    ofType(RacesActions.DELETE_RACE),
    mergeMap(action => {
      const raceId = action.payload.id;
      return ajax
        .delete(`${endpoint}/races/${raceId}`, {
          "Content-Type": "application/json"
        })
        .pipe(
          map(race => {
            // emitSocket([]);
            message.success("Successfully deleted the race!");
            return deleteRaceSuccess(race.response);
          }),
          takeUntil(actions$.ofType(RacesActions.DELETE_RACE_SUCCESS)),
          retry(2),
          catchError(error => of(deleteRaceFailure()))
        );
    })
  );
};

export const getRaces = actions$ => {
    return actions$.pipe(
    ofType(RacesActions.GET_RACES_BY_USER),
    mergeMap(action => {
      const userIdParam = `?userId=${action.payload.userId}`;
      return ajax({
        createXHR,
        url: `${endpoint}/races${userIdParam}`,
        method: "GET"
      }).pipe(
        map(races => getRacesByUserSuccess(races.response)),
        takeUntil(actions$.ofType(RacesActions.GET_RACES_BY_USER)),
        retry(2),
        catchError(error => of(getRacesByUserFailure()))
      );
    })
  );
}

export const updateRace = actions$ => {
  return actions$.pipe(
    ofType(RacesActions.UPDATE_RACE),
    mergeMap(action => {
      const raceId = action.payload.id;
      return ajax
        .put(`${endpoint}/races/${raceId}`, action.payload.results, {
          "Content-Type": "application/json"
        })
        .pipe(
          map(race => {
            // emitSocket(race.response);
            message.success("Successfully saved data!");
            return updateRaceSuccess(race.response);
          }),
          takeUntil(actions$.ofType(RacesActions.UPDATE_RACE_SUCCESS)),
          retry(2),
          catchError(error => of(updateRaceFailure()))
        );
    })
  );
};

*/
