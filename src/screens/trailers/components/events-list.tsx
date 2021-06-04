import React from "react";
import { useTranslation } from "react-i18next";

import EventRow from "@common/event-row";
import styled from "@ui/Theme/index";
import { TrailerEvent } from "@features/events/reducer";
import { TrailerStatesHelper } from "../types";

interface EventsListProps {
  events: TrailerEvent[];
  selectedTime: string;
  showEventDetails: (event: TrailerEvent) => void;
  refreshList: () => void;
}

export default function EventsList(props: EventsListProps) {
  const { events, selectedTime, showEventDetails, refreshList } = props;
  const { t } = useTranslation();

  if (!events || !events.length) {
    return <NoHistory>{t`no_data`}</NoHistory>;
  }

  return (
    <HistoryList>
      {events.map((event) => {
        const { id, type, date, interactions, logistician } = event;
        const color = TrailerStatesHelper.toColor(type);
        const name = t(TrailerStatesHelper.toReadableName(type));
        const isSelected = selectedTime === date.toISOString();
        return (
          <ClickableRow
            selected={isSelected}
            key={event.id}
            onClick={() => showEventDetails(event)}
          >
            <EventRow
              key={id}
              id={id}
              type={type}
              name={name}
              color={color}
              logistician={logistician}
              interactions={interactions}
              date={date}
              refreshList={refreshList}
            />
          </ClickableRow>
        );
      })}
    </HistoryList>
  );
}

const ClickableRow = styled.div<{ selected: boolean }>`
  margin: 0;
  padding: 0;
  width: 100%;
  height: auto;
  border: 0;
  outline: none;
  & > * {
    background: ${({ selected }) =>
      selected ? "#f0f0f0 !important" : "white"};
  }
`;

const NoHistory = styled.div`
  max-width: 100%;
  max-height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.25;
  color: #a0a0a0;
  letter-spacing: 1.6px;
`;

const HistoryList = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
`;
