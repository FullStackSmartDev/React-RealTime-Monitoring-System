import React, { ReactNode } from "react";
import { RouteProps, Route, Redirect } from "react-router";

import { TrailerId, Trailer } from "@screens/trailers/reducer";
import { State } from "@store/index";
import { useSelector } from "react-redux";

export default function RedirectToTrailer(
  props: {
    active: TrailerId | null;
    trailers: Trailer[];
    children: ReactNode;
  } & RouteProps
) {
  const selectedTrailer = useSelector((state: State) => state.trailers.active);
  let id = props.active;
  if (!id) {
    id = selectedTrailer;
  }
  if (!id) {
    id = props.trailers.length !== 0 ? props.trailers[0].id : null;
  }

  return (
    <Route
      render={(routeProps) => {
        if (id && !routeProps.match.params.id) {
          return <Redirect to={`${routeProps.match.url}/${id}`} />;
        }
        return props.children;
      }}
    />
  );
}
