import React from "react";
import { useTranslation } from "react-i18next";

import { getSensorUnit, Sensor as SensorData, SensorStates } from "../reducer";

import SensorChart from "@common/sensor-chart";

interface SensorProps {
  entity: SensorData;
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

function useChartOption(sensor: SensorData) {
  const { t } = useTranslation();
  return {
    unit: _getSensorUnit(sensor),
    defaultLabel: `${t`no_data`}`,
    color: getSensorColor(sensor),
  };
}

export default function DetailedChart(props: SensorProps) {
  const sensor = props.entity;
  const chartOptions = useChartOption(sensor);

  return <SensorChart size={350} sensor={sensor} chartOptions={chartOptions} />;
}
