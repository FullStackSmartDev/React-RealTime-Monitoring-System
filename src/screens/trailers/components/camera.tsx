import React from "react";

import styled from "@ui/Theme";
import {
  MonitoringCamera,
  MonitoringCameras,
  CameraSetting,
} from "@features/monitoring/types";

import Spinner from "@common/spinner";
import {
  PreviewDetails,
  Container as PreviewDetailsContainer,
} from "./preview-details";
import PreviewImage from "./preview-image";

export interface CameraProps {
  camera?: MonitoringCamera;
  setting?: CameraSetting;
  onClick: () => void;
}

export function Camera({ camera, setting, onClick }: CameraProps) {
  const shouldRenderDetails =
    camera &&
    camera.type !== MonitoringCameras.interior &&
    camera.type !== MonitoringCameras.exterior;

  return (
    <CameraContainer camera={camera} onClick={onClick}>
      {camera && !camera.isLoading && (
        <>
          <PreviewImage
            setting={setting}
            src={camera.snapshotUrl}
            alert={camera.alarm}
            shouldRenderDetails={shouldRenderDetails}
            camera={camera}
          />
          {shouldRenderDetails && (
            <PreviewDetails
              eventDate={camera.eventDate}
              downloadDate={camera.downloadDate}
            />
          )}
        </>
      )}
      {camera && camera.isLoading && <Spinner wrapperHeight={"140px"} />}
      {!camera && <PreviewImage shouldRenderDetails={false} />}
    </CameraContainer>
  );
}

export const CameraContainer = styled.div<{ camera?: MonitoringCamera }>`
  margin: 5px 10px;
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  border: 2px solid
    ${({ camera }) => (camera && camera.alarm ? "red" : "white")};
  &:hover ${PreviewDetailsContainer} {
    display: ${({ camera }) =>
      camera && camera.downloadDate ? "block" : "none"};
  }
  cursor: pointer;
`;
