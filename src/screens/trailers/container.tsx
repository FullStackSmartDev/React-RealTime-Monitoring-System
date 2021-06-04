import React, { useEffect } from "react";
import moment from "moment";
import { RouteComponentProps, Route, Switch } from "react-router";
import { useDispatch } from "react-redux";

import DetailedSensor from "@features/sensors/container";
import Events from "@features/events/container";
import Header from "./components/header";
import RedirectToTrailer from "@common/redirect-to-trailer";
import TrailerOverview from "./components/overview";
import TrailersList from "@common/trailers-list";
import styled from "@ui/Theme";
import { ModalComponentTypes } from "@ui/reducer";
import { useTypedSelector } from "@store/index";
import { TrailerId, Trailer } from "./reducer";
import { TrailerStates } from "./types";
import {
  fetchTrailers,
  selectTrailer,
  setTrailerState,
  readTrailerState,
  updateTrailerNote,
} from "./actions";
import { getFilteredTrailersInOrder } from "./selectors";
import { openModal } from "@ui/actions";
import { selectTime } from "@features/monitoring/actions";
import { Container } from "@ui/container";

export interface ArmModalProps {
  trailer: Trailer;
  getArmedStatus: (trailer: Trailer) => TrailerStates;
  setTrailerState: (id: TrailerId, status: TrailerStates) => void;
}

export interface AlarmModalProps {
  trailer: Trailer;
  getAlertStatus: (trailer: Trailer) => TrailerStates;
  setTrailerState: (id: TrailerId, status: TrailerStates) => void;
}

type Props = RouteComponentProps<{ id: TrailerId }>;

function TrailerRoute(props: Props) {
  const dispatch = useDispatch();

  const trailers = useTypedSelector<Trailer[]>(getFilteredTrailersInOrder);
  // const shouldRefreshTimer = useTypedSelector<boolean>(
  //   (state) => state.monitoring.ui.isNow
  // );
  const { match } = props;

  const hasTrailers = trailers.length !== 0;
  useEffect(() => {
    if (!hasTrailers) {
      dispatch(fetchTrailers());
    }
  }, [match.path, dispatch, hasTrailers]);

  const trailer = useTypedSelector<Trailer | null>((state) => {
    const trailer = state.trailers.entities[match.params.id];
    if (!trailer?.permission) return null;
    return trailer;
  });

  const id = match.params.id;
  useEffect(() => {
    dispatch(selectTrailer(id));
  }, [dispatch, id]);

  const handleTrailerChange = React.useCallback(
    (trailerId) => {
      dispatch(selectTime(moment().startOf("minute").toISOString(), true));
      dispatch(selectTrailer(trailerId));
    },
    [dispatch]
  );

  const handleReachTrailerState = React.useCallback(
    (id: string) => dispatch(readTrailerState(id)),
    [dispatch]
  );

  return (
    <Container>
      <TrailersList
        path={match.path}
        selected={id}
        trailers={trailers}
        onTrailerClick={handleTrailerChange}
      />
      <TrailerDataWrapper>
        <Header
          match={match}
          trailer={trailer}
          setTrailerState={(id: string, status: TrailerStates) =>
            dispatch(setTrailerState(id, status))
          }
          readTrailerState={handleReachTrailerState}
          openArmModal={(modalProps: ArmModalProps) =>
            dispatch(
              openModal(ModalComponentTypes.armAlert, {
                armModalProps: modalProps,
              })
            )
          }
          openAlarmModal={(modalProps: AlarmModalProps) => {
            dispatch(
              openModal(ModalComponentTypes.alarmAlert, {
                alarmModalProps: modalProps,
              })
            );
          }}
          updateTrailerNote={(id: string, note: string) =>
            dispatch(updateTrailerNote(id, note))
          }
        />
        <Switch>
          <Route
            path={`${match.path}/events/:eventId?`}
            render={() => <Events trailer={trailer} />}
          />
          <Route
            path={`${match.path}/sensors/:sensorId`}
            render={({ match }) => <DetailedSensor match={match} />}
          />
          <RedirectToTrailer active={id} trailers={trailers}>
            <TrailerOverview trailer={trailer} url={match.url} />
          </RedirectToTrailer>
        </Switch>
      </TrailerDataWrapper>
    </Container>
  );
}

export default TrailerRoute;

const TrailerDataWrapper = styled.div`
  padding: 8px;
  overflow: auto;
  flex: 1;
  background-color: #f4f6f8;
`;
