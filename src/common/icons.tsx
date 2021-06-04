import React, { ComponentType } from "react";
import { MdiReactIconProps } from "mdi-react";
import styled from "@ui/Theme";

import AccountCheckOutline from "mdi-react/AccountCheckOutlineIcon";
import BullhornOutline from "mdi-react/BullhornOutlineIcon";
import CalendarBlankOutline from "mdi-react/CalendarBlankOutlineIcon";
import Check from "mdi-react/CheckIcon";
import ChevronDown from "mdi-react/ChevronDownIcon";
import ChevronRight from "mdi-react/ChevronRightIcon";
import ChevronUp from "mdi-react/ChevronUpIcon";
import Close from "mdi-react/CloseIcon";
import CloseBoxOutline from "mdi-react/CloseBoxOutlineIcon";
import Earth from "mdi-react/EarthIcon";
import Email from "mdi-react/EmailIcon";
import Engine from "mdi-react/EngineIcon";
import EngineOffOutline from "mdi-react/EngineOffOutlineIcon";
import EyeOutline from "mdi-react/EyeOutlineIcon";
import EyeOffOutline from "mdi-react/EyeOffOutlineIcon";
import HomeCircle from "mdi-react/HomeCircleIcon";
import FlagOutline from "mdi-react/FlagOutlineIcon";
import Fullscreen from "mdi-react/FullscreenIcon";
import InformationOutline from "mdi-react/InformationOutlineIcon";
import LightbulbOutline from "mdi-react/LightbulbOutlineIcon";
import Phone from "mdi-react/PhoneIcon";
import PlayCircle from "mdi-react/PlayCircleIcon";
import SignalCellular1 from "mdi-react/SignalCellular1Icon";
import SignalCellular2 from "mdi-react/SignalCellular2Icon";
import SignalCellular3 from "mdi-react/SignalCellular3Icon";
import SignalCellularOutline from "mdi-react/SignalCellularOutlineIcon";
import SignalOff from "mdi-react/SignalOffIcon";
import Truck from "mdi-react/TruckIcon";
import Video from "mdi-react/VideoIcon";
import NotePlus from "mdi-react/NotePlusIcon";
import PhotoCameraIcon from "mdi-react/PhotoCameraIcon";
import ClockTimeSevenOutlineIcon from "mdi-react/ClockTimeSevenOutlineIcon";
import ViewList from "mdi-react/ViewListIcon";
import ViewTile from "mdi-react/AppsIcon";
import Menu from "mdi-react/MenuIcon";
import Sort from "mdi-react/SortIcon";
import Person from "mdi-react/PersonIcon";

interface IconProps {
  wrapperSize?: number | string;
  color?: string;
  backgroundColor?: string;
  hoverColor?: string;
  backgroundHoverColor?: string;
  active?: boolean;
  style?: Partial<CSSStyleDeclaration>;
  onClick?: () => void;
}

interface MdiIconProps {
  iconSize?: number | string;
}

type Props = IconProps & MdiIconProps;

const Icon = styled.div<IconProps>`
  width: ${(props) => props.wrapperSize}px;
  height: ${(props) => props.wrapperSize}px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.backgroundColor};

  .mdi-icon {
    path {
      fill: ${(props) => props.color};
    }
  }

  &:hover {
    cursor: ${(props) => (props.active ? "pointer" : "default")};
    background-color: ${(props) => props.backgroundHoverColor};

    .mdi-icon {
      path {
        fill: ${(props) => props.hoverColor};
      }
    }
  }
`;

function createIcon(MdiReactIcon: ComponentType<MdiReactIconProps>) {
  return (props: Props) => {
    const {
      wrapperSize,
      iconSize,
      color,
      backgroundColor,
      active,
      hoverColor,
      backgroundHoverColor,
      onClick,
      ...rest
    } = props;

    return (
      <Icon
        wrapperSize={wrapperSize}
        color={color}
        backgroundColor={backgroundColor}
        active={active}
        hoverColor={hoverColor || color}
        backgroundHoverColor={backgroundHoverColor || backgroundColor}
        onClick={onClick}
        {...rest}
      >
        <MdiReactIcon size={iconSize} />
      </Icon>
    );
  };
}

export const AccountCheckOutlineIcon = createIcon(AccountCheckOutline);
export const CalendarBlankOutlineIcon = createIcon(CalendarBlankOutline);
export const CheckIcon = createIcon(Check);
export const ChevronDownIcon = createIcon(ChevronDown);
export const ChevronRightIcon = createIcon(ChevronRight);
export const ChevronUpIcon = createIcon(ChevronUp);
export const CloseBoxOutlineIcon = createIcon(CloseBoxOutline);
export const CloseIcon = createIcon(Close);
export const EarthIcon = createIcon(Earth);
export const EngineIcon = createIcon(Engine);
export const EngineOffOutlineIcon = createIcon(EngineOffOutline);
export const EmailIcon = createIcon(Email);
export const EyeOutlineIcon = createIcon(EyeOutline);
export const EyeOffOutlineIcon = createIcon(EyeOffOutline);
export const FlagOutlineIcon = createIcon(FlagOutline);
export const FullscreenIcon = createIcon(Fullscreen);
export const HomeCircleIcon = createIcon(HomeCircle);
export const HornIcon = createIcon(BullhornOutline);
export const InformationOutlineIcon = createIcon(InformationOutline);
export const LightbulbOutlineIcon = createIcon(LightbulbOutline);
export const PhoneIcon = createIcon(Phone);
export const PlayCircleIcon = createIcon(PlayCircle);
export const SignalCellular1Icon = createIcon(SignalCellular1);
export const SignalCellular2Icon = createIcon(SignalCellular2);
export const SignalCellular3Icon = createIcon(SignalCellular3);
export const SignalCellularOutlineIcon = createIcon(SignalCellularOutline);
export const SignalOffIcon = createIcon(SignalOff);
export const TruckIcon = createIcon(Truck);
export const VideoIcon = createIcon(Video);
export const PhotoIcon = createIcon(PhotoCameraIcon);
export const UpdateNoteIcon = createIcon(NotePlus);
export const ClockIcon = createIcon(ClockTimeSevenOutlineIcon);
export const ListIcon = createIcon(ViewList);
export const TileIcon = createIcon(ViewTile);
export const MenuIcon = createIcon(Menu);
export const SortIcon = createIcon(Sort);
export const PersonIcon = createIcon(Person);
