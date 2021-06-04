import { createSelector } from "reselect";
import { State } from "@store/index";
import { getTrailer } from "@screens/trailers/selectors";

const getSensors = ({ sensors }: State) => sensors.sensors;

export const getTrailerSensors = createSelector(
  [getTrailer, getSensors],
  (trailer, sensors) => {
    if (trailer && trailer in sensors) {
      return sensors[trailer] || null;
    }
    return null;
  }
);
