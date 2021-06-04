import React, { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import Events from "./events";
import Location from "./location";
import Monitoring from "./monitoring";
import Sensors from "./sensors";
import styled from "@ui/Theme";
import { FullscreenIcon } from "@common/icons";
import { Link } from "react-router-dom";
import { MonitoringCameras } from "@features/monitoring/types";
import { MonitoringState } from "@features/monitoring/reducer";
import { SensorsState } from "@features/sensors/reducer";
import { State, useTypedSelector } from "@store/index";
import { Trailer } from "../reducer";
import { TrailerEventsState } from "@features/events/reducer";
import { fetchEvents } from "@features/events/actions";
import { selectCamera, selectTime } from "@features/monitoring/actions";
import { fetchSensors } from "@features/sensors/actions";
import { getSnapshotForTime } from "@features/monitoring/selectors";
import { removeSpecificEvents } from "@features/events/selectors";
import { getTrailerSensors } from "@features/sensors/selectors";
import { openModal } from "@ui/actions";
import { requestMedia } from "@features/monitoring/actions";
import { TrailerStates } from "../types";
import { ModalComponentTypes } from "@ui/reducer";
import { getError } from "../selectors";
import { TRAILER_EVENTS_UPDATE_INTERVAL } from "../../../config";

interface TrailerOverviewOwnProps {
  trailer: Trailer | null;
  url: string;
}

type Props = TrailerOverviewOwnProps;

function TrailerOverview({ trailer, url }: Props) {
  const dispatch = useDispatch();

  const error = useTypedSelector<Error | null>((state) => getError(state));
  const events = useTypedSelector<TrailerEventsState>((state) => state.events);
  const sensors = useTypedSelector<SensorsState>((state) => state.sensors);
  const monitoring = useTypedSelector<MonitoringState>(
    (state) => state.monitoring
  );
  const ui = monitoring.ui;
  const state = useSelector((state: State) => state);
  const trailerSensors = getTrailerSensors(state);
  const snapshot = getSnapshotForTime(state);
  const trailerEvents = filterEvents(state);

  const id = trailer?.id;
  useEffect(() => {
    let eventListener: number;
    if (!id) return;
    dispatch(fetchSensors(id));
    dispatch(fetchEvents(id));
    eventListener = setInterval(() => {
      dispatch(fetchEvents(id));
    }, TRAILER_EVENTS_UPDATE_INTERVAL * 1000);
    // actions.fetchMedia(id);

    return () => clearInterval(eventListener);
  }, [dispatch, id]);

  const refreshSensors = React.useCallback(() => {
    id && dispatch(fetchSensors(id));
  }, [id, dispatch]);

  const requestImage = (type: MonitoringCameras) => {
    id &&
      dispatch(
        requestMedia(id, {
          type: "photo",
          camera: type,
          time: new Date(ui.time),
        })
      );
  };

  const handleEventsDetail = React.useCallback(
    (event) => {
      if (
        event.type === TrailerStates.doorOpened ||
        event.type === TrailerStates.doorClosed
      ) {
        dispatch(selectCamera(MonitoringCameras.exterior));
      } else {
        dispatch(selectCamera(MonitoringCameras.interior));
      }
      dispatch(selectTime(moment(event.date).startOf("minute").toISOString()));
      dispatch(openModal(ModalComponentTypes.monitoring, {}));
    },
    [dispatch]
  );

  const handleEventsRefresh = React.useCallback(
    () => id && dispatch(fetchEvents(id)),
    [id, dispatch]
  );

  const fullScreenHandler = React.useMemo(() => {
    return (
      <Fullscreen to={"/map"}>
        <FullscreenIcon
          wrapperSize={40}
          active
          iconSize={30}
          color={"black"}
          backgroundColor={"transparent"}
        />
      </Fullscreen>
    );
  }, []);

  return (
    <>
      <Sensors
        sensors={trailerSensors}
        loading={sensors.loading || false}
        error={sensors.error}
        refreshSensors={refreshSensors}
        url={url}
      />
      <Row>
        <Monitoring
          snapshot={snapshot}
          cameraSettings={trailer?.cameraSettings}
          selectCamera={(type: MonitoringCameras) =>
            dispatch(selectCamera(type))
          }
          openModal={(
            type: ModalComponentTypes,
            data: ActionProp<typeof openModal>
          ) => dispatch(openModal(type, data))}
          requestImage={requestImage}
          currentTime={ui.time}
          setCurrentTime={() => {
            dispatch(
              selectTime(moment().startOf("minute").toISOString(), true)
            );
          }}
          selectTime={(date: string) => dispatch(selectTime(date))}
        />
        <Column>
          <Location
            trailer={trailer}
            error={error}
            loading={!trailer || !trailer.position}
          >
            {fullScreenHandler}
          </Location>
          <Events
            // FIXME: refactor to combine with DetailedEventsList (with almost the same functionality)
            showEventDetails={handleEventsDetail}
            selectedTime={ui.time}
            events={trailerEvents}
            loading={events.loading || false}
            error={events.error}
            url={url}
            refreshList={handleEventsRefresh}
          />
        </Column>
      </Row>
    </>
  );
}

const filterEvents = removeSpecificEvents([
  TrailerStates.off,
  TrailerStates.silenced,
  TrailerStates.resolved,
]);

export default TrailerOverview;

const Fullscreen = styled(Link)`
  background: none white;
  padding: 0;
  position: absolute;
  user-select: none;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  top: 10px;
  right: 10px;
  height: 40px;
  width: 40px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 812px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 123;
`;
