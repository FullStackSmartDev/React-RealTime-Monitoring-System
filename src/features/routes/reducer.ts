import { TrailerId } from "@screens/trailers/reducer";
import { RoutesActionTypes } from "./actions";
import createLoadingReducer from "@common/create-loading-reducer";

export interface TrailerPosition {
  date: Date;
  speed: number;
  signal: number;
  location: google.maps.LatLngLiteral;
}

export interface RoutesState {
  routes: { [key in TrailerId]: TrailerPosition[] };
  loading: boolean;
  error: Error | null;
}

const initialState: RoutesState = {
  routes: {},
  loading: false,
  error: null,
};

function reducer(
  state: RoutesState = initialState,
  action: Action = { type: "" }
) {
  switch (action.type) {
    case RoutesActionTypes.fetchRoutesSuccess:
      return {
        ...state,
        routes: {
          ...state.routes,
          [action.payload.id]: action.payload.route,
        },
      };
    default:
      return state;
  }
}

export default createLoadingReducer(
  reducer,
  RoutesActionTypes.fetchRoutesSent,
  RoutesActionTypes.fetchRoutesSuccess,
  RoutesActionTypes.fetchRoutesFail
);
