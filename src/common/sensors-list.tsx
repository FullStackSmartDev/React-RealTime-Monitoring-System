import React from "react";
import { useTranslation } from "react-i18next";

import { SensorEntry } from "@features/sensors/reducer";
import styled from "@ui/Theme";
import Sensor from "@features/sensors/components/sensor";

interface Props {
  sensors: SensorEntry | null;
  url: string;
}

function SensorsList({ sensors, url }: Props) {
  const { t } = useTranslation();

  const sensorsList = (sensors: SensorEntry, url: string) => {
    return Object.keys(sensors)
      .sort()
      .filter((s) => {
        return ["carbonDioxideLevel", "tabletBattery"].indexOf(s) === -1;
      })
      .map((key) => {
        const sensor = sensors[key as keyof typeof sensors];
        if (sensor)
          return <Sensor key={sensor.type} entity={sensor} url={url} />;
        return null;
      });
  };

  const list = sensors ? sensorsList(sensors, url) : null;

  if (!list || !list.length) {
    return <NoSensors>{t`no_data`}</NoSensors>;
  }

  return <SensorsWrapper>{list}</SensorsWrapper>;
}

export default React.memo(SensorsList);

const SensorsWrapper = styled.div`
  padding-bottom: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  @media screen and (max-width: 812px) {
    flex-wrap: wrap;
  }
`;

const NoSensors = styled.div`
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
