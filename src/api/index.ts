import axios, { AxiosRequestConfig } from "axios";
import moment from "moment";

import camelToSnake from "@utils/camel-to-snake";
import handleJsonApi from "@utils/json-api";
import { AuthState } from "@features/auth/reducer";
import { MonitoringCameras } from "@features/monitoring/types";
import { TrailerId } from "@screens/trailers/reducer";
import { SensorId, SensorSettings } from "@features/sensors/reducer";
import {
  TrailerStates,
  TrailerNote,
  TrailerStatesHelper,
} from "@screens/trailers/types";
import { TrailerEventId } from "@features/events/reducer";

const baseURL = `https://${process.env.REACT_APP_BACKEND_HOST}/api/v1`;
const defaultTransforms = axios.defaults.transformResponse || ((u) => u);
const defaultTransformsArray = Array.isArray(defaultTransforms)
  ? defaultTransforms
  : [defaultTransforms];
const remote = axios.create({
  baseURL,
  transformResponse: [...defaultTransformsArray, handleJsonApi],
});

const URL = {
  login: "/auth/sign_in",
  logout: "/auth/sign_out",
  changePassword: "/auth/change_password",
  trailers: "/trailers",
  magicLinkAuth(magicLink: string) {
    return `/access_links/${magicLink}`;
  },
  updateNote(id: string) {
    return `/trailers/${id}/update_note`;
  },
  updateStatus(id: string) {
    return `/trailers/${id}/update_status`;
  },
  readStatus(id: string) {
    return `/trailers/${id}/read_status`;
  },
  events(id: string, params: string = "") {
    return `/trailers/${id}/events?${params}`;
  },
  routes(id: string, params: string = "") {
    return `/trailers/${id}/route_log?${params}`;
  },
  sensors(id: string, params: string = "") {
    return `/trailers/${id}/sensors?${params}`;
  },
  sensorSettings(sensorId: string) {
    return `/sensors/${sensorId}`;
  },
  sensorSettingsPatch(sensorId: string) {
    return `/sensor_settings/${sensorId}`;
  },
  sensorEvents(sensorId: string) {
    return `/sensors/${sensorId}/events`;
  },
  media(id: string, params: string = "") {
    return `/trailers/${id}/media?${params}`;
  },
  mediaRequest(id: string) {
    return `/trailers/${id}/media/request_media`;
  },
  resolveAlarm(id: string) {
    return `/events/${id}/resolve_alarm`;
  },
};

type RequestOptions = AxiosRequestConfig & { [key: string]: any };

export interface EventsQuery {
  from?: Date;
  to?: Date;
  kinds?: Partial<{ [key in TrailerStates]: boolean }>;
  limit?: number;
}

export interface RoutesQuery {
  from?: Date;
  to?: Date;
}

export interface MediaListRequestQuery {
  from: Date;
  to: Date;
}

export interface MediaRequestQuery {
  time: Date;
  type: "photo" | "video";
  camera: MonitoringCameras;
}

export default {
  getParams(args: { [key: string]: string | undefined }): URLSearchParams {
    const params = Object.entries(args).reduce(
      (params, [key, value]) => (value ? { ...params, [key]: value } : params),
      {}
    );
    const search = new URLSearchParams(params);
    return search;
  },

  postHeaders(auth: AuthState) {
    return {
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
      "access-token": auth.token,
      client: auth.client,
      uid: auth.uid,
    };
  },

  getHeaders(auth: AuthState) {
    return this.postHeaders(auth);
  },

  async post(
    url: string,
    params: URLSearchParams | {} | null,
    auth: AuthState,
    config: RequestOptions = {}
  ) {
    const headers = this.postHeaders(auth);
    return await remote.post(url, params, { ...config, headers });
  },

  async get(url: string, auth: AuthState, config: RequestOptions = {}) {
    const headers = this.getHeaders(auth);
    return await remote.get(url, { ...config, headers });
  },

  async patch(
    url: string,
    params: Object,
    auth: AuthState,
    config: RequestOptions = {}
  ) {
    const headers = this.getHeaders(auth);
    return await remote.patch(url, params, { ...config, headers });
  },

  async put(
    url: string,
    params: Object,
    auth: AuthState,
    config: RequestOptions = {}
  ) {
    const headers = this.getHeaders(auth);
    return await remote.put(url, params, { ...config, headers });
  },

  async del(url: string, auth: AuthState, config: RequestOptions = {}) {
    const headers = this.getHeaders(auth);
    return await remote.delete(url, { ...config, headers });
  },

  async magicLogin(params: { magicLink: string }) {
    return await remote.post(URL.magicLinkAuth(params.magicLink));
  },

  async login(params: { email: string; password: string }) {
    return await remote.post(URL.login, this.getParams(params));
  },

  async logout({ auth }: { auth: AuthState }) {
    return await this.del(URL.logout, auth);
  },

  async fetchTrailers({ auth }: { auth: AuthState }) {
    return await this.get(URL.trailers, auth);
  },

  async fetchEvents({
    id,
    filter,
    auth,
  }: {
    id: TrailerId;
    filter: EventsQuery;
    auth: AuthState;
  }) {
    const from =
      filter.from !== undefined
        ? moment(filter.from).startOf("day").toISOString()
        : undefined;

    const to =
      filter.to !== undefined
        ? moment(filter.to).endOf("day").toISOString()
        : undefined;

    const filters = Object.entries(filter.kinds || {})
      .reduce<Array<String>>((keys, [key, val]) => {
        if (val && TrailerStatesHelper.isTrailerState(key)) {
          return [...keys, TrailerStatesHelper.toApiParam(key)];
        }
        return keys;
      }, [])
      .join(",");

    const params = this.getParams({
      "filter[date_from]": from,
      "filter[date_to]": to,
      "filter[kinds]": camelToSnake(filters),
      "page[size]":
        typeof filter.limit === "undefined" ? undefined : `${filter.limit}`,
    }).toString();

    return await this.get(URL.events(id, params), auth);
  },

  async fetchRoutes({
    id,
    filter,
    auth,
  }: {
    id: TrailerId;
    filter: RoutesQuery;
    auth: AuthState;
  }) {
    const from =
      filter.from !== undefined
        ? moment(filter.from).startOf("day").toISOString()
        : undefined;

    const to =
      filter.to !== undefined
        ? moment(filter.to).endOf("day").toISOString()
        : undefined;

    const params = this.getParams({
      "filter[date_from]": from,
      "filter[date_to]": to,
    }).toString();

    return await this.get(URL.routes(id, params), auth);
  },

  async fetchSensorEvents({
    sensorId,
    auth,
  }: {
    sensorId: SensorId;
    auth: AuthState;
  }) {
    return await this.get(URL.sensorEvents(sensorId), auth);
  },

  async fetchSensors({ id, auth }: { id: TrailerId; auth: AuthState }) {
    return await this.get(URL.sensors(id), auth);
  },

  async fetchSensorSettings({
    sensorId,
    auth,
  }: {
    sensorId: SensorId;
    auth: AuthState;
  }) {
    return await this.get(URL.sensorSettings(sensorId), auth);
  },

  async updateTrailerNote({
    id,
    note,
    auth,
  }: {
    id: TrailerId;
    note: TrailerNote;
    auth: AuthState;
  }) {
    const params = {
      data: {
        type: "trailer",
        id: id,
        attributes: {
          note: note,
        },
      },
    };
    return await this.patch(URL.updateNote(id), params, auth);
  },

  async setTrailerState({
    id,
    status,
    auth,
  }: {
    id: TrailerId;
    status: TrailerStates;
    auth: AuthState;
  }) {
    const params = {
      data: {
        type: "trailer",
        id: id,
        attributes: {
          status: TrailerStatesHelper.toApiParam(status),
        },
      },
    };
    return await this.patch(URL.updateStatus(id), params, auth);
  },

  async readTrailerState({ id, auth }: { id: TrailerId; auth: AuthState }) {
    const params = {
      data: {
        type: "trailer",
        id: id,
      },
    };
    return await this.patch(URL.readStatus(id), params, auth);
  },

  async patchSensorSettings({
    sensorId,
    settings,
    auth,
  }: {
    sensorId: SensorId;
    settings: SensorSettings;
    auth: AuthState;
  }) {
    const params = {
      data: {
        id: settings.settingId,
        type: "sensor_settings",
        attributes: {
          alarm_enabled: settings.alarmEnabled,
          alarm_primary_value: settings.alarmPrimaryValue,
          alarm_secondary_value: settings.alarmSecondaryValue,
          warning_primary_value: settings.warningPrimaryValue,
          warning_secondary_value: settings.warningSecondaryValue,
          send_sms: settings.sendSms,
          send_email: settings.sendEmail,
          email_addresses: settings.emailAddresses.filter((val) => val),
          phone_numbers: settings.phoneNumbers.filter((val) => val),
        },
      },
    };
    return await this.patch(URL.sensorSettingsPatch(sensorId), params, auth);
  },

  async changePassword({
    currentPassword,
    newPassword,
    auth,
  }: {
    currentPassword: string;
    newPassword: string;
    auth: AuthState;
  }) {
    const params = {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPassword,
    };
    return await this.put(URL.changePassword, params, auth);
  },

  async resolveAlarm({ id, auth }: { id: TrailerEventId; auth: AuthState }) {
    const params = {};

    return await this.patch(URL.resolveAlarm(id), params, auth);
  },

  async fetchMedia({
    id,
    query,
    auth,
  }: {
    id: TrailerId;
    query: MediaListRequestQuery;
    auth: AuthState;
  }) {
    const { from, to } = query;
    const params = this.getParams({
      "page[size]": "10000",
      "filter[date_from]": from.toISOString(),
      "filter[date_to]": to.toISOString(),
    }).toString();
    return await this.get(URL.media(id, params), auth);
  },

  async requestMedia({
    id,
    query,
    auth,
  }: {
    id: TrailerId;
    query: MediaRequestQuery;
    auth: AuthState;
  }) {
    const params = {
      data: {
        id,
        type: "trailer",
        attributes: {
          requested_time: query.time.toISOString(),
          kind: query.type,
          camera: camelToSnake(query.camera),
        },
      },
    };
    return await this.post(URL.mediaRequest(id), params, auth);
  },
};
