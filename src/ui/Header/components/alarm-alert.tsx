import React from "react";
import { useTranslation } from "react-i18next";

import { AlarmModalProps } from "@screens/trailers/container";
import { CloseBoxOutlineIcon } from "@common/icons";
import styled from "@ui/Theme";
import { TrailerStates } from "@screens/trailers/types";

interface OwnProps {
  closeModal: () => void;
}

interface AlarmAlertProps {
  alarmModalProps: AlarmModalProps;
}

export function AlarmAlert({
  closeModal,
  alarmModalProps,
}: AlarmAlertProps & OwnProps) {
  const { trailer, setTrailerState } = alarmModalProps;
  const { t } = useTranslation("alarm_modal");

  const possibilityOfLoudAlarm =
    trailer.state !== TrailerStates.alarm &&
    trailer.state !== TrailerStates.emergency;
  const possibilityOfQuietAlarm =
    trailer.state !== TrailerStates.alarm &&
    trailer.state !== TrailerStates.silenced &&
    trailer.state !== TrailerStates.quiet &&
    trailer.state !== TrailerStates.emergency;
  const possibilityOfEmergency = trailer.state !== TrailerStates.emergency;

  return (
    <Container>
      <StyledCloseBoxOutlineIcon
        wrapperSize={18}
        iconSize={18}
        color={"#9b9b9b"}
        backgroundColor={"transparent"}
        active={true}
        onClick={() => closeModal()}
      />
      <Header>{t`header`}</Header>
      <Description>{t`description`}</Description>
      <ButtonsWrapper>
        {possibilityOfLoudAlarm && (
          <AlarmButton
            onClick={() => {
              setTrailerState(trailer.id, TrailerStates.alarm);
              closeModal();
            }}
          >{t`alarm`}</AlarmButton>
        )}
        {possibilityOfLoudAlarm && <Info>{t`alarm_info`}</Info>}
        {possibilityOfQuietAlarm && (
          <AlarmButton
            onClick={() => {
              setTrailerState(trailer.id, TrailerStates.quiet);
              closeModal();
            }}
          >{t`silent_alarm`}</AlarmButton>
        )}
        {possibilityOfQuietAlarm && <Info>{t`silent_alarm_info`}</Info>}
        {possibilityOfEmergency && (
          <AlarmButton
            onClick={() => {
              setTrailerState(trailer.id, TrailerStates.emergency);
              closeModal();
            }}
          >{t`alarm_with_call`}</AlarmButton>
        )}
        {possibilityOfEmergency && <Info>{t`alarm_with_call_info`}</Info>}
      </ButtonsWrapper>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const StyledCloseBoxOutlineIcon = styled(CloseBoxOutlineIcon)`
  align-self: flex-end;
`;

const Header = styled.div`
  width: 100%;
  max-width: 430px;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
  color: #000000;
  &::first-letter {
    text-transform: capitalize;
  }
`;

const Description = styled.div`
  margin-top: 15px;
  max-width: 430px;
  font-size: 12px;
  line-height: 1.25;
  color: #000000;
  &::first-letter {
    text-transform: capitalize;
  }
`;

const ButtonsWrapper = styled.div`
  margin-top: 35px;
  width: 100%;
  max-width: 395px;
`;

const AlarmButton = styled.button`
  width: 100%;
  max-width: 395px;
  margin: 5px 0;
  padding: 8px 50px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: #ffffff;
  text-align: center;
  background-color: #d0021b;
  border-radius: 4px;
  border: 1px solid #dfe3e9;
  outline: none;
  cursor: pointer;
  &::first-letter {
    text-transform: capitalize;
  }
`;

const Info = styled.div`
  margin-bottom: 15px;
  padding: 0 5px;
  font-size: 12px;
  line-height: 1.25;
  color: #4a4a4a;
`;
