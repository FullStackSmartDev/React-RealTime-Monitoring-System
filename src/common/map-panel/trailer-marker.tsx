import React, { useState } from "react";
import { Marker, InfoWindow } from "react-google-maps";

import {
  truckmarkerblue,
  truckmarkergray,
  truckmarkergreen,
  truckmarkerred,
  truckparkingblue,
} from "@assets/index";
import styled from "@ui/Theme";
import { Trailer } from "@screens/trailers/reducer";
import { TrailerStates, TrailerStatesHelper } from "@screens/trailers/types";
import { TrailerEventTypeCategory } from "@features/events/types";

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

export default function TrailerMarker(props: TrailerMarkerProps) {
  const { trailer } = props;

  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

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
      onClick={() => setIsInfoWindowOpen(false)}
      options={{ position: trailer.position }}
    >
      {isInfoWindowOpen && (
        <InfoWindow>
          <InfoWrapper>test</InfoWrapper>
        </InfoWindow>
      )}
    </Marker>
  );
}

const InfoWrapper = styled.div``;
