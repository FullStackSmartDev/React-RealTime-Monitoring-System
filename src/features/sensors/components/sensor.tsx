import React from "react";
import { useTranslation } from "react-i18next";

import camelToSnake from "@utils/camel-to-snake";
import SensorChart from "@common/sensor-chart";
import SeeMore from "@common/see-more";
import styled from "@ui/Theme";
import {
  getSensorUnit,
  Sensor as SensorData,
  SensorStates,
  toReadableName,
} from "../reducer";

interface SensorProps {
  entity: SensorData;
  url: string;
}

export default function Sensor(props: SensorProps) {
  const { entity: sensor, url } = props;

  const chartOptions = useChartOptions(sensor);

  const { t } = useTranslation();

  return (
    <Container>
      <SensorChart size={120} sensor={sensor} chartOptions={chartOptions} />
      <SensorName>{t(toReadableName(sensor.type))}</SensorName>
      <SeeMore
        to={`${url}/sensors/${camelToSnake(sensor.type)}`}
      >{t`see_more`}</SeeMore>
    </Container>
  );
}

const sensorColors = {
  [SensorStates.ok]: "#7ed321",
  [SensorStates.warning]: "#dccd0a",
  [SensorStates.alarm]: "#d0021b",
};

function getSensorColor(sensor: SensorData) {
  const { status } = sensor;
  const color = sensorColors[status];
  return color;
}

function _getSensorUnit(sensor: SensorData) {
  return `${getSensorUnit(sensor.type)}`;
}

function useChartOptions(sensor: SensorData) {
  const { t } = useTranslation();
  return {
    unit: _getSensorUnit(sensor),
    defaultLabel: `${t`no_data`}`,
    color: getSensorColor(sensor),
    status: sensor.status,
  };
}

const Container = styled.div`
  min-width: 140px;
  width: 16.66%;
  max-width: 180px;
  height: 175px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  svg {
    display: block;
  }
`;

const SensorName = styled.div`
  height: 36px;
  font-size: 14px;
  line-height: 1.3;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  &::first-letter {
    text-transform: uppercase;
  }
`;
