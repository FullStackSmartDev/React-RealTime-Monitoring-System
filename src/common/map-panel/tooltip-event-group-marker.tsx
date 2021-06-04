import React, { Component } from "react";
import { InfoWindow, Marker } from "react-google-maps";

import { eventmarkermultiple } from "@assets/index";

import EventsList from "@screens/trailers/components/events-list";
import { TrailerEvent } from "@features/events/reducer";
import MapContainer from "./map-container";
import { TFunction } from "i18next";

export interface TooltipEventGroupMarkerProps {
  event: TrailerEvent;
  events: TrailerEvent[];
  selectedTime: string;
  showEventDetails: (event: TrailerEvent) => void;
  setEventTime: (time: Date) => void;
  refreshList: () => void;
  t: TFunction;
  openInfoWindows?: Component[];
  map: MapContainer;
}

export interface TooltipEventGroupMarkerState {
  showInfoWindow: boolean;
  openInfoWindows?: Component[];
  map: MapContainer;
}

class TooltipEventGroupMarker extends Component<
  TooltipEventGroupMarkerProps,
  TooltipEventGroupMarkerState
> {
  handleClick = () => {
    this.setState({
      showInfoWindow: !this.state.showInfoWindow,
    });

    if (this.state.showInfoWindow) {
      this.registerOpening();
    }
  };

  registerOpening() {
    const { showInfoWindow, openInfoWindows, map } = this.state;

    if (
      map &&
      showInfoWindow &&
      Array.isArray(openInfoWindows) &&
      openInfoWindows.filter((element) => this === element).length === 0
    ) {
      openInfoWindows.push(this);
      map.setState({
        openInfoWindows: openInfoWindows,
      });
    }
  }

  constructor(props: TooltipEventGroupMarkerProps) {
    super(props);

    this.state = {
      showInfoWindow: false,
      openInfoWindows: this.props.openInfoWindows,
      map: this.props.map,
    };
  }

  render() {
    const { showInfoWindow } = this.state;
    const {
      event,
      events,
      selectedTime,
      showEventDetails,
      refreshList,
    } = this.props;

    return (
      <Marker
        zIndex={1}
        icon={{
          anchor: new google.maps.Point(16, 60),
          url: eventmarkermultiple,
          size: new google.maps.Size(32, 48),
        }}
        options={{
          position: event.location,
        }}
        clickable={true}
        onClick={this.handleClick}
      >
        {showInfoWindow && (
          <InfoWindow>
            <EventsList
              selectedTime={selectedTime}
              showEventDetails={showEventDetails}
              events={events}
              refreshList={refreshList}
            />
          </InfoWindow>
        )}
      </Marker>
    );
  }
}

export default TooltipEventGroupMarker;
