import React from "react";

import DetailedEventRow from "@common/detailed-event-row";
import { resolveAlarm } from "@screens/trailers/actions";
import { TrailerEvent } from "../reducer";

interface DetailedEventsListProps {
  trailerEvents: TrailerEvent[];
  resolveAlarm?: ActionProp<typeof resolveAlarm>;
  showEventDetails: (event: TrailerEvent) => void;
  refreshList: () => void;
}

function DetailedEventsList(props: DetailedEventsListProps) {
  const { trailerEvents, showEventDetails, refreshList } = props;

  return (
    <>
      {trailerEvents.map((event) => (
        <DetailedEventRow
          key={event.id}
          event={event}
          interactions={event.interactions}
          showEventDetails={showEventDetails}
          refreshList={refreshList}
        />
      ))}
    </>
  );
}

export default React.memo(DetailedEventsList);
