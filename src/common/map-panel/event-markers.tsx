import React from "react";
import { TrailerEvent } from "@features/events/reducer";
import TooltipEventMarker from "./tooltip-event-marker";
import { useTranslation } from "react-i18next";

export default function (props: {
  events: TrailerEvent[];
  showEventDetails?: (event: TrailerEvent) => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      {props.events.map((event) => (
        <TooltipEventMarker
          key={event.id}
          event={event}
          t={t}
          showEventDetails={props.showEventDetails}
        />
      ))}
    </>
  );
}
