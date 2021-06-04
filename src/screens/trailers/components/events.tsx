import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Container, Header, HeaderWrapper } from "./sensors";
import EventsList from "./events-list";
import Loading from "@common/loading";
import styled from "@ui/Theme";
import { TrailerEvent } from "@features/events/reducer";

interface EventsProps {
  loading: boolean;
  events: TrailerEvent[];
  error: Error | null;
  url: string;
  selectedTime: string;
  refreshList: () => void;
  showEventDetails: (event: TrailerEvent) => void;
}

function Events(props: EventsProps) {
  const {
    loading,
    events,
    selectedTime,
    error,
    url,
    refreshList,
    showEventDetails,
  } = props;
  const { t } = useTranslation("events");

  return (
    <EventsContainer>
      <HeaderWrapper>
        <Header>{t`history`}</Header>
        <DetailsLink to={`${url}/events/`}>{t`see_more`}</DetailsLink>
      </HeaderWrapper>
      <Loading loading={loading && events.length === 0} error={error}>
        <EventsList
          showEventDetails={showEventDetails}
          selectedTime={selectedTime}
          events={events}
          refreshList={refreshList}
        />
      </Loading>
    </EventsContainer>
  );
}

export default React.memo(Events);

const EventsContainer = styled(Container)`
  height: 290px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
`;

const DetailsLink = styled(Link)`
  margin-right: 15px;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 2.2px;
  text-align: center;
  color: #4390e5;
  text-align: right;
  text-transform: uppercase;
  text-decoration: none;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
`;
