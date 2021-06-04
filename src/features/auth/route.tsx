import React from "react";
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom";

import { useTypedSelector } from "@store/index";
import { AuthState } from "./reducer";

export default function AuthRoute(props: RouteProps) {
  const auth = useTypedSelector<AuthState>((state) => state.auth);
  const { component = null, ...rest } = props;
  const Component = component as React.ComponentClass<RouteComponentProps>;

  return (
    <Route
      {...rest}
      render={(props) =>
        auth.token && Component ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
