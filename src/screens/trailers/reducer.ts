import { TrailersActionTypes } from "./actions";
import { TrailerStates, TrailerPermissions } from "./types";
import createLoadingReducer from "@common/create-loading-reducer";
import { MonitoringCameras, CameraSetting } from "@features/monitoring/types";

export type TrailerId = string;

export const DeviceStatus = {
  FUSE_OFF: 0,
  OK_OFF: 1,
  OK_ON: 2,
};

interface Position extends google.maps.LatLngLiteral {
  date?: string;
  name?: string;
  speed?: number;
  signal?: number;
  roaming?: boolean;
}

export interface Trailer {
  id: TrailerId;
  plateNumber: string;
  name?: string;
  lastLogin?: Date;
  permission: { [key in TrailerPermissions]: boolean };
  position?: Position;
  driver?: number;
  baseTime?: Date;
  state?: TrailerStates;
  spedition_company?: string; // ADDED "Display customer name"
  engine_running: boolean; // ADDED https://www.wrike.com/open.htm?id=445612989
  network_available: boolean;
  cameraSettings: { [key in MonitoringCameras]: CameraSetting };
  note: string;
  horn: number;
  smoke: number;
  [key: string]: any;
  status_flag?: {
    alarm: string;
    loading: string;
    driving: string;
    connection: string;
    detection: string;
    armed: string;
    truck: string;
  };
}

export interface TrailersState {
  entities: {
    [key: string]: Trailer;
  };
  order: TrailerId[];
  orderFunction: OrderFunctions | null;
  query: string;
  active: TrailerId | null;
  edited: Partial<Trailer> | null;
  loading: boolean;
  error: Error | null;
}

const initialState: TrailersState = {
  entities: {},
  order: [],
  orderFunction: null,
  query: "",
  active: null,
  edited: null,
  loading: true,
  error: null,
};

const priorities: { [key in TrailerStates]: number } = {
  [TrailerStates.alarm]: 0,
  [TrailerStates.quiet]: 0,
  [TrailerStates.emergency]: 0,
  [TrailerStates.shutdownImmediate]: 0,
  [TrailerStates.humanDetected]: 0,
  [TrailerStates.doorOpened]: 0,
  [TrailerStates.motionDetected]: 0,
  [TrailerStates.jammingDetected]: 0,
  [TrailerStates.silenced]: 1,
  [TrailerStates.truckBatteryLow]: 1,
  [TrailerStates.truckDisconnected]: 1,
  [TrailerStates.humanCleared]: 2,
  [TrailerStates.warning]: 2,
  [TrailerStates.shutdownPending]: 2,
  [TrailerStates.truckParkingOn]: 2,
  [TrailerStates.truckParkingOff]: 2,
  [TrailerStates.doorClosed]: 4,
  [TrailerStates.motionCleared]: 4,
  [TrailerStates.truckConnected]: 4,
  [TrailerStates.truckBatteryNormal]: 4,
  [TrailerStates.truckEngineOff]: 4,
  [TrailerStates.truckEngineOn]: 4,
  [TrailerStates.systemTurnedOn]: 4,
  [TrailerStates.off]: 4,
  [TrailerStates.resolved]: 4,
  [TrailerStates.armed]: 4,
  [TrailerStates.disarmed]: 4,
  [TrailerStates.startLoading]: 4,
  [TrailerStates.jammingOff]: 4,
  [TrailerStates.endLoading]: 4,
  [TrailerStates.ok]: 8,
  [TrailerStates.unknown]: 16,

  [TrailerStates.gpsSignalLost]: 4, // TODO(bartosz-szczecinski) What should the priorities be?
  [TrailerStates.networkOff]: 4,
  [TrailerStates.networkOn]: 4,
};

/**
 * Validate that the trailer position has changed compared to what we have stored
 * in Redux. This allows us to not refresh Redux store when no actual changes happened
 * so that we don't re-render too much.
 */
function hasTrailerChanged(
  trailers: Record<TrailerId, Trailer>,
  trailer: Trailer
) {
  if (!trailers[trailer.id]) return true;

  // Check last login date (and potentially later on the base time)
  if (
    trailer.lastLogin?.getTime() !== trailers[trailer.id].lastLogin?.getTime()
  ) {
    return true;
  }

  // Check all simple types
  const baseChanged = Object.entries(trailer).map(
    ([trailerKey, trailerKeyValue]) => {
      if (["string", "boolean", "number"].includes(typeof trailerKeyValue)) {
        if (trailers[trailer.id][trailerKey] !== trailerKeyValue) {
          return true;
        }
      }
      return false;
    }
  );

  if (baseChanged.includes(true)) return true;

  // Check if the position (and network status) has changed
  if (trailer.position) {
    const positionChanged = Object.entries(trailer.position).map(
      ([trailerKey, trailerKeyValue]: [string, any]) => {
        if (["string", "boolean", "number"].includes(typeof trailerKeyValue)) {
          if (
            trailers[trailer.id].position?.[trailerKey as keyof Position] !==
            trailerKeyValue
          ) {
            return true;
          }
        }
        return false;
      }
    );
    if (positionChanged.includes(true)) return true;
  }

  return false;
}

const orderByName = (a: Trailer, b: Trailer) => {
  if (!a || !b) return 0;
  const aName = a.plateNumber;
  const bName = b.plateNumber;
  if (aName > bName) return 1;
  else if (aName < bName) return -1;
  return 0;
};

const orderByLastLogin = (a: Trailer, b: Trailer) => {
  if (!a || !b) return 0;
  if (!a.lastLogin || !b.lastLogin) return 0;
  return b.lastLogin.getTime() - a.lastLogin.getTime();
};

const orderByPriority = (trailers: Trailer[]): TrailerId[] => {
  return trailers
    .sort((trailerA: Trailer, trailerB: Trailer) => {
      const prio =
        priorities[trailerA.state || TrailerStates.unknown] -
        priorities[trailerB.state || TrailerStates.unknown];
      if (prio === 0 || trailerA.state === trailerB.state) {
        return trailerA.plateNumber.localeCompare(trailerB.plateNumber);
      }
      return prio;
    })
    .map((trailer: Trailer) => trailer.id);
};

const orderWith = (
  trailers: Trailer[],
  orderFunction: OrderFunction
): TrailerId[] => {
  return trailers.sort(orderFunction).map((item: Trailer) => item.id);
};

type OrderFunction = (a: Trailer, b: Trailer) => number;
export enum OrderFunctions {
  byLastLogin = "byLastLogin",
  byName = "byName",
}

export const orderMap: Record<OrderFunctions, OrderFunction> = {
  [OrderFunctions.byLastLogin]: orderByLastLogin,
  [OrderFunctions.byName]: orderByName,
};

function trailer(
  state = initialState,
  action: Action = { type: "" }
): TrailersState {
  switch (action.type) {
    case TrailersActionTypes.fetchTrailersSuccess:
      /**
       * Only update trailer if there's some change in it. Step through simple properties
       * and if none of them are different, fallback to checking the lastLogin field
       */
      const updateKeys: string[] = [];
      Object.entries(action.payload.entities as Trailer[]).forEach(
        ([trailerId, trailerData]) => {
          const newTrailer = {
            ...state.entities[trailerId],
            ...trailerData,
          };
          if (hasTrailerChanged(state.entities, newTrailer))
            updateKeys.push(trailerId);
        }
      );
      if (updateKeys.length === 0) {
        return state;
      }

      const entities = updateKeys.reduce((accumulator, trailerId) => {
        return {
          ...accumulator,
          [trailerId]: {
            ...accumulator[trailerId],
            ...action.payload.entities[trailerId],
          },
        };
      }, state.entities);

      return {
        ...state,
        order: state.orderFunction
          ? orderWith(Object.values(entities), orderMap[state.orderFunction])
          : orderByPriority(Object.values(entities)),
        entities,
      };

    case TrailersActionTypes.setTrailerState:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.id]: {
            ...state.entities[action.payload.id],
            state: action.payload.status,
          },
        },
      };

    case TrailersActionTypes.setOrder:
      return {
        ...state,
        orderFunction: action.payload.orderFunction,
        order: action.payload.orderFunction
          ? orderWith(
              Object.values(state.entities),
              orderMap[action.payload.orderFunction as OrderFunctions]
            )
          : orderByPriority(Object.values(state.entities)),
      };

    case TrailersActionTypes.setTrailerStateSuccess:
    case TrailersActionTypes.setTrailerStateFail:
    case TrailersActionTypes.readTrailerStateSuccess:
      const newTrailer = {
        ...state.entities[action.payload.id],
        ...action.payload.trailer,
      };
      if (!hasTrailerChanged(state.entities, newTrailer)) {
        return state;
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.id]: newTrailer,
        },
      };
    case TrailersActionTypes.selectTrailer:
      return {
        ...state,
        active: action.payload.id,
      };
    case TrailersActionTypes.filterTrailers:
      return {
        ...state,
        query: action.payload.query,
      };
    case TrailersActionTypes.updateTrailerNote:
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.id]: {
            ...state.entities[action.payload.id],
            note: action.payload.note,
          },
        },
      };
    default:
      return state;
  }
}

export default createLoadingReducer(
  trailer,
  TrailersActionTypes.fetchTrailersSent,
  TrailersActionTypes.fetchTrailersSuccess,
  TrailersActionTypes.fetchTrailersFail
);
