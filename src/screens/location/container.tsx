import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment, { Moment, now } from "moment";

import styled from "@ui/Theme";

import { State, useTypedSelector } from "@store/index";

import { Trailer, TrailerId } from "@screens/trailers/reducer";
import { fetchRoutes } from "@features/routes/actions";
import { filterTrailers, fetchTrailers } from "@screens/trailers/actions";
import { getRoutePoints, isRouteLoading } from "@features/routes/selectors";
import { selectTrailer } from "@screens/trailers/actions";
import {
  setFilterValue,
  setMaxDateValue,
  setMinDateValue,
  fetchEvents,
  resetFilters,
} from "@features/events/actions";
import {
  getAlarmEvents,
  getArmedEvents,
  getLoadingEvents,
  getWarningEvents,
  getNormalEvents,
  getParkingEvents,
  getRecognitionEvents,
  extractTrailerEvents,
} from "@features/events/selectors";
import { openModal } from "@ui/actions";
import { selectTime, selectCamera } from "@features/monitoring/actions";

import ClearSearch from "./components/clear-search";
import EventFilters from "@common/event-filters";
import MapPanel from "@common/map-panel";
import RedirectToTrailer from "@common/redirect-to-trailer";
import Spinner from "@common/spinner";
import TrailersList from "@common/trailers-list";
import { RouteComponentProps } from "react-router-dom";
import { TrailerStates } from "@screens/trailers/types";
import { getFilteredTrailersInOrder } from "@screens/trailers/selectors";
import { MonitoringCameras } from "@features/monitoring/types";
import { ModalComponentTypes } from "@ui/reducer";
import { Container } from "@ui/container";

export type Props = RouteComponentProps<{ id: TrailerId }>;

function LocationRoute(props: Props) {
  const { match } = props;

  const state = useSelector<State>((state) => state) as State;
  const trailers = useTypedSelector<Trailer[]>(getFilteredTrailersInOrder);
  const alarmEvents = getAlarmEvents(state);
  const armedEvents = getArmedEvents(state);
  const loadingEvents = getLoadingEvents(state);
  const warningEvents = getWarningEvents(state);
  const normalEvents = getNormalEvents(state);
  const parkingEvents = getParkingEvents(state);
  const recognitionEvents = getRecognitionEvents(state);
  const allEvents = extractTrailerEvents(state);
  const events = state.events;
  const routes = getRoutePoints(state);
  const routeLoading = isRouteLoading(state);

  const dispatch = useDispatch();

  const hasTrailers = trailers.length !== 0;
  useEffect(() => {
    if (!hasTrailers) {
      dispatch(fetchTrailers());
    }
  }, [hasTrailers, dispatch, match.path]);

  const trailer = useTypedSelector<Trailer | null>((state) => {
    const trailer = state.trailers.entities[match.params.id];
    if (!trailer?.permission) return null;
    return trailer;
  });
  const id = match.params.id;
  const query = useTypedSelector<string>((state) => state.trailers.query);

  useEffect(() => {
    dispatch(selectTrailer(id));
    if (id) {
      dispatch(
        fetchEvents(id, {
          from: events.minDate,
          to: events.maxDate,
          kinds: events.filters,
        })
      );
      dispatch(fetchRoutes(id, { from: events.minDate, to: events.maxDate }));
    }
  }, [id, events.filters, events.minDate, events.maxDate, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch]);

  const { t } = useTranslation();

  const points = trailer ? [trailer] : [];

  const handleTrailerChange = React.useCallback(
    (id: TrailerId | null) => dispatch(selectTrailer(id)),
    [dispatch]
  );

  const handleFilterChange = React.useCallback(
    (filter: TrailerStates, value: boolean) =>
      dispatch(setFilterValue(filter, value)),
    [dispatch]
  );

  const handleMinDateChange = React.useCallback(
    (date: Date | Moment) => dispatch(setMinDateValue(date)),
    [dispatch]
  );

  const handleMaxDateChange = React.useCallback(
    (date: Date | Moment) => dispatch(setMaxDateValue(date)),
    [dispatch]
  );

  return (
    <Container>
      <RedirectToTrailer active={id} trailers={trailers}>
        <TrailersList
          path={match.path}
          selected={id}
          trailers={trailers}
          onTrailerClick={handleTrailerChange}
        />
        <MapPanel
          selectedTrailer={id}
          trailers={points}
          loadingEvents={loadingEvents}
          alarmEvents={alarmEvents}
          armedEvents={armedEvents}
          warningEvents={warningEvents}
          normalEvents={normalEvents}
          parkingEvents={parkingEvents}
          recognitionEvents={recognitionEvents}
          allEvents={allEvents}
          routes={routes}
          containerElement={<FullscreenMap />}
          mapElement={<FullscreenElement style={{ position: "absolute" }} />}
          showEventDetails={(event) => {
            if (
              event.type === TrailerStates.doorOpened ||
              event.type === TrailerStates.doorClosed
            ) {
              dispatch(selectCamera(MonitoringCameras.exterior));
            } else {
              dispatch(selectCamera(MonitoringCameras.interior));
            }
            dispatch(
              selectTime(moment(event.date).startOf("minute").toISOString())
            );
            dispatch(openModal(ModalComponentTypes.monitoring, {}));
          }}
          t={t}
          onMarkerClick={(time) => {
            dispatch(selectCamera(MonitoringCameras.interior));
            dispatch(
              selectTime(
                moment(time ? time : now())
                  .startOf("minute")
                  .toISOString()
              )
            );
            dispatch(openModal(ModalComponentTypes.monitoring, {}));
          }}
        >
          {routeLoading && <RouteLoading />}
        </MapPanel>
        <EventFilters
          description={`${t`filters`}:`}
          container={MapFiltersContainer}
          filters={events.filters}
          minDate={events.minDate}
          maxDate={events.maxDate}
          onFilterChange={handleFilterChange}
          onMinDateChange={handleMinDateChange}
          onMaxDateChange={handleMaxDateChange}
        />
        {query && <ClearSearch onClick={() => dispatch(filterTrailers(""))} />}
      </RedirectToTrailer>
    </Container>
  );
}

export default LocationRoute;

const RouteLoading = () => (
  <LoadingContainer>
    <Spinner wrapperHeight={100} wrapperWidth={100} spinnerSize={100} />
  </LoadingContainer>
);

const LoadingContainer = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  top: 50%;
  left: calc(50% + 280px / 2);
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 20px;
`;

const FullscreenElement = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 80px);
  max-width: calc(100vw - 280px);
`;

const FullscreenMap = styled.div`
  width: 100%;
  & > * > :nth-child(2),
  & > * > :nth-child(3) {
    display: none !important;
  }
`;

const MapFiltersContainer = styled.div`
  padding: 0 20px;
  width: 900px;
  height: 50px;
  position: absolute;
  top: 20px;
  left: calc(50vw + 280px / 2);
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
`;
