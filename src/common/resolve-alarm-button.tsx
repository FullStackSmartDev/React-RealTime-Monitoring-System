import React, { createRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "@ui/Theme";
import { AlarmAction } from "@features/events/types";
import { State } from "@store/index";
import { TrailerPermissions, TrailerStates } from "@screens/trailers/types";
import { getPermission } from "@screens/trailers/selectors";
import { resolveAlarm } from "@screens/trailers/actions";
import { TrailerEventId } from "@features/events/reducer";
import { useTranslation } from "react-i18next";

interface OwnProps {
  id: TrailerEventId;
  type: TrailerStates;
  interactions: AlarmAction[];
  onClick: () => void;
}

const ResolveAlarmButton: React.FC<OwnProps> = ({
  id,
  type,
  interactions,
  onClick,
}) => {
  const isResolvePermtted = useSelector((state: State) =>
    getResolvePermission(state)
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const buttonRef = createRef<HTMLButtonElement>();

  const isAlarm =
    type === TrailerStates.alarm ||
    type === TrailerStates.silenced ||
    type === TrailerStates.quiet ||
    type === TrailerStates.emergency ||
    type === TrailerStates.doorOpened ||
    type === TrailerStates.humanDetected;

  const isTurnedOff = interactions.some(
    (interaction) => interaction.type === TrailerStates.off
  );
  const isNotResolved = !interactions.some(
    (interaction) => interaction.type === TrailerStates.resolved
  );
  const canBeResolved =
    isAlarm && isTurnedOff && isNotResolved && isResolvePermtted && id;

  if (!canBeResolved) {
    return null;
  }
  const resolve = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (e.target === buttonRef.current) {
      e.stopPropagation();
    }
    dispatch(resolveAlarm(id));
    setTimeout(onClick, 0);
  };

  const text = t`alarm_set_resolved`;

  return (
    <StyledButton ref={buttonRef} onClick={resolve} title={text}>
      {text}
    </StyledButton>
  );
};

const getResolvePermission = getPermission(
  TrailerPermissions.alarmResolveControl
);

export default ResolveAlarmButton;

const StyledButton = styled.button`
  margin: 0 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  text-align: center;
  color: #ffffff;
  white-space: nowrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #5fa80f;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  &::first-letter {
    text-transform: uppercase;
  }
`;
