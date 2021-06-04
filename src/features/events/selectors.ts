import moment, { Moment } from "moment";
import { createSelectorCreator, createSelector } from "reselect";

import memoize from "@utils/memoize";
import { State } from "@store/index";
import { TrailerEvent, TrailerEventsState } from "./reducer";
import { compareAsUniqueArrays } from "@utils/comparators";
import { getTrailer } from "@screens/trailers/selectors";
import { TrailerStates, TrailerStatesHelper } from "@screens/trailers/types";
import { TrailerEventTypeCategory } from "./types";

const getEvents = ({ events }: State) => events.entities;
const getFilters = ({ events }: State) => events.filters;
const getTrailerEvents = ({ trailers, events }: State) =>
  trailers.active && events.trailerEvents[trailers.active];
const getMinDate = ({ events }: State) => events && events.minDate;
const getMaxDate = ({ events }: State) => events && events.maxDate;

type Filters = TrailerEventsState["filters"];

const CANCELLING_DURATION: number = 3;

const compareFilters = (a: Filters, b: Filters) =>
  Object.entries(a).every(
    ([key, val]) => TrailerStatesHelper.isTrailerState(key) && b[key] === val
  );

const customCreateSelector = createSelectorCreator(memoize, [
  compareAsUniqueArrays,
  null,
  compareFilters,
]);

interface CancellingEventStruct {
  typesToCancel: TrailerStates[];
  startCancel: Moment;
  endCancel: Moment;
}

const makeSelector = (category: TrailerEventTypeCategory) =>
  customCreateSelector(
    [getEvents, getTrailer, getFilters, getMinDate, getMaxDate],
    (events, trailer, filters, minDate, maxDate) => {
      const currentEvents = Object.values(events).filter(
        (event) =>
          event.trailerId === trailer &&
          filters[event.type] &&
          TrailerStatesHelper.toCategory(event.type) === category &&
          event.location &&
          event.location.lat !== null &&
          event.location.lng !== null &&
          moment(event.date).isBetween(
            moment(minDate).startOf("day"),
            moment(maxDate).endOf("day")
          )
      );
      return currentEvents;
    }
  );

export const getAlarmEvents = makeSelector(TrailerEventTypeCategory.alarm);
export const getArmedEvents = makeSelector(TrailerEventTypeCategory.armed);
export const getLoadingEvents = makeSelector(TrailerEventTypeCategory.loading);
export const getWarningEvents = makeSelector(TrailerEventTypeCategory.warning);
export const getNormalEvents = makeSelector(TrailerEventTypeCategory.normal);
export const getParkingEvents = makeSelector(TrailerEventTypeCategory.parking);
export const getRecognitionEvents = makeSelector(
  TrailerEventTypeCategory.recognition
);

export const removeShortLivedEvents = (
  events: { [x: string]: TrailerEvent },
  trailerEvents: string[] | null | ""
) => {
  const currentEvents = (trailerEvents || []).map((eventId) => events[eventId]);

  const cancellingEvents: CancellingEventStruct[] = [];

  currentEvents.forEach((event) => {
    if (TrailerStatesHelper.getCancellingPair(event.type).length > 0) {
      cancellingEvents.push({
        typesToCancel: TrailerStatesHelper.getCancellingPair(event.type),
        startCancel: moment(event.date).subtract(CANCELLING_DURATION, "minute"),
        endCancel: moment(event.date).add(CANCELLING_DURATION, "minute"),
      });
    }
  });

  const filterCancelledEvents: any[] = [];

  currentEvents.forEach((event) => {
    let cancel = false;
    cancellingEvents.forEach((blocker) => {
      if (
        moment(event.date).isBetween(blocker.startCancel, blocker.endCancel) &&
        blocker.typesToCancel.includes(event.type)
      ) {
        cancel = true;
      }
    });
    if (!cancel) {
      filterCancelledEvents.push(event);
    }
  });

  return filterCancelledEvents;
};

export const extractTrailerEvents = customCreateSelector(
  [getEvents, getTrailerEvents],
  removeShortLivedEvents
);

export const removeSpecificEvents = (typesToExclude: TrailerStates[]) =>
  createSelector([extractTrailerEvents], (events) =>
    events.filter((event) => !typesToExclude.includes(event.type))
  );

export const getSortedEvents = createSelector(
  [extractTrailerEvents],
  (events) =>
    events.sort((first, second) =>
      first.date && second.date ? +second.date - +first.date : 0
    )
);
