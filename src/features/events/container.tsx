import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";

import DetailedEventsList from "./components/detailed-events-list";
import EventFilters from "@common/event-filters";
import styled from "@ui/Theme";
import {
  fetchEvents,
  resetFilters,
  setFilterValue,
  setMaxDateValue,
  setMinDateValue,
} from "./actions";
import { openModal } from "@ui/actions";
import { State, useTypedSelector } from "@store/index";
import { TrailerEventsState } from "./reducer";
import { Trailer } from "@screens/trailers/reducer";
import { removeSpecificEvents } from "@features/events/selectors";
import { TrailerStates } from "@screens/trailers/types";
import { selectCamera, selectTime } from "@features/monitoring/actions";
import { MonitoringCameras } from "@features/monitoring/types";
import { ModalComponentTypes } from "@ui/reducer";

interface EventsRouteOwnProps {
  trailer: Trailer | null;
}

function EventsRoute({ trailer }: EventsRouteOwnProps) {
  const events = useTypedSelector<TrailerEventsState>((state) => state.events);
  const trailerEvents = useSelector((state: State) => filterEvents(state));
  const dispatch = useDispatch();

  const refreshList = React.useCallback(
    (trailer: Trailer | null) => {
      if (!trailer) {
        return;
      }
      dispatch(
        fetchEvents(trailer.id, {
          from: events.minDate,
          to: events.maxDate,
          kinds: events.filters,
        })
      );
    },
    [dispatch, events.filters, events.maxDate, events.minDate]
  );

  const trailerId = trailer && trailer.id;
  useEffect(() => {
    refreshList(trailer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.minDate, events.maxDate, events.filters, refreshList, trailerId]);

  useEffect(() => {
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch]);

  const { t } = useTranslation();

  const handleFilterChange = React.useCallback(
    (filter: TrailerStates, value: boolean) =>
      dispatch(setFilterValue(filter, value)),
    [dispatch]
  );

  const handleMinDateChange = React.useCallback(
    (date: Date | moment.Moment) => dispatch(setMinDateValue(date)),
    [dispatch]
  );

  const handleMaxDateChange = React.useCallback(
    (date: Date | moment.Moment) => dispatch(setMaxDateValue(date)),
    [dispatch]
  );

  const handleEventDetails = React.useCallback(
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

  const handleEventsRefresh = React.useCallback(() => refreshList(trailer), [
    refreshList,
    trailer,
  ]);

  return (
    <DetailedHistoryList>
      <EventFilters
        description={`${t`show_only`}:`}
        container={FiltersContainer}
        filters={events.filters}
        minDate={events.minDate}
        maxDate={events.maxDate}
        onFilterChange={handleFilterChange}
        onMinDateChange={handleMinDateChange}
        onMaxDateChange={handleMaxDateChange}
      />
      <DetailedEventsList
        trailerEvents={trailerEvents}
        refreshList={handleEventsRefresh}
        showEventDetails={handleEventDetails}
      />
      {/* <NextPageButton>Pobierz więcej</NextPageButton> */}
    </DetailedHistoryList>
  );
}

const filterEvents = removeSpecificEvents([
  TrailerStates.off,
  TrailerStates.silenced,
  TrailerStates.resolved,
]);

export default EventsRoute;

const DetailedHistoryList = styled.div`
  position: relative;
  margin: 8px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
`;

const FiltersContainer = styled.div`
  margin: 25px auto 30px;
  padding: 0 20px;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

// const NextPageButton = styled.button`
//   margin: 25px auto;
//   width: 150px;
//   height: 36px;
//   font-size: 14px;
//   line-height: 1.5;
//   letter-spacing: normal;
//   text-align: center;
//   color: #ffffff;
//   background-color: #4a90e2;
//   border-radius: 4px;
// `;
