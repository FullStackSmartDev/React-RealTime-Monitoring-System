import React from "react";

import styled from "@ui/Theme";
import { truck } from "@assets/index";
import { useTranslation } from "react-i18next";
import { CameraSetting, MonitoringCameras } from "../types";
import { State } from "@store/index";
import { getActiveTrailer } from "@screens/trailers/selectors";
import { useSelector } from "react-redux";

interface Props {
  picked?: MonitoringCameras;
  cameraSettings?: { [key in MonitoringCameras]: CameraSetting } | null;
  onChange?: (camera: MonitoringCameras) => void;
}

function CameraPicker({ picked, onChange }: Props) {
  const cameraSettings = useSelector(
    (state: State) => getActiveTrailer(state)?.cameraSettings
  );
  const { t } = useTranslation("monitoring");

  const renderRadio = (
    camera: MonitoringCameras,
    cameraSettings:
      | { [key in MonitoringCameras]: CameraSetting }
      | null
      | undefined
  ) => (
    <Radio
      onChange={() => {
        if (onChange) onChange(camera);
      }}
      checked={picked === camera}
      active={Boolean(
        cameraSettings !== undefined &&
          cameraSettings &&
          cameraSettings[camera].installedAt !== null
      )}
    />
  );

  return (
    <>
      <Header>{t`choose_camera`}</Header>
      <CameraPickerFrame>
        <Top>
          {renderRadio(MonitoringCameras.leftTop, cameraSettings)}
          {renderRadio(MonitoringCameras.interior, cameraSettings)}
          {renderRadio(MonitoringCameras.rightTop, cameraSettings)}
        </Top>
        <Bottom>
          {renderRadio(MonitoringCameras.leftBottom, cameraSettings)}
          {renderRadio(MonitoringCameras.exterior, cameraSettings)}
          {renderRadio(MonitoringCameras.rightBottom, cameraSettings)}
        </Bottom>
      </CameraPickerFrame>
    </>
  );
}

const Radio = ({
  checked,
  onChange,
  active,
}: {
  checked: boolean;
  onChange: () => void;
  active: boolean;
}) => (
  <RadioLabel>
    <RadioInput checked={checked} onChange={onChange} active={active} />
    <RadioIcon active={active} />
  </RadioLabel>
);

export default CameraPicker;

const Header = styled.div`
  height: 44px;
  width: 145px;
  font-size: 12px;
  color: #4a4a4a;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f6f8;
  text-transform: capitalize;
`;

const Top = styled.div`
  display: flex;
  flex: 1;
  width: 75%;
  margin: 0 auto;
`;
const Bottom = styled(Top)``;

const RadioContainer = styled.label`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
  &:nth-of-type(2) {
    padding-top: 60px;
  }
`;

const CameraPickerFrame = styled.div`
  width: 145px;
  height: 220px;
  border-radius: 4px;
  background-color: #f4f6f8;
  display: flex;
  flex-direction: column;
  background-image: url("${truck}");
  background-position: center 10%;
  background-size: auto 85%;
  background-repeat: no-repeat;
`;

const RadioLabel = styled(RadioContainer)`
  cursor: pointer;
  position: relative;
  & :checked + :before {
    position: relative;
    display: block;
    top: 1px;
    left: 1px;
    content: "";
    width: 14px;
    border-radius: 50%;
    height: 14px;
    background-color: #4a90e2;
  }
`;

export interface RadioProps {
  active: boolean;
}

const RadioInput = styled.input.attrs((props: RadioProps) => ({
  type: "radio",
  name: "camera",
  disabled: !props.active,
}))<RadioProps>`
  display: none;
`;

const RadioIcon = styled.div<RadioProps>`
  display: block;
  width: 20px;
  height: 20px;
  border: solid 2px ${(props) => (props.active ? "#4a90e2" : "#9b9b9b")};
  background-color: ${(props) => (props.active ? "#f4f6f8" : "#bbbbbb")};
  border-radius: 50%;
`;
