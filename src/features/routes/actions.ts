import { Dispatch } from "redux";
import { State } from "@store/index";
import api, { RoutesQuery } from "@api/index";
import { TrailerPosition } from "./reducer";
import { TrailerId } from "@screens/trailers/reducer";

export enum RoutesActionTypes {
  fetchRoutesSent = "RoutesActionTypes.fetchRoutes",
  fetchRoutesSuccess = "RoutesActionTypes.fetchRoutesSuccess",
  fetchRoutesFail = "RoutesActionTypes.fetchRoutesFail",
}

export function fetchRoutes(id: TrailerId, filter: RoutesQuery = {}) {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { auth } = getState();
    try {
      dispatch({ type: RoutesActionTypes.fetchRoutesSent });
      const { data } = await api.fetchRoutes({ id, filter, auth });
      const route: TrailerPosition[] = data.map((point: any) => ({
        date: new Date(point.sent_at),
        speed: point.speed !== null ? Number.parseFloat(point.speed) : null,
        signal: point.signal !== null ? Number.parseFloat(point.signal) : null,
        location: {
          lat:
            point.latitude !== null ? Number.parseFloat(point.latitude) : null,
          lng:
            point.longitude !== null
              ? Number.parseFloat(point.longitude)
              : null,
        },
      }));
      const last = route[route.length - 1];
      dispatch({
        type: RoutesActionTypes.fetchRoutesSuccess,
        payload: { id, route, last },
      });
    } catch (error) {
      dispatch({
        type: RoutesActionTypes.fetchRoutesFail,
        error: true,
        payload: { error },
      });
    }
  };
}
