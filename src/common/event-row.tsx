import React from "react";
import moment from "moment";

import PersonCheck from "./person-check";
import ResolveAlarmButton from "@common/resolve-alarm-button";
import styled from "@ui/Theme/index";
import { AlarmAction, Logistician } from "@features/events/types";
import { CalendarBlankOutlineIcon } from "@common/icons";
import { TrailerStates } from "@screens/trailers/types";

interface EventRowProps {
  id?: string;
  type: TrailerStates;
  name: string;
  color: string;
  logistician?: Logistician;
  interactions: AlarmAction[];
  date: Date;
  refreshList: () => void;
}

export default function EventRow({
  id,
  type,
  name,
  color,
  logistician,
  refreshList,
  interactions,
  date,
}: EventRowProps) {
  return (
    <EventItem>
      <ItemName color={color}>{name}</ItemName>
      {id && (
        <ResolveAlarmButton
          id={id}
          type={type}
          interactions={interactions}
          onClick={refreshList}
        />
      )}
      {interactions.map((interaction, index) => (
        <PersonCheck
          key={index}
          date={interaction.date}
          logistician={interaction.logistician}
          type={interaction.type}
        />
      ))}
      {logistician && <PersonCheck logistician={logistician} />}
      <CalendarIcon />
      <ItemDetail>
        <ItemDate>{moment(date).format("LT L")}</ItemDate>
      </ItemDetail>
    </EventItem>
  );
}

const CalendarIcon = () => (
  <CalendarBlankOutlineIcon
    wrapperSize={25}
    iconSize={22}
    color={"#4a4a4a"}
    backgroundColor={"transparent"}
    active={false}
  />
);

const EventItem = styled.div`
  padding: 15px 25px 10px 45px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border: 0;
  border-top: 1px solid #c0c0c0;

  &:last-of-type {
    border-bottom: 1px solid #c0c0c0;
  }
`;

const ItemName = styled.span<{ color: string }>`
  position: relative;
  display: flex;
  flex: 1;
  font-size: 14px;
  line-height: 18px;
  color: ${({ color }) => color || "#d0021b"};
  text-decoration: none;
  background: "#ffffff";
  border: 0;
  cursor: pointer;

  &:first-letter {
    text-transform: uppercase;
  }

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
`;

const ItemDetail = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const ItemDate = styled.span`
  margin-left: 5px;
  font-size: 14px;
  line-height: 18px;
  color: #4a4a4a;
  text-align: left;
`;
