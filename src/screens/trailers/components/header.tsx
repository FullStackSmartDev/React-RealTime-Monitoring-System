import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AlarmModalProps, ArmModalProps } from "../container";
import {
  ChevronRightIcon,
  EngineIcon,
  SignalCellular3Icon,
  SignalCellular1Icon,
  SignalCellular2Icon,
  SignalCellularOutlineIcon,
  EngineOffOutlineIcon,
  SignalOffIcon,
  HomeCircleIcon,
  EarthIcon, TruckIcon,
} from "@common/icons";
import { isSensorType, toReadableName } from "@features/sensors/reducer";
import snakeToCamel from "@utils/snake-to-camel";
import styled from "@ui/Theme";
import { Trailer, TrailerId } from "../reducer";
import { SternKraftColours, TrailerStates } from "../types";
import { uestars } from "@assets/index";
import Tooltip from "react-tooltip-lite";
import moment from "moment";
import {
  TRAILER_MINIMUM_SPEED,
  TRAILER_NETWORK_AVIBILITY_UI_UPDATE,
  TRAILER_POSITION_WARNING_DELAY,
  TRAILER_SEEN_WARNING_DELAY,
  TRAILER_STATE_UPDATE_INTERVAL,
} from "../../../config";

interface HeaderProps {
  match: RouteComponentProps<{ id: string }>["match"];
  trailer: Trailer | null;
  setTrailerState: (id: TrailerId, status: TrailerStates) => void;
  readTrailerState: (id: TrailerId) => void;
  openArmModal: (armModalProps: ArmModalProps) => void;
  openAlarmModal: (alarmModalProps: AlarmModalProps) => void;
  updateTrailerNote: (id: string, note: string) => void;
}
interface AlertButtonProps {
  trailer: Trailer;
  setTrailerState: (id: TrailerId, status: TrailerStates) => void;
  openAlarmModal?: (alarmModalProps: AlarmModalProps) => void;
  alarmControlAllowed?: boolean;
}
interface StatusButtonProps extends AlertButtonProps {
  openArmModal: (armModalProps: ArmModalProps) => void;
}
interface LinkProps {
  trailer: Trailer | null;
  url: string;
}
interface IconProps {
  trailer: Trailer | null;
}
interface ReadProps {
  trailer: Trailer | null;
  readTrailerState: (id: TrailerId) => void;
  render: () => React.ReactElement | null;
}
interface NeutralButtonProps {
  children?: boolean | JSX.Element;
  active: boolean;
  text: string;
  onClick: () => void;
}
interface ContextButtonProps {
  text: string;
  onClick: () => void;
}

interface NoteProps {
  trailer: Trailer;
  updateTrailerNote: (id: string, note: string) => void;
}

export default function Header({
  match,
  trailer,
  setTrailerState,
  readTrailerState,
  openArmModal,
  openAlarmModal,
}: HeaderProps) {
  return (
    //         <CompanyLink trailer={trailer} />  removed for the presentation purposes.
    <VContainer>
      <Container>
        <CarNumberLink trailer={trailer || undefined} />
      </Container>
      <Container>
        <RefreshContainer
          trailer={trailer}
          readTrailerState={readTrailerState}
          render={() =>
            trailer && (
              <Container>
                <CarEngineRunning trailer={trailer} />
                <CarNetworkAvailable trailer={trailer} />
              </Container>
            )
          }
        />
        <Switch>
          <Route path={`${match.path}/events`} component={EventsBreadcrumb} />
          <Route
            path={`${match.path}/sensors/:sensorId`}
            component={SensorsBreadcrumb}
          />
          <Route
            path={`${match.path}/`}
            render={() =>
              trailer && (
                <TrailersContent
                  trailer={trailer}
                  setTrailerState={setTrailerState}
                  openAlarmModal={openAlarmModal}
                  openArmModal={openArmModal}
                />
              )
            }
          />
        </Switch>
      </Container>
    </VContainer>
  );
}

const CarNumberLink: React.FC<{ trailer?: Trailer }> = ({ trailer }) => {
  const plateNumber = trailer && trailer.plateNumber ? trailer.plateNumber : "";

  return (
    <CarNumber>
      <CountryCode>
        <FlagWrapper>
          <Flag src={uestars} />
        </FlagWrapper>
        <Country>EU</Country>
      </CountryCode>
      <Number>{plateNumber}</Number>
    </CarNumber>
  );
};

function RefreshContainer({ trailer, readTrailerState, render }: ReadProps) {
  const id = trailer?.id;
  React.useEffect(() => {
    let iconUpdater: number;
    if (id && readTrailerState) {
      iconUpdater = setInterval(() => {
        readTrailerState(id);
      }, TRAILER_STATE_UPDATE_INTERVAL * 1000);
    }
    return () => clearInterval(iconUpdater);
  }, [id, readTrailerState]);

  return (
    <Container trailer={trailer}>
      <CarTruckConnected trailer={trailer} />
      <CarEngineRunning trailer={trailer} />
      <CarNetworkAvailable trailer={trailer} />
    </Container>
  );
}

/*
  DISABLED until devices are upgraded to the last HW version.

function CarHorn({ trailer }: IconProps) {
  const hornStatus = trailer && trailer.horn;

  switch (hornStatus) {
    case -1:
      return (
        <PictoWrapper>
          <HornIcon
            color={"#ffffff"}
            backgroundColor={SternKraftColours.STERNKRAFT_RED}
            active={true}
            wrapperSize={35}
            iconSize={20}
          />
        </PictoWrapper>
      );
    case -2:
      return (
        <PictoWrapper>
          <HornIcon
            color={"#ffffff"}
            backgroundColor={SternKraftColours.STERNKRAFT_GREY}
            active={true}
            wrapperSize={35}
            iconSize={20}
          />
        </PictoWrapper>
      );
    case 0:
      return (
        <PictoWrapper>
          <HornIcon
            color={SternKraftColours.STERNKRAFT_RED}
            backgroundColor={SternKraftColours.STERNKRAFT_YELLOW}
            active={true}
            wrapperSize={35}
            iconSize={20}
          />
        </PictoWrapper>
      );
    default:
      return <></>;
  }
} */


function CarTruckConnected({ trailer }: IconProps) {
  const networkAvailable = trailer && trailer.network_available;
  const truckConnected = trailer && trailer.status_flag && trailer.status_flag?.truck === 'truck_connected';

  if (truckConnected && networkAvailable)
    return (
      <PictoWrapper>
        <TruckIcon
          color={"#ffffff"}
          backgroundColor={SternKraftColours.STERNKRAFT_GREEN}
          active={true}
          wrapperSize={35}
          iconSize={20}
        />
      </PictoWrapper>
    );
  else
    return (
      <PictoWrapper>
        <TruckIcon
          color={SternKraftColours.STERNKRAFT_RED}
          backgroundColor={SternKraftColours.STERNKRAFT_YELLOW}
          active={true}
          wrapperSize={35}
          iconSize={20}
        />
      </PictoWrapper>
    );

}

function CarEngineRunning({ trailer }: IconProps) {
  const engineRunning = trailer && trailer.engine_running;

  if (engineRunning)
    return (
        <PictoWrapper>
          <EngineIcon
              color={"#ffffff"}
              backgroundColor={SternKraftColours.STERNKRAFT_GREEN}
              active={true}
              wrapperSize={35}
              iconSize={20}
          />
        </PictoWrapper>
    );
  else
    return (
        <PictoWrapper>
          <EngineOffOutlineIcon
              color={SternKraftColours.STERNKRAFT_RED}
              backgroundColor={SternKraftColours.STERNKRAFT_YELLOW}
              active={true}
              wrapperSize={35}
              iconSize={20}
          />
        </PictoWrapper>
    );
}

function CarNetworkAvailable({ trailer }: IconProps) {
  // Refresh the component every 10 seconds
  const [, forceRefresh] = React.useState(0);
  React.useEffect(() => {
    const refresh = setInterval(
      () => forceRefresh((v) => v + 1),
      TRAILER_NETWORK_AVIBILITY_UI_UPDATE * 1000
    );
    return () => clearInterval(refresh);
  }, []);

  const networkAvailable = trailer && trailer.network_available;
  const networkLevel = Boolean(trailer?.position?.signal)
    ? (trailer?.position?.signal as number)
    : 25;
  const networkRoamingStr = String(trailer?.position?.roaming);
  const networkRoaming =
    networkRoamingStr === "roaming_on" ||
    networkRoamingStr === "roaming_reading_error";

  const lastPositionInfo = moment().diff(
    trailer?.position?.date,
    "milliseconds"
  );
  const lastSpeed = trailer?.position?.speed;

  const positionOnParking =
    (trailer?.state === TrailerStates.truckParkingOn ||
      (lastSpeed && lastSpeed < TRAILER_MINIMUM_SPEED)) &&
    networkAvailable;
  const lastSeenWarningParking =
    (trailer?.state === TrailerStates.truckParkingOn ||
      (lastSpeed && lastSpeed < TRAILER_MINIMUM_SPEED)) &&
    (lastPositionInfo > TRAILER_POSITION_WARNING_DELAY * 1000 ||
      !lastPositionInfo) &&
    !networkAvailable;
  const lastSeenWarning =
    lastSpeed &&
    lastSpeed >= 5 &&
    (lastPositionInfo > TRAILER_SEEN_WARNING_DELAY * 1000 || !lastPositionInfo);

  const { t } = useTranslation();

  if (networkAvailable)
    return (
      // -70dBm or higher >= 22 // -85dBm or higher >= 14 // -99dBm or higher >= 7
      <PictoMessageWrapper>
        {networkLevel >= 22 && (
          <Tooltip content={t`signal_excellent`} direction={"down"}>
            <SignalCellular3Icon
              color={"#ffffff"}
              backgroundColor={SternKraftColours.STERNKRAFT_GREEN}
              active={true}
              wrapperSize={35}
              iconSize={20}
            />
          </Tooltip>
        )}
        {networkLevel >= 14 && networkLevel < 22 && (
          <Tooltip content={t`signal_good`} direction={"down"}>
            <SignalCellular2Icon
              color={"#ffffff"}
              backgroundColor={"#60681e"}
              active={true}
              wrapperSize={35}
              iconSize={20}
            />
          </Tooltip>
        )}
        {networkLevel >= 7 && networkLevel < 14 && (
          <Tooltip content={t`signal_poor`} direction={"down"}>
            <SignalCellular1Icon
              color={"#ffffff"}
              backgroundColor={"#787223"}
              active={true}
              wrapperSize={35}
              iconSize={20}
            />
          </Tooltip>
        )}
        {networkLevel < 7 && (
          <Tooltip content={t`signal_marginal`} direction={"down"}>
            <SignalCellularOutlineIcon
              color={"#ffffff"}
              backgroundColor={SternKraftColours.STERNKRAFT_RED}
              active={true}
              wrapperSize={35}
              iconSize={20}
            />
          </Tooltip>
        )}
        {networkRoaming && (
          <Tooltip content={t`network_roaming`} direction={"down"}>
            <EarthIcon
              color={"#ffffff"}
              backgroundColor={SternKraftColours.STERNKRAFT_GREEN}
              active={true}
              wrapperSize={35}
              iconSize={20}
            />
          </Tooltip>
        )}
        {!networkRoaming && (
          <Tooltip content={t`network_home`} direction={"down"}>
            <HomeCircleIcon
              color={"#ffffff"}
              backgroundColor={SternKraftColours.STERNKRAFT_GREY}
              active={true}
              wrapperSize={35}
              iconSize={20}
            />
          </Tooltip>
        )}
        {networkLevel < 14 && <InfoWarning>{t`network_slow`}</InfoWarning>}
        {positionOnParking && <InfoOk>{t`gps_parking_ok`}</InfoOk>}
        {lastSeenWarning && <InfoWarning>{t`gps_last_seen`}</InfoWarning>}
      </PictoMessageWrapper>
    );
  else
    return (
      <PictoMessageWrapper>
        <Tooltip content={t`signal_none`} direction={"down"}>
          <SignalOffIcon
            color={SternKraftColours.STERNKRAFT_RED}
            backgroundColor={SternKraftColours.STERNKRAFT_YELLOW}
            active={true}
            wrapperSize={35}
            iconSize={20}
          />
        </Tooltip>
        <Tooltip content={t`network_unknown`} direction={"down"}>
          <EarthIcon
            color={SternKraftColours.STERNKRAFT_RED}
            backgroundColor={SternKraftColours.STERNKRAFT_YELLOW}
            active={true}
            wrapperSize={35}
            iconSize={20}
          />
        </Tooltip>
        <InfoNotActual>
          {t`info_inactual`} {moment(trailer?.lastLogin).format("LT L")}
        </InfoNotActual>
        {lastSeenWarningParking && (
          <InfoWarning>{t`gps_last_seen_parking`}</InfoWarning>
        )}
      </PictoMessageWrapper>
    );
}

function getState(
  trailer: Trailer,
  state: TrailerStates,
  setTo: TrailerStates = TrailerStates.ok
) {
  return trailer.state === state ? setTo : state;
}

function getPossibleNextState(
  state: TrailerStates | undefined = undefined
): TrailerStates[] {
  const stateMap: Partial<Record<TrailerStates, TrailerStates[]>> = {
    [TrailerStates.startLoading]: [
      TrailerStates.armed,
      TrailerStates.endLoading,
      TrailerStates.alarm,
    ],
    [TrailerStates.endLoading]: [
      TrailerStates.armed,
      TrailerStates.startLoading,
      TrailerStates.alarm,
    ],
    [TrailerStates.alarm]: [
      TrailerStates.emergency,
      TrailerStates.silenced,
      TrailerStates.resolved,
    ],
    [TrailerStates.silenced]: [TrailerStates.alarm, TrailerStates.resolved],
    [TrailerStates.off]: [
      TrailerStates.armed,
      TrailerStates.startLoading,
      TrailerStates.alarm,
    ],
    [TrailerStates.armed]: [
      TrailerStates.disarmed,
      TrailerStates.startLoading,
      TrailerStates.alarm,
    ],
    [TrailerStates.disarmed]: [
      TrailerStates.armed,
      TrailerStates.startLoading,
      TrailerStates.alarm,
    ],
    [TrailerStates.quiet]: [TrailerStates.alarm, TrailerStates.resolved],
    [TrailerStates.emergency]: [TrailerStates.silenced, TrailerStates.resolved],
  };

  if (state !== undefined && stateMap[state])
    return stateMap[state] as TrailerStates[];

  return [TrailerStates.armed, TrailerStates.startLoading, TrailerStates.alarm];
}

function TrailersContent({
  trailer,
  setTrailerState,
  openAlarmModal,
  openArmModal,
}: StatusButtonProps) {
  const alarmControlAllowed = trailer.permission.alarmControl;

  const buttons = getPossibleNextState(trailer.state);
  return (
    <>
      {buttons.map((nextState: TrailerStates) => {
        if (nextState === TrailerStates.armed) {
          return (
            <ArmButton
              key="arm"
              trailer={trailer}
              openArmModal={openArmModal}
              setTrailerState={setTrailerState}
            />
          );
        }

        if (nextState === TrailerStates.startLoading) {
          return (
            <StartLoadingButton
              key="start-loading"
              trailer={trailer}
              setTrailerState={setTrailerState}
            />
          );
        }
        if (nextState === TrailerStates.endLoading) {
          return (
            <StopLoadingButton
              key="stop-loading"
              trailer={trailer}
              setTrailerState={setTrailerState}
            />
          );
        }

        if (nextState === TrailerStates.alarm) {
          return (
            <AlertButton
              key="alert"
              trailer={trailer}
              openAlarmModal={openAlarmModal}
              setTrailerState={setTrailerState}
              alarmControlAllowed={alarmControlAllowed}
            />
          );
        }

        if (nextState === TrailerStates.silenced) {
          return (
            <SilenceAlarmButton
              key="silence"
              trailer={trailer}
              setTrailerState={setTrailerState}
              alarmControlAllowed={alarmControlAllowed}
            />
          );
        }

        if (nextState === TrailerStates.resolved) {
          return (
            <ResolveAlarmButton
              key="resolve"
              trailer={trailer}
              setTrailerState={setTrailerState}
              alarmControlAllowed={alarmControlAllowed}
            />
          );
        }

        if (nextState === TrailerStates.disarmed) {
          return (
            <DisarmButton
              key="disarm"
              trailer={trailer}
              setTrailerState={setTrailerState}
            />
          );
        }

        if (nextState === TrailerStates.emergency) {
          return (
            <EmergencyButton
              key="alert"
              trailer={trailer}
              setTrailerState={setTrailerState}
              alarmControlAllowed={alarmControlAllowed}
            />
          );
        }

        return null;
      })}
    </>
  );
}

export const onArmedButtonClick = (
  trailer: Trailer,
  isContextMenuOpen: boolean,
  setIsContextMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setTrailerState: (id: TrailerId, status: TrailerStates) => void
) => {
  if (!(trailer.state === TrailerStates.armed)) {
    setIsContextMenuOpen(!isContextMenuOpen);
  } else if (!isContextMenuOpen) {
    setTrailerState(trailer.id, getState(trailer, TrailerStates.armed));
  }
};

const ArmButton = ({
  trailer,
  openArmModal,
  setTrailerState,
}: StatusButtonProps) => {
  const { t } = useTranslation();
  // const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  return (
    <NeutralButton
      text={t`system_set_armed`}
      active={false}
      onClick={() =>
        setTrailerState(trailer.id, getState(trailer, TrailerStates.armed))
      }
    />
    /* onArmedButtonClick(trailer, isContextMenuOpen, setIsContextMenuOpen, setTrailerState)}
    >
      {isContextMenuOpen && !(trailer.state === TrailerStates.armed) && (
        <ContextMenu>
          <ContextButton
            text={t`without_cameras`}
            onClick={() => setTrailerState(trailer.id, getState(trailer, TrailerStates.armed))}
          />
          <ContextButton
            text={t`with_cameras`}
            onClick={() =>
              openArmModal({
                trailer,
                getArmedStatus: trailer => getState(trailer, TrailerStates.armed),
                setTrailerState,
              })
            }
          />
        </ContextMenu>
      )}*/
  );
};

const DisarmButton = ({ trailer, setTrailerState }: AlertButtonProps) => {
  const { t } = useTranslation();
  return (
    <NeutralButton
      text={t`system_set_disarmed`}
      active={true}
      onClick={() => setTrailerState(trailer.id, TrailerStates.disarmed)}
    />
  );
};

const StartLoadingButton = ({ trailer, setTrailerState }: AlertButtonProps) => {
  const { t } = useTranslation();
  return (
    <NeutralButton
      text={t`loading_set_on`}
      active={false}
      onClick={() =>
        setTrailerState(
          trailer.id,
          getState(trailer, TrailerStates.startLoading)
        )
      }
    />
  );
};

const StopLoadingButton = ({ trailer, setTrailerState }: AlertButtonProps) => {
  const { t } = useTranslation();
  return (
    <NeutralButton
      text={t`loading_set_off`}
      active={true}
      onClick={() =>
        setTrailerState(trailer.id, getState(trailer, TrailerStates.endLoading))
      }
    />
  );
};

const EmergencyButton = ({
  trailer,
  setTrailerState,
  alarmControlAllowed,
}: AlertButtonProps) => {
  const { t } = useTranslation();
  if (!alarmControlAllowed) {
    return <></>;
  }
  return (
    <Alert
      active={false}
      onClick={() => setTrailerState(trailer.id, TrailerStates.emergency)}
    >
      {t`emergency_call`}
    </Alert>
  );
};

const AlertButton = ({
  trailer,
  openAlarmModal,
  setTrailerState,
  alarmControlAllowed,
}: AlertButtonProps) => {
  const { t } = useTranslation();
  if (!alarmControlAllowed) {
    return <></>;
  }
  return (
    <Alert
      active={false}
      onClick={() =>
        openAlarmModal &&
        openAlarmModal({
          trailer,
          getAlertStatus: (trailer) =>
            getState(trailer, TrailerStates.alarm, TrailerStates.silenced),
          setTrailerState,
        })
      }
    >
      {t`alarm_set_on`}
    </Alert>
  );
};

const SilenceAlarmButton = ({
  trailer,
  setTrailerState,
  alarmControlAllowed,
}: AlertButtonProps) => {
  const { t } = useTranslation();
  if (!alarmControlAllowed) {
    return <></>;
  }
  return (
    <Alert
      active
      onClick={() => setTrailerState(trailer.id, TrailerStates.silenced)}
    >
      {t`alarm_set_silenced`}
    </Alert>
  );
};

const ResolveAlarmButton = ({
  trailer,
  setTrailerState,
  alarmControlAllowed,
}: AlertButtonProps) => {
  const { t } = useTranslation();
  if (!alarmControlAllowed) {
    return <></>;
  }
  const isActive = !(TrailerStates.off === trailer.state);
  return (
    <Resolve
      active={isActive}
      onClick={() =>
        isActive &&
        setTrailerState(trailer.id, getState(trailer, TrailerStates.off))
      }
    >
      {isActive ? t`alarm_set_off` : t`alarm_resolved`}
    </Resolve>
  );
};

function NeutralButton(props: NeutralButtonProps) {
  const { children, active, text, onClick } = props;
  return (
    <StatusButton active={active} onClick={onClick}>
      <StatusText>{text}</StatusText>
      {children}
    </StatusButton>
  );
}

function SensorsBreadcrumb({
  match,
}: RouteComponentProps<{ sensorId: string }>) {
  const sensorId = snakeToCamel(match.params.sensorId);
  const { t } = useTranslation();
  if (!isSensorType(sensorId)) {
    return <Chevron />;
  }
  return (
    <>
      <Chevron />
      <Breadcrumb>{t(toReadableName(sensorId))}</Breadcrumb>
    </>
  );
}

function EventsBreadcrumb() {
  const { t } = useTranslation("events");
  return (
    <>
      <Chevron />
      <Breadcrumb>{t`history`}</Breadcrumb>
    </>
  );
}

const Chevron = () => {
  return (
    <ChevronRightIcon
      color={"#000000"}
      backgroundColor={"transparent"}
      active={false}
      wrapperSize={25}
      iconSize={25}
    />
  );
};

const Container = styled.div`
  margin: 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  @media screen and (max-width: 812px) {
    flex-wrap: wrap;
  }
`;

const VContainer = styled.div`
  margin: 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
`;

const CarNumber = styled.div`
  margin: 8px;
  min-width: 225px;
  display: flex;
  flex-direction: row;
  border: 3px solid #000000;
  border-radius: 4px;
  text-decoration: none;
  color: #000000;
`;

const InfoNotActual = styled.div`
  margin: 8px;
  min-width: 150px;
  max-width: 300px;
  display: flex;
  flex-direction: row;
  border: 3px solid #d75d30;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: #d75d30;
  cursor: pointer;
`;

const InfoWarning = styled.div`
  margin: 8px;
  min-width: 150px;
  max-width: 300px;
  display: flex;
  flex-direction: row;
  border: 3px solid #da982d;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: #da982d;
  cursor: pointer;
`;

const InfoOk = styled.div`
  margin: 8px;
  min-width: 150px;
  max-width: 300px;
  display: flex;
  flex-direction: row;
  border: 3px solid #556b2f;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: #556b2f;
  cursor: pointer;
`;

const PictoWrapper = styled.div`
  position: relative;
  margin: 8px;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: #a0a0a0;
  outline: none;
`;

const PictoMessageWrapper = styled.div`
  max-width: 458px;
  height: 58px;
  margin: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CountryCode = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #2b6bb6;
`;

const FlagWrapper = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Flag = styled.img`
  width: 20px;
  height: 20px;
  object-fit: cover;
`;

const Country = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 1.7;
  text-align: center;
  color: #ffffff;
  background-color: #2b6bb6;
`;

const Number = styled.span`
  padding-left: 17px;
  padding-right: 17px;
  min-width: 153px;
  width: 100%;
  font-size: 34px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const StatusButton = styled.div`
  position: relative;
  margin: 8px;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: ${({ active }: { active: boolean | null }) =>
    active ? "#5fa80f" : "#a0a0a0"};
  outline: none;
  cursor: pointer;
`;

const StatusText = styled.span`
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left: 15px;
  padding-right: 15px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  color: #ffffff;
  white-space: nowrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #ffffff;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const Alert = styled.button`
  margin: 8px;
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  color: #ffffff;
  white-space: nowrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${({ active }: { active: boolean | null }) =>
    active ? "#e7b600" : "#d0021b"};
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const Resolve = styled(Alert)`
  background-color: ${({ active }: { active: boolean | null }) =>
    active ? "#5fa80f" : "#a0a0a0"};
`;

const Breadcrumb = styled.span`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.25;
  color: #000000;
  text-transform: capitalize;
`;
