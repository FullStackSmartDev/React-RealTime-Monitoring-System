import React, { Component } from "react";
import { TrailerEvent, TrailerEventCluster } from "@features/events/reducer";
import TooltipEventGroupMarker from "./tooltip-event-group-marker";
import { useTranslation } from "react-i18next";
import MapContainer from "./map-container";

interface EventsGroupProps {
  eventClusters: TrailerEventCluster[];
  selectedTime?: string;
  setEventTime?: (date: Date) => void;
  showEventDetails: (event: TrailerEvent) => void;
  refreshList?: () => void;
  openInfoWindows?: TooltipEventGroupMarker[] | Component[];
  map: MapContainer;
}

export default function (props: EventsGroupProps) {
  const { t } = useTranslation();

  return (
    <>
      {props.eventClusters
        ?.filter((eventCluster) => eventCluster.tail.length > 1)
        .map((eventCluster) => (
          <TooltipEventGroupMarker
            openInfoWindows={props.openInfoWindows}
            map={props.map}
            key={eventCluster.header.id}
            event={eventCluster.header}
            events={eventCluster.tail}
            selectedTime={props.selectedTime ?? ""}
            showEventDetails={props.showEventDetails}
            setEventTime={props.setEventTime || (() => undefined)}
            refreshList={props.refreshList || (() => undefined)}
            t={t}
          />
        ))}
    </>
  );
}
