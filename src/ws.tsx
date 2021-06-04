import React, { createContext, Dispatch, useEffect } from "react";
import actioncable, { Cable, Channel } from "actioncable";
import { State, useTypedSelector } from "./store";
import { useDispatch } from "react-redux";
import jsonApi, { JsonApiResponse } from "./utils/json-api";
import {
  TrailersActionTypes,
  mapTrailer,
  fetchTrailers,
} from "@screens/trailers/actions";
import { fetchSensors } from "@features/sensors/actions";
import {
  fetchEvents,
  TrailerEventsActionTypes,
} from "@features/events/actions";
import { fetchRoutes } from "@features/routes/actions";
import {
  mapRawMedia,
  MonitoringActionTypes,
} from "@features/monitoring/actions";
import { AuthState } from "@features/auth/reducer";

const wsURL = `wss://${process.env.REACT_APP_BACKEND_HOST}/cable?connection_type=frontend`;
const channel = "Api::V1::AuthsChannel";

interface CableApp {
  cable?: Cable;
  network?: Channel;
}

export const cableApp: CableApp = {
  cable: undefined,
  network: undefined,
};

const { Provider } = createContext(cableApp.cable);

const getAuthParms = (auth: State["auth"]) => {
  if (auth.token && auth.client && auth.uid) {
    return new URLSearchParams({
      "access-token": auth.token,
      client: auth.client,
      uid: auth.uid,
    }).toString();
  }
  return undefined;
};

function actionCableDispatcher(dispatch: Dispatch<any>) {
  return {
    connected() {},
    disconnected() {},
    received(data: JsonApiResponse) {
      try {
        const type = (Array.isArray(data.data) ? data.data[0] : data.data).type;
        const message = jsonApi(data) as Array<any>;
        switch (type) {
          case "trailer_read_status":
          case "trailer": {
            for (const element of message) {
              const trailer = mapTrailer(element);
              // @ts-ignore
              delete trailer.position;
              // @ts-ignore
              delete trailer.permission;
              dispatch({
                type: TrailersActionTypes.fetchTrailersSuccess,
                payload: { order: [], entities: { [trailer.id]: trailer } },
              });
            }
            break;
          }
          case "trailer_event": {
            for (const element of message) {
              dispatch({
                type: TrailerEventsActionTypes.updateEvent,
                payload: element,
              });
            }
            /**
             * This re-fetches ALL types of events.
             * I've noticed that the CV events do not trigger this message on the socket?
             *
             * It would be a good idea to investigate WHY is that and send all events to UI
             */
            dispatch(fetchEvents(undefined));
            break;
          }
          case "trailer_sensor": {
            /**
             * FIXME use data from event instead of fetching from server again
             * Currently this event does not contain all the data, and a call to REST is used
             */
            dispatch(fetchSensors(message[0]["trailer_id"]));
            break;
          }
          case "trailer_media": {
            for (const element of message) {
              if (element.status === "completed") {
                dispatch({
                  type: MonitoringActionTypes.requestMediaSuccess,
                  payload: {
                    media: mapRawMedia(element),
                  },
                });
              }
            }
            break;
          }
          default: {
            // FIXME looks like it is devoted for a specific message type - but requires trailer_id element
            for (const element of message) {
              if (element.status === "alarm") {
                // TODO unclear purpose of this functionality
                dispatch(fetchEvents(undefined)); // undefined here stimulates ID of active trailer inside.
                dispatch(fetchRoutes(element["trailer_id"]));
                dispatch(fetchTrailers());
                break;
              }
            }
          }
        }
      } catch (err) {
        //FIXME properly handle error
        console.error(err);
      }
    },
  };
}

const ActionCableProvider: React.FC = ({ children }) => {
  const auth = useTypedSelector<AuthState>((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const credentials = getAuthParms(auth);
    let cable: Cable | undefined = undefined;
    if (credentials) {
      cable = actioncable.createConsumer(`${wsURL}&${credentials}`);
      const subscription = cable.subscriptions.create(
        channel,
        actionCableDispatcher(dispatch)
      );
      cableApp.network = subscription;
      cableApp.cable = cable;
    }

    return () => {
      if (cable) {
        cable.disconnect();
        delete cableApp.cable;
      }
    };
  }, [auth, dispatch]);

  return <Provider value={cableApp.cable}>{children}</Provider>;
};

export default ActionCableProvider;
