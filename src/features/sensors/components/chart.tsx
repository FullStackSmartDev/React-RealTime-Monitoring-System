import React from "react";
import { useTranslation } from "react-i18next";

import camelToSnake from "@utils/camel-to-snake";
import DetailedChart from "./detailed-chart";
import { HeadlineWrapper, Headline } from "./sensor-events";
import RefreshButton from "@common/refresh-button";
import styled from "@ui/Theme";
import {
  Sensor as SensorData,
  SensorsState,
  SensorSettings,
  SensorTypes,
  fromApiPropertyName,
} from "../reducer";
import { TrailerId } from "@screens/trailers/reducer";

interface ChartProps {
  sensors: SensorsState;
  id: string;
  sensor?: SensorData;
  settings?: SensorSettings;
  fetchSensors: (id: TrailerId) => void;
}

export default function Chart({
  sensors,
  id,
  sensor,
  settings,
  fetchSensors,
}: ChartProps) {
  const { t } = useTranslation("sensors");

  const snakecased = settings && camelToSnake(settings.sensorType);
  const isDataTransfer =
    fromApiPropertyName(snakecased) === SensorTypes.dataTransfer;

  return (
    <ChartContainer>
      {isDataTransfer && (
        <ChartHeadlineWrapper>
          <Headline>{t`remaining_data_transfer`}</Headline>
        </ChartHeadlineWrapper>
      )}
      {sensor && <DetailedChart entity={sensor} />}
      <RefreshButton
        loading={sensors.loading || false}
        detailed={true}
        onClick={() => fetchSensors(id)}
      />
    </ChartContainer>
  );
}

const ChartContainer = styled.div`
  max-width: 100%;
  min-height: 430px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const ChartHeadlineWrapper = styled(HeadlineWrapper)`
  justify-content: center;
`;
