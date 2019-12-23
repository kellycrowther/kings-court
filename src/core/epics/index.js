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
  switchMap
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
  getRacesByUser
} from "../actions";
import { message } from "antd";
import { emitSocket } from "../../sockets/sockets";

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
        catchError(error => of(getRacesByUserFailure()))
      );
    })
  );
};

// DELETE_RACE

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
          catchError(error => of(createRaceFailure()))
        );
    })
  );
};

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
            emitSocket(action.payload.results);
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
            emitSocket([]);
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

export default combineEpics(getRaces, createRace, updateRace, deleteRace);
