import React, { useState, useEffect } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

import styled from "@ui/Theme/";
import { Sensor, getSensorUnit } from "../reducer";
import camelToSnake from "@utils/camel-to-snake";
import { TRAILER_SENSOR_REFRESH } from "../../../config";

interface DataProps {
  sensor: Sensor;
}

export default function Stats(props: DataProps) {
  const { sensor } = props;

  const [fromNow, setFromNow] = useState(moment(sensor.latestReadAt).fromNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setFromNow(moment(sensor.latestReadAt).fromNow());
    }, TRAILER_SENSOR_REFRESH * 1000);
    return () => clearInterval(interval);
  });

  const sensorUnit = getSensorUnit(sensor.type);
  const type = camelToSnake(sensor.type);

  const { t } = useTranslation("sensors");

  return (
    <SensorData>
      <DataHeadline>{t`data`}</DataHeadline>
      <DataContent>
        <DataLabel>{t`last_login`}</DataLabel>
        <DataValue>{fromNow}</DataValue>
      </DataContent>
      <DataContent>
        <DataLabel>{`${t(`${type}.average`)}:`}</DataLabel>
        <DataValue>
          {sensor.averageValue !== null
            ? `${sensor.averageValue} ${sensorUnit}`
            : t`no_data`}
        </DataValue>
      </DataContent>
      <DataContent>
        <DataLabel>{t(`${type}.last`)}</DataLabel>
        <DataValue>
          {sensor.value !== null ? `${sensor.value} ${sensorUnit}` : t`no_data`}
        </DataValue>
      </DataContent>
    </SensorData>
  );
}

const SensorData = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const DataHeadline = styled.h5`
  display: inline-block;
  &::first-letter {
    text-transform: uppercase;
  }
  margin-top: 40px;
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.25;
  flex: 100%;
`;

const DataContent = styled.div`
  margin-bottom: 25px;
  flex: 50% 0 1;
`;

const DataLabel = styled.div`
  font-size: 14px;
  color: #9b9b9b;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const DataValue = styled.div`
  font-size: 14px;
  color: #4a4a4a;
`;
