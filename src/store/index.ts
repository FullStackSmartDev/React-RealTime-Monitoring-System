import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  createStore,
  combineReducers,
  applyMiddleware,
  Middleware,
  Reducer,
} from "redux";
import { persistStore, persistReducer } from "redux-persist";

import authReducer, { AuthState } from "@features/auth/reducer";
import eventsReducer, { TrailerEventsState } from "@features/events/reducer";
import monitoringReducer, {
  MonitoringState,
} from "@features/monitoring/reducer";
import routesReducer, { RoutesState } from "@features/routes/reducer";
import sensorsReducer, { SensorsState } from "@features/sensors/reducer";
import trailersReducer, { TrailersState } from "@screens/trailers/reducer";
import uiReducer, { UiState } from "@ui/reducer";
import { AuthActions } from "@features/auth/actions";
import { cableApp } from "../ws";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export interface State {
  monitoring: MonitoringState;
  trailers: TrailersState;
  sensors: SensorsState;
  auth: AuthState;
  events: TrailerEventsState;
  routes: RoutesState;
  ui: UiState;
}

export const useTypedSelector: TypedUseSelectorHook<State> = useSelector;

const combinedReducers = combineReducers<State>({
  monitoring: monitoringReducer,
  trailers: trailersReducer,
  sensors: sensorsReducer,
  auth: authReducer,
  events: eventsReducer,
  routes: routesReducer,
  ui: uiReducer,
});

const appReducer: Reducer<State, Action> = (state, action) => {
  if (action.type === AuthActions.logoutRequestSent) {
    return combinedReducers(undefined, action);
  }
  return combinedReducers(state, action);
};

const reducers = persistReducer(
  {
    whitelist: ["auth"],
    key: "root",
    storage,
  },
  appReducer
);

const unauthorize: Middleware = (_) => (next) => (action) => {
  if (action.error && action.payload.error && action.payload.error.response) {
    const { status } = action.payload.error.response;
    if (status === 401 && action.type !== AuthActions.loginRequestFail) {
      next({ ...action, type: AuthActions.invalidateSession });
    }
  }
  return next(action);
};

const websocket: Middleware = (_) => (next) => (action) => {
  if (
    action.payload &&
    action.payload.meta &&
    action.payload.meta.websocket &&
    cableApp.network
  ) {
    const { meta, ...payload } = action.payload;
    cableApp.network.send(payload);
  }
  return next(action);
};

const purge: Middleware = (_) => (next) => async (action) => {
  if (action.type === AuthActions.logoutRequestSent && persistor) {
    await persistor.purge();
  }
  return next(action);
};

export const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(unauthorize, purge, websocket, thunk))
);
export const persistor = persistStore(store);
