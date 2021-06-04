import moment from "moment";
import { createSelector } from "reselect";

import { State } from "@store/index";
import {
  getTrailersOrderFilteredByQuery,
  getTrailer,
} from "@screens/trailers/selectors";

const getRoutes = ({ routes }: State) => routes.routes;
const getMinDate = ({ events }: State) => events && events.minDate;
const getMaxDate = ({ events }: State) => events && events.maxDate;
const getLoading = ({ routes }: State) => routes.loading;

export const getRoutePoints = createSelector(
  [
    getTrailersOrderFilteredByQuery,
    getRoutes,
    getMinDate,
    getMaxDate,
    getTrailer,
  ],
  (filteredTrailerIds, routes, minDate, maxDate, trailer) =>
    Object.keys(routes)
      .filter((routeTrailer) =>
        trailer
          ? routeTrailer === trailer
          : filteredTrailerIds.includes(routeTrailer)
      )
      .map((routeTrailer) =>
        routes[routeTrailer].filter(
          (point) =>
            moment(point.date).isBefore(moment(maxDate).endOf("day")) &&
            moment(point.date).isAfter(moment(minDate).startOf("day"))
        )
      )
);

export const isRouteLoading = createSelector(
  [getLoading],
  (loading) => loading
);
