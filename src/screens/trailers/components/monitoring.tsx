import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { Camera, CameraContainer } from "./camera";
import { Container, Header, HeaderWrapper } from "./sensors";
import { InteriorSensors, SideSensors } from "./alert-boxes";
import { ModalComponentTypes } from "@ui/reducer";
import {
  MonitoringCamera,
  MonitoringCameras,
  CameraSetting,
} from "@features/monitoring/types";
import { openModal } from "@ui/actions";
import Pickers from "@features/monitoring/components/pickers";
import { selectCamera, selectTime } from "@features/monitoring/actions";
import styled from "@ui/Theme";
import { truck } from "@assets/index";

interface Props {
  snapshot: { [key in MonitoringCameras]: MonitoringCamera };
  cameraSettings?: { [key in MonitoringCameras]: CameraSetting };
  requestImage: (camera: MonitoringCameras) => void;
  openModal: ActionProp<typeof openModal>;
  selectCamera: ActionProp<typeof selectCamera>;
  currentTime: string;
  setCurrentTime: () => void;
  selectTime: ActionProp<typeof selectTime>;
}

export default function Monitoring({
  snapshot,
  cameraSettings,
  requestImage,
  openModal,
  selectCamera,
  currentTime,
  setCurrentTime,
  selectTime,
}: Props) {
  const { t } = useTranslation("monitoring");

  const datetime = moment(currentTime).startOf("minute").toDate();

  const RenderedCamera = ({ type }: { type: MonitoringCameras }) => (
    <Camera
      camera={snapshot[type]}
      setting={cameraSettings?.[type]}
      onClick={() => {
        if (cameraSettings?.[type].installedAt) {
          selectCamera(type);
          openModal(ModalComponentTypes.monitoring, {});
        } else {
          // Does nothing, ignoring the click on uninstalled camera
        }
      }}
    />
  );

  const alerts = Object.entries(snapshot).reduce<string[]>(
    (acc, [key, value]) => (value.alarm ? [...acc, key] : acc),
    []
  );

  return (
    <MonitoringContainer>
      <MonitoringHeader>{t`monitoring`}</MonitoringHeader>
      <MonitoringHeaderWrapper>
        <Pickers
          date={datetime}
          onChange={(date: Date) => {
            selectTime(date.toISOString());
          }}
          setCurrentTime={setCurrentTime}
        />
      </MonitoringHeaderWrapper>
      <Cameras>
        <CameraGroup>
          <RenderedCamera type={MonitoringCameras.leftTop} />
          <RenderedCamera type={MonitoringCameras.leftBottom} />
        </CameraGroup>
        <MiddleCameraGroup>
          <RenderedCamera type={MonitoringCameras.interior} />
          <RenderedCamera type={MonitoringCameras.exterior} />
        </MiddleCameraGroup>
        <CameraGroup>
          <RenderedCamera type={MonitoringCameras.rightTop} />
          <RenderedCamera type={MonitoringCameras.rightBottom} />
        </CameraGroup>
      </Cameras>
      <SideSensors alerts={alerts} />
      <InteriorSensors alerts={alerts} />
    </MonitoringContainer>
  );
}

const MonitoringContainer = styled(Container)`
  padding: 0 15px 10px;
  height: 550px;
  position: relative;
  background: #ffffff url(${truck}) center 120px no-repeat;
  background-size: 80px 270px;

  @media screen and (min-width: 812px) {
    min-width: 435px;
  }
`;

const MonitoringHeader = styled(Header)`
  padding-top: 15px;
  margin-bottom: 0;
`;

const MonitoringHeaderWrapper = styled(HeaderWrapper)``;

const CameraGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  &:first-of-type {
    margin: 15px 0 25px 5px;
  }

  &:last-of-type {
    margin: 15px 5px 25px 0;
  }
`;

export const MiddleCameraGroup = styled(CameraGroup)`
  ${CameraContainer} {
    margin: 0 auto;
  }

  ${CameraContainer}:first-of-type {
    width: 70px;
    max-height: 80px;
    top: 95px;
  }

  ${CameraContainer}:last-of-type {
    width: 70px;
    max-height: 110px;
    top: 210px;
  }
`;

const Cameras = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;
