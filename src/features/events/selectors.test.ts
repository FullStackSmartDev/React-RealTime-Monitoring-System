import { TrailerStates } from "@screens/trailers/types";
import { TrailerEvent } from "./reducer";
import { removeShortLivedEvents } from "./selectors";

describe("events selector", () => {
  describe("event filtering", () => {
    it("properly filters out cancelling pairs", () => {
      const shortLivedEvents: { [x: string]: TrailerEvent } = {
        1: {
          type: TrailerStates.truckEngineOff,
          date: new Date("2020-11-10T14:02:57.000Z"),
          trailerId: "1",
          id: "1",
          interactions: [],
        },
        2: {
          type: TrailerStates.truckEngineOn,
          date: new Date("2020-11-10T14:03:57.000Z"),
          trailerId: "1",
          id: "2",
          interactions: [],
        },
      };

      expect(
        removeShortLivedEvents(shortLivedEvents, Object.keys(shortLivedEvents))
          .length
      ).toBe(0);

      const mixedEvents: { [x: string]: TrailerEvent } = {
        1: {
          type: TrailerStates.truckEngineOff,
          date: new Date("2020-11-10T14:02:57.000Z"),
          trailerId: "1",
          id: "1",
          interactions: [],
        },
        2: {
          type: TrailerStates.systemTurnedOn,
          date: new Date("2020-11-10T14:03:57.000Z"),
          trailerId: "1",
          id: "2",
          interactions: [],
        },
        3: {
          type: TrailerStates.truckEngineOn,
          date: new Date("2020-11-10T14:03:59.000Z"),
          trailerId: "1",
          id: "3",
          interactions: [],
        },
      };

      expect(
        removeShortLivedEvents(mixedEvents, Object.keys(mixedEvents)).length
      ).toBe(1);
    });

    it("keeps canceling pairs if timespan is greater than defined", () => {
      const longLivedEvents: { [x: string]: TrailerEvent } = {
        1: {
          type: TrailerStates.truckEngineOff,
          date: new Date("2020-11-10T14:02:57.000Z"),
          trailerId: "1",
          id: "1",
          interactions: [],
        },
        2: {
          type: TrailerStates.truckEngineOn,
          date: new Date("2020-11-10T14:12:57.000Z"),
          trailerId: "1",
          id: "2",
          interactions: [],
        },
      };

      expect(
        removeShortLivedEvents(longLivedEvents, Object.keys(longLivedEvents))
          .length
      ).toBe(2);
    });
  });
});
