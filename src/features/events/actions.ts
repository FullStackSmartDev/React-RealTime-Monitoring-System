import moment, { Moment } from "moment";

import api, { EventsQuery } from "@api/index";
import { State } from "@store/index";
import { TrailerEventId, TrailerEvent } from "./reducer";
import { TrailerId } from "@screens/trailers/reducer";
import { TrailerStates, TrailerStatesHelper } from "@screens/trailers/types";
import { Dispatch } from "redux";

export enum TrailerEventsActionTypes {
  setFilterValue = "TrailerEventsActionTypes.setFilterValue",
  setMinDateValue = "TrailerEventsActionTypes.setMinDateValue",
  setMaxDateValue = "TrailerEventsActionTypes.setMaxDateValue",
  fetchEventsSent = "TrailerEventsActionTypes.fetchEventsSent",
  fetchEventsSuccess = "TrailerEventsActionTypes.fetchEventsSuccess",
  fetchEventsFail = "TrailerEventsActionTypes.fetchEventsFail",
  setEventInteractions = "TrailerEventsActionTypes.setEventInteractions",
  resetFilters = "TrailerEventsActionTypes.resetFilters",
  updateEvent = "TrailerEventsActionTypes.updateEvent",
}

export function resetFilters() {
  return {
    type: TrailerEventsActionTypes.resetFilters,
    payload: null,
  };
}

export function setFilterValue(filter: TrailerStates, value: boolean) {
  return {
    type: TrailerEventsActionTypes.setFilterValue,
    payload: { filter, value },
  };
}

export function setMaxDateValue(date: Date | Moment) {
  return {
    type: TrailerEventsActionTypes.setMaxDateValue,
    payload: {
      date: moment(date).endOf("day").toDate(),
    },
  };
}

export function setMinDateValue(date: Date | Moment) {
  return {
    type: TrailerEventsActionTypes.setMinDateValue,
    payload: {
      date: moment(date).startOf("day").toDate(),
    },
  };
}

const defaultFilters = (): EventsQuery => ({
  from: moment().subtract(1, "month").startOf("day").toDate(),
  to: moment().endOf("day").toDate(),
  kinds: {
    [TrailerStates.startLoading]: true,
    [TrailerStates.endLoading]: true,
    [TrailerStates.alarm]: true,
    [TrailerStates.silenced]: true,
    [TrailerStates.off]: false,
    [TrailerStates.resolved]: false,
    [TrailerStates.armed]: true,
    [TrailerStates.disarmed]: true,
    [TrailerStates.quiet]: true,
    [TrailerStates.emergency]: true,
    [TrailerStates.warning]: true,
    [TrailerStates.ok]: false,
    [TrailerStates.unknown]: false,
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
    [TrailerStates.networkOff]: true,
    [TrailerStates.networkOn]: true,    
    [TrailerStates.systemTurnedOn]: true,
  },
  limit: 20,
});

export function fetchEvents(
  id: TrailerId | undefined,
  filter: EventsQuery = defaultFilters()
) {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch({ type: TrailerEventsActionTypes.fetchEventsSent });
    const { auth, trailers } = getState();
    try {
      const trailerId = id !== undefined ? id : trailers.active;
      if (trailerId === null) return;
      const { data } = await api.fetchEvents({ id: trailerId, filter, auth });
      const payload = data.reduce(mapEvent, {
        order: [],
        entities: {},
        id: trailerId,
      });
      dispatch({ type: TrailerEventsActionTypes.fetchEventsSuccess, payload });
    } catch (error) {
      dispatch({
        type: TrailerEventsActionTypes.fetchEventsFail,
        error: true,
        payload: { error },
      });
    }
  };
}

type EventsAccumulator = {
  id: TrailerId;
  order: TrailerEventId[];
  entities: { [key in TrailerEventId]: TrailerEvent };
};

export const mapInteraction = (interaction: any) => ({
  type: TrailerStatesHelper.from(interaction.kind),
  logistician: interaction.logistician,
  date: new Date(interaction.triggered_at),
});

type Interaction = TrailerEvent["interactions"][0];

export const mapEvent = (
  { order, entities, id }: EventsAccumulator,
  event: any
) => {
  let interactions: Interaction[] = [];
  if (event.interactions) {
    interactions = event.interactions
      .map(mapInteraction)
      .sort(
        (a: Interaction, b: Interaction) => a.date.getTime() - b.date.getTime()
      )
      .filter(
        (interaction: Interaction, index: number, array: Interaction[]) => {
          return array.findIndex((i) => i.type === interaction.type) >= index;
        }
      );
  }

  let location: TrailerEvent["location"] = undefined;
  if (event.route_log) {
    const {
      latitude,
      longitude,
      location_name: locationName,
      speed,
      signal,
    } = event.route_log;
    location = {
      lat: latitude !== null ? Number.parseFloat(latitude) : 0,
      lng: longitude !== null ? Number.parseFloat(longitude) : 0,
      name: locationName || "",
      speed: speed,
      signal: signal,
    };
  }

  let logistician: undefined;
  if (event.logistician) {
    logistician = event.logistician;
  }

  return {
    id,
    order: [...order, event.id],
    entities: {
      ...entities,
      [event.id]: {
        id: event.id,
        trailerId: event.trailer.id,
        location,
        type: TrailerStatesHelper.from(event.kind),
        date: new Date(event.triggered_at),
        logistician,
        interactions,
      },
    },
  };
};
