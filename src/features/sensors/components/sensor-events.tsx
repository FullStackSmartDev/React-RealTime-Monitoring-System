import { useTranslation } from "react-i18next";
import React from "react";

import { SensorEvent } from "../reducer";
import SensorEventsList from "./sensor-events-list";
import styled from "@ui/Theme";

interface SensorEventsProps {
  events: SensorEvent[];
  sensorId: string;
}

export default function SensorEvents(props: SensorEventsProps) {
  const { events, sensorId } = props;
  const { t } = useTranslation("sensors");

  return (
    <SensorEventsContainer>
      <HistoryHeadlineWrapper>
        <Headline>{t(`${sensorId}.history`)}</Headline>
      </HistoryHeadlineWrapper>
      <SensorEventsList events={events} sensorId={sensorId} />
    </SensorEventsContainer>
  );
}

const SensorEventsContainer = styled.div`
  width: 100%;
  max-height: 290px;
  display: flex;
  flex-direction: column;
`;

export const HeadlineWrapper = styled.div`
  padding-top: 15px;
  width: 100%;
  min-height: 65px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

const HistoryHeadlineWrapper = styled(HeadlineWrapper)`
  justify-content: space-between;
`;

export const Headline = styled.h5`
  margin-top: 0px;
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.25;
  display: inline-block;

  &::first-letter {
    text-transform: uppercase;
  }
`;
