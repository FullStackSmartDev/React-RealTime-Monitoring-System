import React, { useState } from "react";
import moment from "moment";

import styled from "@ui/Theme";
import { AccountCheckOutlineIcon, TruckIcon } from "./icons";
import { AlarmAction } from "@features/events/types";
import { TrailerStatesHelper } from "@screens/trailers/types";
import { useTranslation } from "react-i18next";

interface PersonCheckProps {
  date?: AlarmAction["date"];
  logistician?: AlarmAction["logistician"];
  type?: AlarmAction["type"];
}

export default function PersonCheck({
  date,
  logistician,
  type,
}: PersonCheckProps) {
  let Icon = AccountCheckOutlineIcon;
  if (!logistician) {
    Icon = TruckIcon;
  }

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { t } = useTranslation();

  let info = type ? `${t(TrailerStatesHelper.toReadableName(type))}, ` : "";
  info += logistician
    ? `${logistician.first_name} ${logistician.last_name}`
    : "";
  info += date ? ` ${moment(date).format("LT L")}` : "";

  return (
    <Wrapper
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <Icon
        wrapperSize={25}
        iconSize={22}
        color={"#4a4a4a"}
        backgroundColor={"transparent"}
        active
      />
      {isTooltipVisible && <TextWrapper>{info}</TextWrapper>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  user-select: none;
`;

const TextWrapper = styled.span`
  padding: 5px 10px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #9b9b9b;
  white-space: nowrap;
  background: #ffffff;
  border-radius: 4px;
  opacity: 1;
  transition: opacity 0.5s;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
  z-index: 1001;
`;
