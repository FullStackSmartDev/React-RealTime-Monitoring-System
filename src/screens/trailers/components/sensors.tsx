import React from "react";
import { useTranslation } from "react-i18next";

import Loading from "@common/loading";
import RefreshButton from "@common/refresh-button";
import { SensorEntry } from "@features/sensors/reducer";
import SensorsList from "@common/sensors-list";
import styled from "@ui/Theme";

interface SensorsProps {
  sensors: SensorEntry | null;
  loading: boolean;
  url: string;
  error: Error | null;
  refreshSensors: () => void;
}

function Sensors({
  sensors,
  loading,
  error,
  refreshSensors,
  url,
}: SensorsProps) {
  const { t } = useTranslation("sensors");
  return (
    <Container>
      <HeaderWrapper>
        <Header>{t`data`}</Header>
        <RefreshButton loading={loading} onClick={refreshSensors} />
      </HeaderWrapper>
      <Loading loading={loading && sensors === null} error={error}>
        <SensorsList sensors={sensors} url={url} />
      </Loading>
    </Container>
  );
}

export default React.memo(Sensors);

export const Container = styled.div`
  margin: 8px;
  min-height: 255px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
`;

export const HeaderWrapper = styled.div`
  min-height: 65px;
  padding-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  & > * {
    flex: 1;
  }
`;

export const Header = styled.h5`
  margin-top: 0;
  margin-bottom: 25px;
  margin-left: 15px;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.25;

  &::first-letter {
    text-transform: uppercase;
  }
`;
