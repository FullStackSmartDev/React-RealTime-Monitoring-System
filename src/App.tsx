import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import moment from "moment";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";

import ActionCableProvider from "./ws";
import AuthRoute from "@features/auth/route";
import Footer from "@ui/Footer/container";
import LocationRoute from "@screens/location/container";
import LoginScreen from "@features/auth/container";
import Navbar from "@ui/Navbar/container";
import PeopleRoute from "@screens/people/container";
import { DashboardRoute } from "@screens/dashboard/container";
import { store, persistor } from "./store";
import TrailerRoute from "@screens/trailers/container";
import Ui from "@ui/container";
import WhatsnewRoute from "@screens/whatsnew/container";
import { WHATS_NEW_CURRENT_VERSION } from "./config";
import UserRoute from "@screens/user/container";

import de from "date-fns/locale/de";
import enGB from "date-fns/locale/en-GB";
import "moment/locale/de";
import "moment/locale/en-gb";
import "moment/locale/pl";
import "./i18n";
import { TrailerObserverProvider } from "@features/trailers/Provider";

declare global {
  interface Action {
    type: string;
    payload?: any;
    error?: boolean;
  }

  // get any action creator (sync or async) and change its declaration
  type ActionProp<
    F extends (...args: any[]) => any, // F is the type of given function
    R = void // R is expected return type (void by default)
  > = (
    ...args: Parameters<F> // leave args as originally declared
  ) => R; // and change its return type to one given as R
}

export default function App() {
  require("dotenv").config();
  registerLocale("de", de);
  registerLocale("en", enGB);
  const { i18n } = useTranslation();
  const lang = moment.locale(i18n.language);
  setDefaultLocale(lang);
  const routerBasename = `${process.env.REACT_APP_ROUTER_BASENAME}`;
  return (
    <Provider store={store}>
      <TrailerObserverProvider>
        <ActionCableProvider>
          <PersistGate loading={null} persistor={persistor}>
            <Ui>
              <Router basename={routerBasename}>
                <Navbar />
                <Switch>
                  <Route path="/login/:magicLink?" component={LoginScreen} />
                  <AuthRoute path="/trailers/:id?" component={TrailerRoute} />
                  <AuthRoute path="/map/:id?" component={LocationRoute} />
                  <AuthRoute path="/whatsnew/" component={WhatsnewRoute} />
                  <AuthRoute path="/people/" component={PeopleRoute} />
                  <AuthRoute path="/dashboard/" component={DashboardRoute} />
                  <AuthRoute path="/user/" component={UserRoute} />
                  {checkShows() ? (
                    <Redirect from="/" to="/whatsnew" />
                  ) : (
                    <Redirect from="/" to="/trailers" />
                  )}
                </Switch>
              </Router>
              <Footer />
            </Ui>
          </PersistGate>
        </ActionCableProvider>
      </TrailerObserverProvider>
    </Provider>
  );
}

function checkShows() {
  const RULER_COOKIE = "whatsnewversion";
  let whatsnewCookieVersion = getCookie(RULER_COOKIE);
  let valueInCookie = parseInt(whatsnewCookieVersion as string, 10);

  let date = new Date(Date.now() + 14 * 86400000).toUTCString();

  if (!whatsnewCookieVersion || valueInCookie < WHATS_NEW_CURRENT_VERSION) {
    setCookie(RULER_COOKIE, WHATS_NEW_CURRENT_VERSION.toString(), {
      expires: date,
    });
    return true;
  }

  return false;
}

function getCookie(name: string) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(
  name: string,
  value: string,
  options: Record<string, any> = {}
) {
  options = {
    ...options,
  };

  if (options?.expires !== undefined) {
    if (options.expires.toUTCString) {
      options.expires = options.expires.toUTCString();
    }
  }

  let updatedCookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}
