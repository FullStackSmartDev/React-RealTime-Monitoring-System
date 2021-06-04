import React, { Component } from "react";
import { Marker, InfoWindow } from "react-google-maps";
import moment from "moment";
import { TFunction } from "i18next";

interface Props {
  speed: number;
  time: Date;
  lat: number;
  lng: number;
  t: TFunction;
  id: number;
  markerColor: string;
  signal: number;
  onMarkerClick?: (arg: Date) => void;
}

class TooltipMarker extends Component<Props, {}> {
  state = {
    showInfoWindow: false,
  };
  handleClick = (e: google.maps.MouseEvent) => {
    const { time, onMarkerClick } = this.props;
    onMarkerClick && onMarkerClick(time);
  };
  handleMouseOver = (e: google.maps.MouseEvent) => {
    this.setState({
      showInfoWindow: true,
    });
  };
  handleMouseExit = (e: google.maps.MouseEvent) => {
    this.setState({
      showInfoWindow: false,
    });
  };

  render() {
    const { showInfoWindow } = this.state;
    const { speed, time, lat, lng, t, markerColor, signal } = this.props;

    return (
      <Marker
        zIndex={-99}
        position={{ lat, lng }}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor: markerColor,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeOpacity: 1,
          scale: 2,
        }}
        clickable={true}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseExit}
      >
        {showInfoWindow && (
          <InfoWindow>
            <h4>
              {t`speed`}: {speed} {t`kmh`}
              <br />
              {t`time`}: {moment(time).format("LT, L")}
              <br />
              {t`signal`}: {signal}
            </h4>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}
export default TooltipMarker;
