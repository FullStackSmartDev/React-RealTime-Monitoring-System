import { createSelector } from "reselect";

import { State } from "@store/index";
import { Trailer } from "./reducer";
import { TrailerPermissions } from "./types";

const getQuery = ({ trailers }: State) => trailers.query;
const getTrailers = ({ trailers }: State) => trailers.entities;
const getOrder = ({ trailers }: State) => trailers.order;

export const getTrailer = ({ trailers }: State) => trailers.active;
export const getActiveTrailer = ({ trailers }: State) =>
  (trailers.active && trailers.entities[trailers.active]) || null;
export const getTrailerSettings = ({ trailers }: State) =>
  (trailers.active && trailers.entities[trailers.active].cameraSettings) ||
  null;

type TrailerProps = keyof Trailer;
type StringPropNamesOrNever = {
  [P in keyof Trailer]: Trailer[P] extends string | undefined ? P : never;
};
type TrailerStringProps = Exclude<
  StringPropNamesOrNever[TrailerProps],
  undefined
>;

export const getTrailersOrderFilteredByQuery = createSelector(
  [getQuery, getTrailers, getOrder],
  (query, trailers, order) =>
    order.filter((id) => {
      const trailer = trailers[id];
      const selectedFields: TrailerStringProps[] = [
        "id",
        "plateNumber",
        "name",
      ];
      const definedFields = selectedFields.map((field) => trailer[field] || "");
      const preparedToMatch = definedFields.map((field) =>
        field.toLowerCase().trim()
      );
      return preparedToMatch.some((field) =>
        field.includes(query.toLowerCase().trim())
      );
    })
);

export const getFilteredTrailersInOrder = createSelector(
  [getQuery, getTrailers, getOrder],
  (query, trailers, order) => {
    const filterByQuery = (trailer: Trailer) => {
      if (!query) return true;
      return ["name", "plateNumber", "id"].find((key) =>
        trailer[key].toLowerCase().includes(query)
      );
    };
    const sorted = order.map((identifier) => trailers[identifier]);
    return sorted.filter(filterByQuery);
  }
);

export const getPermission = (permission: TrailerPermissions) =>
  createSelector([getActiveTrailer], (trailer) => {
    if (trailer) {
      return trailer.permission[permission];
    }
    return false;
  });

export const getError = (store: State) => store.trailers.error;
