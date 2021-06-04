import styled from "@ui/Theme";

import { MonitoringCameras } from "@features/monitoring/types";

export interface SideSensors {
  alerts: MonitoringCameras[] | string[];
}

export const AlertBoxes = styled.div<SideSensors>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  &:before {
    content: "";
    display: block;
    position: relative;
    transform: translateX(-50%);
  }
  &:after {
    content: "";
    display: block;
    position: relative;
    transform: translateX(-50%);
  }
`;

const alertFor = (side: MonitoringCameras) => (props: SideSensors) =>
  props.alerts.includes(side) ? "red" : "green";

export const SideSensors = styled(AlertBoxes)`
  &:before {
    border-left: solid 2px ${alertFor(MonitoringCameras.leftTop)};
    border-right: solid 2px ${alertFor(MonitoringCameras.rightTop)};
    top: 200px;
    bottom: 200px;
    left: 50%;
    width: 70px;
    height: 80px;
  }
  &:after {
    border-left: solid 2px ${alertFor(MonitoringCameras.leftBottom)};
    border-right: solid 2px ${alertFor(MonitoringCameras.rightBottom)};
    top: 220px;
    bottom: 200px;
    left: 50%;
    width: 70px;
    height: 80px;
  }
`;

export const InteriorSensors = styled(AlertBoxes)`
  &:before {
    border-top: solid 2px ${alertFor(MonitoringCameras.interior)};
    border-bottom: solid 2px ${alertFor(MonitoringCameras.interior)};
    top: 210px;
    bottom: 200px;
    left: 50%;
    width: 60px;
    height: 55px;
  }
  &:after {
    border-top: solid 2px ${alertFor(MonitoringCameras.exterior)};
    border-bottom: solid 2px ${alertFor(MonitoringCameras.exterior)};
    top: 250px;
    bottom: 200px;
    left: 50%;
    width: 60px;
    height: 55px;
  }
`;
