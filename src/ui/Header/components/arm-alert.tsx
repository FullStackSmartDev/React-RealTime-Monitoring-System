import React from "react";
import { useTranslation } from "react-i18next";

import styled from "@ui/Theme";
import { ArmModalProps } from "@screens/trailers/container";
import { Trailer, TrailerId } from "@screens/trailers/reducer";
import { TrailerStates } from "@screens/trailers/types";

interface OwnProps {
  closeModal: () => void;
}

export interface AlertProps {
  onConfirm: (closeModal: OwnProps["closeModal"]) => void;
  labels: {
    header?: string;
    description: string;
    info?: string;
    confirm?: string;
    cancel?: string | null;
  };
}

interface ArmAlertProps extends AlertProps {
  armModalProps: ArmModalProps;
}

function armSystemWithCameras(
  trailer: Trailer,
  getArmedStatus: (trailer: Trailer) => TrailerStates,
  setTrailerState: (id: TrailerId, status: TrailerStates) => void,
  closeModal: () => void
) {
  setTrailerState(trailer.id, getArmedStatus(trailer));
  closeModal();
}

export function Alert(props: AlertProps & OwnProps) {
  const { closeModal, onConfirm, labels } = props;

  const { t } = useTranslation("common");

  const {
    description,
    header = t`warning`,
    info = "",
    cancel = t`cancel`,
    confirm = t`save`,
  } = labels;

  return (
    <Container>
      <Header>{header}</Header>
      <Description>{description}</Description>
      <Info>{info}</Info>
      <ButtonsWrapper>
        {cancel !== null && (
          <CancelButton onClick={() => closeModal()}>{cancel}</CancelButton>
        )}
        <ConfirmButton onClick={() => onConfirm(closeModal)}>
          {confirm}
        </ConfirmButton>
      </ButtonsWrapper>
    </Container>
  );
}

export function ArmAlert(props: ArmAlertProps & OwnProps) {
  const { closeModal, armModalProps } = props;
  const { trailer, getArmedStatus, setTrailerState } = armModalProps;
  const { t } = useTranslation("arm_modal");
  const onConfirm = () =>
    armSystemWithCameras(trailer, getArmedStatus, setTrailerState, closeModal);
  return (
    <Alert
      labels={{
        header: t`attention`,
        description: t`warning`,
        info: t`info`,
        confirm: t`arm`,
      }}
      closeModal={closeModal}
      onConfirm={onConfirm}
    />
  );
}

const Container = styled.div`
  padding: 35px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const Header = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.25;
  color: #d0021b;
  text-align: center;
  &::first-letter {
    text-transform: capitalize;
  }
`;

const Description = styled(Header)`
  margin-top: 20px;
  max-width: 405px;
  color: #000000;
  &::first-letter {
    text-transform: capitalize;
  }
`;

const Info = styled.div`
  margin-top: 15px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  color: #000000;
  text-align: center;
  &::first-letter {
    text-transform: capitalize;
  }
`;

const ButtonsWrapper = styled.div`
  margin-top: 50px;
`;

const CancelButton = styled.button`
  margin: 5px;
  padding: 8px 50px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: #4a90e2;
  text-align: center;
  background-color: #f4f6f8;
  border-radius: 4px;
  border: none;
  outline: none;
  cursor: pointer;
  &::first-letter {
    text-transform: capitalize;
  }
`;

const ConfirmButton = styled(CancelButton)`
  color: #ffffff;
  background-color: #4a90e2;
  &::first-letter {
    text-transform: capitalize;
  }
`;
