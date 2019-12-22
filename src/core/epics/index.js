import "rxjs";
import { combineEpics } from "redux-observable";
import { ajax } from "rxjs/ajax";
import { Observable } from "rxjs";
import { mergeMap, takeUntil, map, retry, catchError } from "rxjs/operators";
import { ofType } from "redux-observable";
import {
  RacesActions,
  getRacesByUserSuccess,
  getRacesByUserFailure,
  createRaceSuccess,
  createRaceFailure
} from "../actions";

const endpoint = process.env.REACT_APP_SERVERLESS_API_ENDPOINT;

export const getRaces = actions$ => {
  return actions$.pipe(
    ofType(RacesActions.GET_RACES_BY_USER),
    mergeMap(action => {
      const userIdParam = `?userId=${action.payload.userId}`;
      return ajax.getJSON(`${endpoint}/races${userIdParam}`).pipe(
        map(races => getRacesByUserSuccess(races)),
        takeUntil(actions$.ofType(RacesActions.GET_RACES_BY_USER)),
        retry(2),
        catchError(error => Observable.of(getRacesByUserFailure()))
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
          takeUntil(actions$.ofType(RacesActions.CREATE_RACE)),
          retry(2),
          catchError(error => Observable.of(createRaceFailure()))
        );
    })
  );
};

export default combineEpics(getRaces, createRace);
