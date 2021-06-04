import React from "react";
import { Link } from "react-router-dom";
import { lighten, darken } from "polished";
import moment from "moment";
import { useTranslation } from "react-i18next";

import styled from "@ui/Theme";
import { Trailer, TrailerId } from "@screens/trailers/reducer";
import { SternKraftColours, TrailerStates } from "@screens/trailers/types";
import Tooltip from "react-tooltip-lite";
import {
  ClockIcon,
  EngineIcon,
  EngineOffOutlineIcon,
  SignalCellular3Icon,
  SignalCellularOutlineIcon,
} from "./icons";

interface TrailerProps {
  trailer: Trailer;
  selected: boolean;
  onClick: (id: TrailerId) => void;
  url: string;
  compressed?: boolean;
}

interface PropertyProps {
  name: string;
  value?: number | string;
  className?: string;
}

interface StateProps {
  state?: TrailerStates;
  children: string;
}

interface ContainerProps {
  state?: TrailerStates;
  selected: boolean;
}

const iconStyle = {
  display: "inline-flex",
  verticalAlign: "sub",
  position: "absolute",
  left: "0px",
  top: "50%",
  transform: "translateY(-50%)",
};

function TrailerRow(props: TrailerProps) {
  const { selected, onClick, trailer, url, compressed } = props;

  const { t } = useTranslation(["trailers"]);
  let trailer_note: string;
  trailer_note = trailer && trailer.note ? trailer.note : "";
  const max_size = 35;

  function noteText() {
    const note_size = trailer_note.length;
    if (note_size < max_size) {
      return trailer_note;
    } else {
      return trailer_note.substring(0, max_size) + ". . .";
    }
  }
  /* const location =
    trailer.position &&
    (trailer.position.name
      ? trailer.position.name
      : `${(trailer.position.lng || 0).toFixed(3)} ${(trailer.position.lat || 0).toFixed(3)}`); */

  return (
    <Container
      to={url.replace(":id", trailer.id)}
      selected={selected}
      state={trailer.state}
      onClick={() => onClick(trailer.id)}
      compressed={compressed}
    >
      <Header>{trailer.plateNumber}</Header>

      <Tooltip
        content={<div style={{ width: "450x" }}>{trailer_note}</div>}
        background="black"
        color="white"
      >
        <Note>{noteText()}</Note>
      </Tooltip>
      <Meta compressed={compressed}>
        <Row>
          <Col>{trailer.name}</Col>
          <Col style={{ flex: 1, alignItems: "flex-end" }}>
            <LastUpdated
              title={`${t`last_login`} - ${moment(trailer.lastLogin).format(
                "LT L"
              )}`}
            >
              <ClockIcon
                color={"#808080"}
                active={true}
                wrapperSize={24}
                iconSize={16}
                style={iconStyle}
              />{" "}
              {moment(trailer.lastLogin).fromNow()}
            </LastUpdated>
          </Col>
        </Row>

        <IconRow>
          {trailer.engine_running ? (
            <EngineIcon
              color={"#ffffff"}
              backgroundColor={SternKraftColours.STERNKRAFT_GREEN}
              active={true}
              wrapperSize={24}
              iconSize={16}
            />
          ) : (
            <EngineOffOutlineIcon
              color={SternKraftColours.STERNKRAFT_RED}
              backgroundColor={SternKraftColours.STERNKRAFT_YELLOW}
              active={true}
              wrapperSize={24}
              iconSize={16}
            />
          )}
          {trailer.network_available ? (
            <SignalCellular3Icon
              color={"#ffffff"}
              backgroundColor={SternKraftColours.STERNKRAFT_GREEN}
              active={true}
              wrapperSize={24}
              iconSize={16}
            />
          ) : (
            <SignalCellularOutlineIcon
              color={"#ffffff"}
              backgroundColor={SternKraftColours.STERNKRAFT_RED}
              active={true}
              wrapperSize={24}
              iconSize={16}
            />
          )}
          {trailer.state && (
            <State state={trailer.state}>
              {t(
                trailer.state === TrailerStates.resolved
                  ? TrailerStates.ok
                  : trailer.state
              )}
            </State>
          )}
        </IconRow>
      </Meta>
    </Container>
  );
}

export default React.memo(TrailerRow);

const borders: { [key in TrailerStates]: string } = {
  [TrailerStates.startLoading]: "#ebf3fd",

  [TrailerStates.alarm]: "#d0021b",
  [TrailerStates.quiet]: "#d0021b",
  [TrailerStates.emergency]: "#d0021b",

  [TrailerStates.armed]: "#ebf3fd",

  [TrailerStates.warning]: "#ebf3fd",

  [TrailerStates.off]: "#ebf3fd",

  [TrailerStates.truckDisconnected]: "#d0021b",
  [TrailerStates.truckConnected]: "#ebf3fd",
  [TrailerStates.shutdownPending]: "#ebf3fd",
  [TrailerStates.shutdownImmediate]: "#d0021b",
  [TrailerStates.truckBatteryLow]: "#d0021b",
  [TrailerStates.truckBatteryNormal]: "#ebf3fd",
  [TrailerStates.truckEngineOff]: "#ebf3fd",
  [TrailerStates.truckEngineOn]: "#ebf3fd",
  [TrailerStates.truckParkingOff]: "#ebf3fd",
  [TrailerStates.truckParkingOn]: "#ebf3fd",

  [TrailerStates.motionDetected]: SternKraftColours.STERNKRAFT_RED,
  [TrailerStates.motionCleared]: SternKraftColours.STERNKRAFT_YELLOW,
  [TrailerStates.humanDetected]: SternKraftColours.STERNKRAFT_RED,
  [TrailerStates.humanCleared]: SternKraftColours.STERNKRAFT_YELLOW,
  [TrailerStates.doorOpened]: SternKraftColours.STERNKRAFT_RED,
  [TrailerStates.doorClosed]: SternKraftColours.STERNKRAFT_WHITE,
  [TrailerStates.jammingDetected]: SternKraftColours.STERNKRAFT_RED,
  [TrailerStates.jammingOff]: SternKraftColours.STERNKRAFT_YELLOW,

  [TrailerStates.systemTurnedOn]: SternKraftColours.STERNKRAFT_WHITE,

  [TrailerStates.endLoading]: "#ebf3fd",
  [TrailerStates.silenced]: "#ebf3fd",
  [TrailerStates.resolved]: "#ebf3fd",
  [TrailerStates.disarmed]: "#ebf3fd",
  [TrailerStates.ok]: "#ebf3fd",
  [TrailerStates.unknown]: "#ebf3fd",

  [TrailerStates.networkOff]: SternKraftColours.STERNKRAFT_RED, // TODO(bartosz-szczecinski) add colors
  [TrailerStates.networkOn]: "#ebf3fd",
  [TrailerStates.gpsSignalLost]: "#ebf3fd",
};

const stateColors: { [key in TrailerStates]: string } = {
  [TrailerStates.startLoading]: "#606fff",

  [TrailerStates.alarm]: "#d0021b",
  [TrailerStates.quiet]: "#d0021b",
  [TrailerStates.emergency]: "#d0021b",

  [TrailerStates.armed]: "#5fa80f",

  [TrailerStates.warning]: "#d0021b",

  [TrailerStates.truckDisconnected]: "#d0021b",
  [TrailerStates.truckConnected]: "#a0a0a0",
  [TrailerStates.shutdownPending]: "#ffd700",
  [TrailerStates.shutdownImmediate]: "#d0021b",
  [TrailerStates.truckBatteryLow]: "#ffd700",
  [TrailerStates.truckBatteryNormal]: "#a0a0a0",
  [TrailerStates.truckEngineOff]: "#a0a0a0",
  [TrailerStates.truckEngineOn]: "#a0a0a0",
  [TrailerStates.truckParkingOff]: "#2d30da",
  [TrailerStates.truckParkingOn]: "#2d30da",

  [TrailerStates.motionDetected]: SternKraftColours.STERNKRAFT_RED,
  [TrailerStates.motionCleared]: SternKraftColours.STERNKRAFT_YELLOW,
  [TrailerStates.humanDetected]: SternKraftColours.STERNKRAFT_RED,
  [TrailerStates.humanCleared]: SternKraftColours.STERNKRAFT_YELLOW,
  [TrailerStates.doorOpened]: SternKraftColours.STERNKRAFT_RED,
  [TrailerStates.doorClosed]: SternKraftColours.STERNKRAFT_GREY,
  [TrailerStates.jammingDetected]: SternKraftColours.STERNKRAFT_RED,
  [TrailerStates.jammingOff]: SternKraftColours.STERNKRAFT_YELLOW,

  [TrailerStates.systemTurnedOn]: SternKraftColours.STERNKRAFT_GREY,

  [TrailerStates.off]: "#a0a0a0",
  [TrailerStates.endLoading]: "#606fff",
  [TrailerStates.silenced]: "#a0a0a0",
  [TrailerStates.resolved]: "#a0a0a0",
  [TrailerStates.disarmed]: "#5fa80f",
  [TrailerStates.ok]: "#a0a0a0",
  [TrailerStates.unknown]: "#a0a0a0",

  [TrailerStates.networkOn]: "#a0a0a0", // TODO(bartosz-szczecinski) Add colors
  [TrailerStates.networkOff]: SternKraftColours.STERNKRAFT_RED,
  [TrailerStates.gpsSignalLost]: "#a0a0a0",
};

const backgrounds: { [key in TrailerStates]: string } = {
  [TrailerStates.startLoading]: "#ebf3fd",

  [TrailerStates.alarm]: "#ebf3fd",
  [TrailerStates.quiet]: "#ebf3fd",
  [TrailerStates.emergency]: "#ebf3fd",

  [TrailerStates.armed]: "#ebf3fd",

  [TrailerStates.warning]: "#ebf3fd",

  [TrailerStates.truckDisconnected]: "#ebf3fd",
  [TrailerStates.truckConnected]: "#ebf3fd",
  [TrailerStates.shutdownPending]: "#ebf3fd",
  [TrailerStates.shutdownImmediate]: "#ebf3fd",
  [TrailerStates.truckBatteryLow]: "#ebf3fd",
  [TrailerStates.truckBatteryNormal]: "#ebf3fd",
  [TrailerStates.truckEngineOff]: "#ebf3fd",
  [TrailerStates.truckEngineOn]: "#ebf3fd",
  [TrailerStates.truckParkingOff]: "#ebf3fd",
  [TrailerStates.truckParkingOn]: "#ebf3fd",

  [TrailerStates.motionDetected]: SternKraftColours.STERNKRAFT_WHITE,
  [TrailerStates.motionCleared]: SternKraftColours.STERNKRAFT_WHITE,
  [TrailerStates.humanDetected]: SternKraftColours.STERNKRAFT_WHITE,
  [TrailerStates.humanCleared]: SternKraftColours.STERNKRAFT_WHITE,
  [TrailerStates.doorOpened]: SternKraftColours.STERNKRAFT_WHITE,
  [TrailerStates.doorClosed]: SternKraftColours.STERNKRAFT_WHITE,
  [TrailerStates.jammingDetected]: SternKraftColours.STERNKRAFT_WHITE,
  [TrailerStates.jammingOff]: SternKraftColours.STERNKRAFT_WHITE,

  [TrailerStates.systemTurnedOn]: SternKraftColours.STERNKRAFT_WHITE,

  [TrailerStates.off]: "#ebf3fd",
  [TrailerStates.endLoading]: "#ebf3fd",
  [TrailerStates.silenced]: "#ebf3fd",
  [TrailerStates.resolved]: "#ebf3fd",
  [TrailerStates.disarmed]: "#ebf3fd",
  [TrailerStates.ok]: "#ebf3fd",
  [TrailerStates.unknown]: "#ebf3fd",

  [TrailerStates.networkOff]: "#ebf3fd", // TODO(bartosz-szczecinski) Add colors
  [TrailerStates.networkOn]: SternKraftColours.STERNKRAFT_WHITE,
  [TrailerStates.gpsSignalLost]: "#ebf3fd",
};

function backgroundColor(props: ContainerProps) {
  const { selected, state = TrailerStates.unknown } = props;
  const modifier = selected ? 0 : 0.1;
  const color = backgrounds[state];
  return lighten(modifier, color);
}

function borderColor(props: ContainerProps) {
  const { selected, state = TrailerStates.unknown } = props;
  const modifier =
    selected &&
    !(state === TrailerStates.alarm) &&
    !(state === TrailerStates.quiet) &&
    !(state === TrailerStates.emergency)
      ? 0.5
      : -0.1;
  const color = borders[state];
  return `10px solid ${darken(modifier, color)}`;
}

function stateColor({ state = TrailerStates.unknown }: StateProps) {
  return stateColors[state];
}

const Meta = styled.div<{ compressed: boolean }>`
  ${({ compressed }) =>
    compressed &&
    `
    display: flex;
    justify-content: space-between
  `}
`;

const LastUpdated = styled.div`
  display: inline-flex;
  position: relative;
  padding-left: 22px;
  margin-left: 10px;
`;

const IconRow = styled.div`
  display: flex;
  margin-top: 3px;
  font-size: 12px;

  & > * {
    margin-right: 2px;
  }
`;

export const Header = styled.h5`
  margin: 0 0 3px 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 18px;
  color: #000000;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Container = styled(Link)<ContainerProps & { compressed: boolean }>`
  padding: 10px 10px 5px 10px;
  display: block;
  position: relative;
  text-decoration: none;
  background-color: ${backgroundColor};
  border-left: ${borderColor};
  border-top: 1px solid silver;
  user-select: none;
  cursor: pointer;
  font-size: 12px;
  color: inherit;
  &:last-of-type {
    border-bottom: 1px solid silver;
  }

  ${({ compressed }) =>
    compressed &&
    `
      @media screen and (min-width: 812px) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        ${IconRow} {
          margin-top: 0;
          margin-left: 10px;
        }

        ${Header} {
          line-height: inherit;
        }
      }
      @media screen and (max-width: 812px) {
        ${Meta} {
          display: none
        }
      }
    `}
`;

const State = styled.div<StateProps>`
  color: ${stateColor};
  font-size: 12px;
  line-height: 15px;
  align-self: center;

  position: relative;
  padding-left: 20px;

  display: flex;
  justify-content: flex-end;
  flex: 1;

  &:before {
    content: "⬤";
    font-size: 10px;
    line-height: 15px;
    margin-right: 5px;
    color: ${stateColor};
  }

  &::first-letter {
    text-transform: capitalize;
  }
`;

const Label = styled.div`
  margin: 2px 0;
  font-size: 12px;
  line-height: 15px;
`;

const Caption = styled.div`
  color: #808080;
  overflow: hidden;
  display: inline-block;
  &::first-letter {
    text-transform: capitalize;
  }
`;

const Value = styled.div`
  color: #000000;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 50%;
  display: inline-block;
`;

const Note = styled.div`
  margin: 2px 0px 5px 0px;
  font-size: 12px;
  line-height: 15px;
  color: #00008b;
  border-bottom: solid 1px lightgrey;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

export const Property = ({ name, value = "---", className }: PropertyProps) => {
  return (
    <Label className={className}>
      <Caption>{name}:</Caption> <Value>{value}</Value>
    </Label>
  );
};
