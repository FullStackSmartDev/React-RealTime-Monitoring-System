import React from "react";
import { WithGoogleMapProps, withGoogleMap } from "react-google-maps";

import MapContainer, { MapContainerProps } from "./map-container";

export type MapPanelProps = Partial<WithGoogleMapProps> & MapContainerProps;

const EnhancedMap = withGoogleMap(MapContainer);

export default function MapPanel(props: MapPanelProps) {
  const {
    containerElement = (
      <div className="container-element" style={{ height: `245px` }} />
    ),
    mapElement = <div className="map-element" style={{ height: `100%` }} />,
    ...rest // TODO lazy transmission, causes rerenders even when not needed.
  } = props;

  return (
    <EnhancedMap
      containerElement={containerElement}
      mapElement={mapElement}
      {...rest}
    />
  );
}
