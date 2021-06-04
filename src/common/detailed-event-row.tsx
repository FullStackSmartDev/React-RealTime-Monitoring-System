import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PersonCheck from "./person-check";
import ResolveAlarmButton from "./resolve-alarm-button";
import styled from "@ui/Theme/index";
import { AlarmAction } from "@features/events/types";
import { CalendarBlankOutlineIcon } from "@common/icons";
import { TrailerEvent } from "@features/events/reducer";
import { TrailerStatesHelper } from "@screens/trailers/types";

export interface DetailedEventRowProps {
  event: TrailerEvent;
  interactions: AlarmAction[];
  showEventDetails: (event: TrailerEvent) => void;
  refreshList: () => void;
}

function DetailedEventRow({
  event,
  interactions,
  refreshList,
  showEventDetails,
}: DetailedEventRowProps) {
  const { t } = useTranslation();

  const onClick = () => {
    showEventDetails(event);
  };

  return (
    <EventContainer>
      <EventHeader>
        <HistoryName
          to="#"
          onClick={onClick}
          color={TrailerStatesHelper.toColor(event.type)}
        >
          {t(TrailerStatesHelper.toReadableName(event.type))}
        </HistoryName>
        <ResolveAlarmButton
          id={event.id}
          type={event.type}
          interactions={event.interactions}
          onClick={refreshList}
        />
        {interactions.map((interaction, index) => (
          <PersonCheck
            key={index}
            date={interaction.date}
            logistician={interaction.logistician}
            type={interaction.type}
          />
        ))}
        {event.logistician && <PersonCheck logistician={event.logistician} />}
        {event.location && event.location.name && (
          <Location>{event.location.name}</Location>
        )}
        <CalendarBlankOutlineIcon
          wrapperSize={25}
          iconSize={22}
          color={"#4a4a4a"}
          backgroundColor={"#ffffff"}
          active={false}
        />
        <DateTime>{moment(event.date).format("LT, L")}</DateTime>{" "}
      </EventHeader>
    </EventContainer>
  );
}

export default React.memo(DetailedEventRow);

const EventListItemTitle = styled(Link)<{ color: string }>`
  position: relative;
  font-size: 14px;
  line-height: 18px;
  color: ${({ color }) => color || "#d0021b"};
  text-decoration: none;
  cursor: pointer;

  &:before {
    content: "⬤";
    position: absolute;
    top: 50%;
    left: -25px;
    transform: translateY(-50%);
    font-size: 14px;
    line-height: 18px;
    color: ${({ color }) => color || "#d0021b"};
  }

  text-transform: capitalize;
  display: flex;
  flex: 1;
`;

const HistoryName = styled(EventListItemTitle)`
  margin-left: 50px;
  font-size: 14px;
  flex: auto;
`;

const Location = styled.div`
  margin-left: 50px;
  margin-right: 15px;
  color: #4a4a4a;
  font-size: 14px;
  position: relative;
  &:before {
    content: "";
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border-bottom-left-radius: 0;
    border: solid 2px #4a4a4a;
    position: absolute;
    left: -35px;
    transform: rotate(-45deg);
    top: -4px;
  }
  &:after {
    content: "";
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    border: solid 2px #4a4a4a;
    position: absolute;
    left: -28px;
    top: 2px;
  }
`;

const DateTime = styled(Location)`
  margin-left: 0;
  &:before,
  &:after {
    display: none;
  }
`;

const EventHeader = styled.div`
  height: 45px;
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: -1px;
  align-items: center;
`;

const EventContainer = styled.div`
  height: 45px;
  border-bottom: solid 1px #d8d8d8;
  border-top: solid 1px #d8d8d8;
`;
