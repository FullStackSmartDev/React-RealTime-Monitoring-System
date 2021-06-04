import moment from "moment";

import createFetchingReducer from "@common/create-loading-reducer";
import { TrailerEventsActionTypes } from "./actions";
import { TrailerId } from "@screens/trailers/reducer";
import { TrailerStates } from "@screens/trailers/types";
import { AlarmAction, Logistician } from "./types";

export type TrailerEventId = string;

export interface TrailerEvent {
  date: Date;
  id: TrailerEventId;
  location?: google.maps.LatLngLiteral & { name?: string } & {
    speed?: number;
  } & { signal?: number };
  trailerId: TrailerId;
  type: TrailerStates;
  logistician?: Logistician;
  interactions: AlarmAction[];
}

export interface TrailerEventCluster {
  header: TrailerEvent;
  tail: TrailerEvent[];
}

export interface TrailerEventsState {
  entities: { [key in TrailerEventId]: TrailerEvent };
  trailerEvents: { [key in TrailerId]: TrailerEventId[] };
  filters: Partial<{ [key in TrailerStates]: boolean }>; // TODO(bartosz-szczecinski) Need to use partial here, because BE responds with 422 to unknown filters
  minDate: Date;
  maxDate: Date;
  loading: boolean;
  error: Error | null;
}

const initialState: TrailerEventsState = {
  entities: {},
  trailerEvents: {},
  filters: {
    [TrailerStates.ok]: false,
    [TrailerStates.startLoading]: true,
    [TrailerStates.endLoading]: true,
    [TrailerStates.alarm]: true,
    [TrailerStates.silenced]: true,
    [TrailerStates.resolved]: true,
    [TrailerStates.off]: true,
    [TrailerStates.armed]: true,
    [TrailerStates.disarmed]: true,
    [TrailerStates.warning]: true,
    [TrailerStates.quiet]: true,
    [TrailerStates.emergency]: true,
    [TrailerStates.truckConnected]: true,
    [TrailerStates.truckDisconnected]: true,
    [TrailerStates.shutdownImmediate]: true,
    [TrailerStates.shutdownPending]: true,
    [TrailerStates.truckBatteryLow]: true,
    [TrailerStates.truckBatteryNormal]: true,
    [TrailerStates.truckEngineOff]: true,
    [TrailerStates.truckEngineOn]: true,
    [TrailerStates.truckParkingOff]: true,
    [TrailerStates.truckParkingOn]: true,

    [TrailerStates.motionDetected]: true,
    [TrailerStates.motionCleared]: true,
    [TrailerStates.humanDetected]: true,
    [TrailerStates.humanCleared]: true,
    [TrailerStates.doorOpened]: true,
    [TrailerStates.doorClosed]: true,
    [TrailerStates.jammingDetected]: true,
    [TrailerStates.jammingOff]: true,
    [TrailerStates.networkOn]: true,
    [TrailerStates.networkOff]: true,    

    [TrailerStates.systemTurnedOn]: true,

    [TrailerStates.unknown]: false,
  },
  minDate: moment().subtract(3, "day").startOf("day").toDate(),
  maxDate: moment().endOf("day").toDate(),
  loading: true,
  error: null,
};

function event(
  state = initialState,
  action: Action = { type: "" }
): TrailerEventsState {
  switch (action.type) {
    case TrailerEventsActionTypes.updateEvent:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.id]: {
            ...state.entities[action.payload.id],
            interactions: action.payload.interactions,
          },
        },
      };
    case TrailerEventsActionTypes.fetchEventsSuccess:
      return {
        ...state,
        entities: {
          ...state.entities,
          ...action.payload.entities,
        },
        trailerEvents: {
          ...state.trailerEvents,
          [action.payload.id]: action.payload.order,
        },
      };
    case TrailerEventsActionTypes.setEventInteractions:
      const interactions = action.payload.interactions;
      const id = action.payload.id;
      return {
        ...state,
        entities: {
          ...state.entities,
          [id]: { ...state.entities[id], interactions },
        },
      };
    case TrailerEventsActionTypes.setFilterValue:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filter]: action.payload.value,
        },
      };
    case TrailerEventsActionTypes.setMaxDateValue:
      return {
        ...state,
        maxDate: action.payload.date,
      };
    case TrailerEventsActionTypes.setMinDateValue:
      return {
        ...state,
        minDate: action.payload.date,
      };
    case TrailerEventsActionTypes.resetFilters:
      return {
        ...state,
        filters: initialState.filters,
        minDate: initialState.minDate,
        maxDate: initialState.maxDate,
      };
    default:
      return state;
  }
}

export default createFetchingReducer(
  event,
  TrailerEventsActionTypes.fetchEventsSent,
  TrailerEventsActionTypes.fetchEventsSuccess,
  TrailerEventsActionTypes.fetchEventsFail
);
