import React, { Component } from "react";
import { InfoWindow, Marker } from "react-google-maps";

import {
  eventmarkerblue,
  eventmarkergray,
  eventmarkergreen,
  eventmarkerred,
  eventmarkeryellow,
  eventparkingblue,
  eventcomputervision,
} from "@assets/index";
import { TrailerEvent } from "@features/events/reducer";
import { TrailerStatesHelper } from "@screens/trailers/types";
import { TrailerEventTypeCategory } from "@features/events/types";
import moment from "moment";
import { TFunction } from "i18next";

const getEventMarker = (event: TrailerEvent) => {
  const category = TrailerStatesHelper.toCategory(event.type);

  switch (category) {
    case TrailerEventTypeCategory.armed:
      return eventmarkergreen;
    case TrailerEventTypeCategory.loading:
      return eventmarkerblue;
    case TrailerEventTypeCategory.alarm:
      return eventmarkerred;
    case TrailerEventTypeCategory.parking:
      return eventparkingblue;
    case TrailerEventTypeCategory.warning:
      return eventmarkeryellow;
    case TrailerEventTypeCategory.recognition:
      return eventcomputervision;
    case TrailerEventTypeCategory.normal:
    default:
      return eventmarkergray;
  }
};

const getEventOrder = (event: TrailerEvent) => {
  const category = TrailerStatesHelper.toCategory(event.type);

  switch (category) {
    case TrailerEventTypeCategory.armed:
      return 6;
    case TrailerEventTypeCategory.loading:
      return 8;
    case TrailerEventTypeCategory.alarm:
      return 32;
    case TrailerEventTypeCategory.parking:
      return 2;
    case TrailerEventTypeCategory.recognition:
      return 64;
    case TrailerEventTypeCategory.warning:
      return 16;
    case TrailerEventTypeCategory.normal:
    default:
      return 4;
  }
};

const getEventPosition = (event: TrailerEvent) => {
  const category = TrailerStatesHelper.toCategory(event.type);

  let x = 16,
    y = 24;
  let a = 0,
    b = 0;

  switch (category) {
    case TrailerEventTypeCategory.armed:
      a = 1;
      b = 1;
      break;
    case TrailerEventTypeCategory.loading:
      a = 1;
      b = -1;
      break;
    case TrailerEventTypeCategory.alarm:
      a = -1;
      b = -1;
      break;
    case TrailerEventTypeCategory.normal:
      a = 1;
      b = -1;
      break;
    case TrailerEventTypeCategory.warning:
      a = -1;
      b = 1;
      break;
    case TrailerEventTypeCategory.recognition:
    case TrailerEventTypeCategory.parking:
    default:
      a = 0;
      b = 0;
  }

  return new google.maps.Point(x + a * 8, y + b * 12);
};

class TooltipEventMarker extends Component<{
  event: TrailerEvent;
  t: TFunction;
  showEventDetails?: (event: TrailerEvent) => void;
}> {
  state = {
    showInfoWindow: false,
  };
  handleClick = () => {
    const { event, showEventDetails } = this.props;
    if (showEventDetails) showEventDetails(event);
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
    const { event, t } = this.props;

    if (
      !event.location ||
      (event.location.lat === 0 && event.location.lng === 0)
    )
      return <></>;
    return (
      <Marker
        zIndex={getEventOrder(event)}
        icon={{
          anchor: getEventPosition(event),
          url: getEventMarker(event),
          size: new google.maps.Size(32, 48),
        }}
        options={{
          position: event.location,
        }}
        clickable={true}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseExit}
      >
        {showInfoWindow && (
          <InfoWindow>
            <h4>
              {t(TrailerStatesHelper.toReadableName(event.type))}
              <br />
              {t`time`}: {moment(event.date).format("LT, L")}
            </h4>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}

export default TooltipEventMarker;
