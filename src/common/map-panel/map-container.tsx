import { GoogleMap, Polyline } from "react-google-maps";
import React, { Component, createRef, ReactNode } from "react";

import EventMarkers from "./event-markers";
import EventGroupMarkers from "./event-group-markers";
import { Trailer, TrailerId } from "@screens/trailers/reducer";
import { TrailerEvent } from "@features/events/reducer";
import { TrailerPosition } from "@features/routes/reducer";
import TooltipMarker from "./tooltip-marker";
import { TrailerStates } from "@screens/trailers/types";
import moment, { Moment } from "moment";
import TooltipTrailerMarker from "./tooltip-trailer-marker";
import { TFunction } from "i18next";

export interface MapContainerProps {
  trailers?: Trailer[];
  loadingEvents?: TrailerEvent[];
  alarmEvents?: TrailerEvent[];
  armedEvents?: TrailerEvent[];
  warningEvents?: TrailerEvent[];
  normalEvents?: TrailerEvent[];
  parkingEvents?: TrailerEvent[];
  recognitionEvents?: TrailerEvent[];
  unknownEvents?: TrailerEvent[];
  allEvents?: TrailerEvent[];
  routes?: TrailerPosition[][];
  selectedTrailer?: TrailerId | null;
  children?: ReactNode;
  showEventDetails?: (event: TrailerEvent) => void;
  onMarkerClick?: (arg0: Date) => void;
  t: TFunction; // TODO(bartosz-szczecinski) This is no longer needed, we're consuming t internally via hook
  openInfoWindows?: Component[];
}

interface MapContainerState {
  trailerId: string | null | undefined;
  center: google.maps.LatLng;
  eventClusters: {
    zoom: number;
    data?: {
      header: TrailerEvent;
      tail: TrailerEvent[];
    }[];
  };
  openInfoWindows: Component[];
}

const styles = require("./GoogleMapStyles.json");

const dayColors = [
  "#1528FF",
  "#000000",
  "#a7c155",
  "#45b15F",
  "#FF2815",
  "#45b1AC",
  "#6F1581",
];

function haversine_distance(
  location: google.maps.LatLngLiteral,
  location2: google.maps.LatLngLiteral
) {
  var R = 6371.071; // Radius of the Earth in km
  var rlat1 = location.lat * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = location2.lat * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (location2.lng - location.lng) * (Math.PI / 180); // Radian difference (longitudes)

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
}

function meters_per_pixel(location: google.maps.LatLngLiteral, zoom: number) {
  return (
    (156543.03392 * Math.cos((location.lat * Math.PI) / 180)) /
    Math.pow(2, zoom)
  );
}

class MapContainer extends React.PureComponent<
  MapContainerProps,
  MapContainerState
> {
  mapRef = createRef<GoogleMap>();

  state = {
    trailerId: this.props.selectedTrailer,
    center: new google.maps.LatLng(52, 21),
    eventClusters: {
      zoom: 7,
      data: [],
    },
    openInfoWindows: [],
  };

  updateClusters = () => {
    const { allEvents = [] } = this.props;

    if (!this.mapRef?.current) return;
    const eventClusters: {
      header: TrailerEvent;
      tail: TrailerEvent[];
    }[] = [];

    if (allEvents.length > 0) {
      eventClusters.push({
        header: allEvents[0],
        tail: [], // it will be added itself later
      });

      allEvents.forEach((event) => {
        let parked = false;
        eventClusters.forEach((cluster) => {
          if (
            event.location !== undefined &&
            cluster.header?.location !== undefined &&
            this.mapRef.current != null
          )
            if (
              haversine_distance(cluster.header.location, event.location) *
                1000 <
              20 *
                meters_per_pixel(
                  cluster.header.location,
                  this.mapRef.current.getZoom()
                )
            ) {
              cluster.tail.push(event);
              parked = true;
            }
        });
        if (!parked) {
          eventClusters.push({
            header: event,
            tail: [event],
          });
        }
      });
    }

    return eventClusters;
  };

  static defaultCenter = { lat: 52, lng: 21 };

  static isLatLngLiteral(object: any): object is google.maps.LatLngLiteral {
    return (
      object && typeof object.lat === "number" && typeof object.lng === "number"
    );
  }

  static getCenter(props: MapContainerProps, state: MapContainerState) {
    const { trailers = [] } = props;
    if (trailers.length > 1) {
      return state;
    }

    const [trailer] = trailers;
    if (trailer && MapContainer.isLatLngLiteral(trailer.position)) {
      return { center: trailer.position };
    }

    return { center: MapContainer.defaultCenter };
  }

  static getDerivedStateFromProps(
    props: MapContainerProps,
    state: MapContainerState
  ) {
    return MapContainer.getCenter(props, state);
  }
  /*
  shouldComponentUpdate(nextProps: Readonly<MapContainerProps>, nextState: Readonly<MapContainerState>, nextContext: any): boolean {

    let _ = require('lodash');
    let needUpdate = (nextProps.selectedTrailer === undefined)
      || !_.isEqual(nextProps.selectedTrailer, this.props.selectedTrailer)
      || !_.isEqual(nextProps.allEvents, this.props.allEvents)
      || !_.isEqual(nextProps.routes, this.props.routes)
      || !_.isEqual(nextState.eventClusters, this.state.eventClusters);

    return needUpdate;
  }*/

  componentDidUpdate(
    _prevProps: MapContainerProps,
    prevState: MapContainerState
  ) {
    let _ = require("lodash");
    if (!_.isEqual(prevState.center, this.state.center) && this.state.center) {
      this.mapRef.current!.panTo(this.state.center);
    }
  }

  handleMapChange = () => {
    if (!this.mapRef.current?.getZoom) {
      return;
    }
    this.setState({
      eventClusters: {
        zoom: this.mapRef.current?.getZoom(),
        data: this.updateClusters(),
      },
    });
  };

  onClick = () => {
    let windowList = this.state.openInfoWindows;
    if (windowList) {
      windowList.forEach((_window) => {
        ((_window as unknown) as { setState: (args: any) => void }).setState({
          showInfoWindow: false,
        });
      });
      windowList.length = 0;
    }
  };

  render() {
    const {
      trailers = [],
      loadingEvents = [],
      alarmEvents = [],
      armedEvents = [],
      warningEvents = [],
      normalEvents = [],
      parkingEvents = [],
      recognitionEvents = [],
      routes = [],
      openInfoWindows = [],
    } = this.props;

    const { showEventDetails, onMarkerClick, children, t } = this.props;
    const trailerMarkers = trailers.map((trailer) => (
      <TooltipTrailerMarker
        key={trailer.id}
        trailer={trailer}
        t={t}
        onMarkerClick={onMarkerClick}
      />
    ));
    const extendedWarningEvents = warningEvents.map((event) => event);
    const eventClusters = this.updateClusters();

    const polylines: React.ReactElement[] = [];
    let index = 0;
    const markers: React.ReactElement[] = [];
    let day = 0;

    /*
    * Commented out - to keep restarting at new day only.
    const parkingOffs = normalEvents
      .filter((event) => {
        return event.type === TrailerStates.truckParkingOff;
      })
      .map((event) => event.date); */

    routes.forEach((points) => {
      let previousPoints = [
        { lat: 0, lng: 0, fake: true },
        { lat: 1, lng: 1, fake: true },
      ];
      const differentRoutes = [];
      let pointsForPolyline: TrailerPosition[] = [];
      let index2 = 0;
      let miss = 0;

      let previousPointDate: Moment = moment(-1);

      points.forEach((point) => {
        let dx1 = previousPoints[0].lat - previousPoints[1].lat;
        let dy1 = previousPoints[0].lng - previousPoints[1].lng;

        let dx2 = previousPoints[1].lat - point.location.lat;
        let dy2 = previousPoints[1].lng - point.location.lng;

        let restartRoute = false;

        let pointDate = moment(point.date);

        if (
          !previousPoints[1].fake &&
          haversine_distance(previousPoints[1], point.location) > 20
        ) {
          let lostEvent = {
            id: Math.random().toString(),
            date: point.date,
            location: point.location,
            trailerId: trailers[0].id,
            type: TrailerStates.gpsSignalLost,
            interactions: [],
          };

          extendedWarningEvents.push(lostEvent);
          restartRoute = true;
        }

        restartRoute =
          restartRoute ||
          (previousPointDate && !pointDate.isSame(previousPointDate, "day"));

        /*
        * Commented out - to keep restarting at new day only.

        if (!restartRoute) {
          parkingOffs.forEach((parkingOffDate) => {
            restartRoute =
              restartRoute ||
              (moment(parkingOffDate).isBefore(previousPointDate) &&
                moment(parkingOffDate).isAfter(pointDate));
            if (restartRoute) {
            }
          });
        } */

        previousPointDate = pointDate;

        if (restartRoute) {
          differentRoutes.push(pointsForPolyline);

          let newLine: TrailerPosition[] = [];
          pointsForPolyline = newLine;
          previousPoints[0] = previousPoints[1];
          previousPoints[1] = {
            lat: point.location.lat,
            lng: point.location.lng,
            fake: false,
          };
          pointsForPolyline.push(point);
        } else {
          let angle1 = Math.atan(dx1 / dy1);
          let angle2 = Math.atan(dx2 / dy2);

          if (Math.abs(angle1 - angle2) > 0.02 || miss > 10) {
            previousPoints[0] = previousPoints[1];
            previousPoints[1] = {
              lat: point.location.lat,
              lng: point.location.lng,
              fake: false,
            };
            pointsForPolyline.push(point);
            miss = 0;
          } else miss++;
        }
      });

      if (pointsForPolyline.length > 0) differentRoutes.push(pointsForPolyline);

      differentRoutes.forEach((routePoints) => {
        let index3 = 0;
        day = (day + 1) % dayColors.length;

        let repeat = Math.round(7500 / routePoints.length)
          .toString()
          .concat("%");

        routePoints.forEach((point) => {
          if (
            index3 % Math.floor(points.length / 300) === 0 ||
            index3 === routePoints.length - 1
          ) {
            markers.push(
              <TooltipMarker
                id={index2}
                key={index2}
                speed={point.speed}
                time={point.date}
                lat={point.location.lat}
                lng={point.location.lng}
                t={t}
                signal={point.signal}
                markerColor={dayColors[day]}
                onMarkerClick={onMarkerClick}
              />
            );
          }
          index2++;
          index3++;
        });

        const lineSymbol = {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          strokeColor: "#000000",
          fillColor: dayColors[day],
          fillOpacity: 1,
          strokeOpacity: 1,
          strokeWeight: 1,
          scale: 4.5,
        };

        const iconSymbol = {
          icon: lineSymbol,
          offset: "100%",
          repeat: repeat,
        };

        const iconOptions = {
          icons: [iconSymbol],
          strokeColor: dayColors[day],
          zIndex: -1,
        };

        polylines.push(
          <Polyline
            key={index++}
            path={routePoints.map((point) => point.location)}
            options={iconOptions}
          />
        );
      });
    });

    return (
      <GoogleMap
        ref={this.mapRef}
        options={{
          fullscreenControl: false,
          gestureHandling: "greedy",
          styles: styles,
        }}
        defaultOptions={{
          fullscreenControl: false,
          gestureHandling: "greedy",
          styles: styles,
        }}
        // onClick={() => onMarkerClick && onMarkerClick(null, null) }
        onClick={this.onClick}
        defaultCenter={this.state.center}
        defaultZoom={7}
        onZoomChanged={this.handleMapChange}
      >
        {trailerMarkers}
        {polylines}
        {children}
        {eventClusters && (
          <EventGroupMarkers
            openInfoWindows={openInfoWindows}
            showEventDetails={(event: TrailerEvent) =>
              showEventDetails ? showEventDetails(event) : undefined
            }
            eventClusters={eventClusters}
            map={this}
          />
        )}
        <EventMarkers
          events={loadingEvents}
          showEventDetails={showEventDetails}
        />
        <EventMarkers
          events={alarmEvents}
          showEventDetails={showEventDetails}
        />
        <EventMarkers
          events={armedEvents}
          showEventDetails={showEventDetails}
        />
        <EventMarkers
          events={extendedWarningEvents}
          showEventDetails={showEventDetails}
        />
        <EventMarkers
          events={parkingEvents}
          showEventDetails={showEventDetails}
        />
        <EventMarkers
          events={recognitionEvents}
          showEventDetails={showEventDetails}
        />
        <EventMarkers
          events={normalEvents}
          showEventDetails={showEventDetails}
        />
        {markers}
      </GoogleMap>
    );
  }
}

export default MapContainer;
