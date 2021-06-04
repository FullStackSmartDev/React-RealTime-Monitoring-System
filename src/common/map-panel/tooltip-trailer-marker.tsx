import React, { Component } from "react";
import { Marker, InfoWindow } from "react-google-maps";

import {
  truckmarkerblue,
  truckmarkergray,
  truckmarkergreen,
  truckmarkerred,
  truckparkingblue,
} from "@assets/index";
import { Trailer } from "@screens/trailers/reducer";
import { TrailerStates, TrailerStatesHelper } from "@screens/trailers/types";
import { TrailerEventTypeCategory } from "@features/events/types";
import moment from "moment";
import { TFunction } from "i18next";

export interface TrailerMarkerProps {
  trailer: Trailer;
}

const getTrailerMarker = (state: TrailerStates) => {
  const category = TrailerStatesHelper.toTrailerMarkerCategory(state);
  switch (category) {
    case TrailerEventTypeCategory.loading:
      return truckmarkerblue;
    case TrailerEventTypeCategory.alarm:
      return truckmarkerred;
    case TrailerEventTypeCategory.armed:
      return truckmarkergreen;
    case TrailerEventTypeCategory.parking:
      return truckparkingblue;
    case TrailerEventTypeCategory.normal:
    default:
      return truckmarkergray;
  }
};

interface Props {
  trailer: Trailer;
  t: TFunction;
  onMarkerClick?: (arg0: Date) => void;
}

export default class TooltipTrailerMarker extends Component<Props, {}> {
  state = {
    showInfoWindow: false,
  };
  handleClick = () => {
    const { onMarkerClick } = this.props;

    if (onMarkerClick) {
      onMarkerClick(new Date());
    }
  };
  handleMouseOver = () => {
    this.setState({
      showInfoWindow: true,
    });
  };
  handleMouseExit = () => {
    this.setState({
      showInfoWindow: false,
    });
  };

  render() {
    const { showInfoWindow } = this.state;
    const { trailer, t } = this.props;

    if (
      !trailer.position ||
      trailer.position.lat === null ||
      trailer.position.lng === null ||
      !trailer.state
    ) {
      return <></>;
    }

    return (
      <Marker
        zIndex={12}
        icon={{
          anchor: new google.maps.Point(16, 45 / 2),
          url: getTrailerMarker(trailer.state),
          size: new google.maps.Size(32, 45),
        }}
        options={{ position: trailer.position }}
        clickable={true}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseExit}
      >
        {showInfoWindow && (
          <InfoWindow>
            <h4>
              {trailer.plateNumber}
              <br />
              {t`speed`}: {trailer.position.speed} {t`kmh`}
              <br />
              {t`time`}: {moment(Date.now()).format("LT, L")}
              <br />
              {t`signal`}: {trailer.position.signal}
              <br />
              {t`status`}:{" "}
              {t(TrailerStatesHelper.toReadableName(trailer.state))}
            </h4>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}
