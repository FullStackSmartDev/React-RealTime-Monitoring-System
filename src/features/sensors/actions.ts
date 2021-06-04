import { ThunkDispatch } from "redux-thunk";

import api from "@api/index";
import { SensorActionTypes } from "./constants";
import {
  SensorTypes,
  SensorEntry,
  SensorSettings,
  SensorId,
  Sensor,
  fromApiPropertyName,
} from "./reducer";
import { State } from "@store/index";
import { TrailerId } from "@screens/trailers/reducer";
import { TrailerStatesHelper } from "@screens/trailers/types";

export function fetchSensors(id: string) {
  return async (
    dispatch: ThunkDispatch<State, {}, Action>,
    getState: () => State
  ) => {
    dispatch({ type: SensorActionTypes.fetchSensorsSent });
    const { auth } = getState();
    try {
      const { data } = await api.fetchSensors({ id, auth });
      const sensors: SensorEntry = data.reduce(
        (accumulator: any, sensor: any) => {
          try {
            const parsed = parseSensor(sensor);
            return {
              ...accumulator,
              [`${fromApiPropertyName(sensor.kind)}`]: parsed,
            };
          } catch (error) {
            return accumulator;
          }
        },
        {}
      );
      dispatch({
        type: SensorActionTypes.fetchSensorsSuccess,
        payload: { id, sensors },
      });
    } catch (error) {
      dispatch({
        type: SensorActionTypes.fetchSensorsFail,
        error: true,
        payload: { error },
      });
    }
  };
}

export function fetchSensorEvents(id: TrailerId, sensorId: SensorId) {
  return async (
    dispatch: ThunkDispatch<State, {}, Action>,
    getState: () => State
  ) => {
    dispatch({ type: SensorActionTypes.fetchSensorEventsSent });
    const { auth } = getState();
    try {
      const { data } = await api.fetchSensorEvents({ sensorId, auth });

      const payload = data.reduce(
        (accumulator: any, element: any) => ({
          id,
          order: [...accumulator.order, element.id],
          alarms: {
            ...accumulator.alarms,
            [element.id]: {
              id: element.id,
              type: fromApiPropertyName(element.sensor_name),
              status: TrailerStatesHelper.from(element.kind),
              latitude: Number.parseFloat(element.latitude),
              longitude: Number.parseFloat(element.longitude),
              date: new Date(element.triggered_at),
              value: element.sensor_reading.value,
            },
          },
        }),
        { alarms: {}, order: [], id }
      );

      dispatch({
        type: SensorActionTypes.fetchSensorEventsSuccess,
        payload,
      });
    } catch (error) {
      dispatch({
        type: SensorActionTypes.fetchSensorEventsFail,
        error: true,
        payload: { error },
      });
    }
  };
}

// FIXME: ...
function displayError(error: any) {
  try {
    let errors = JSON.parse(error.request.response).errors.map(
      ({ title, detail }: any) => `${title}: ${detail}\n`
    );
    alert(errors);
  } catch (err) {
    alert("Unknown error");
  }
}

export function patchSensorSettings(
  sensorId: SensorId,
  settings: SensorSettings,
  id: TrailerId
) {
  return async (
    dispatch: ThunkDispatch<State, {}, Action>,
    getState: () => State
  ) => {
    const { auth } = getState();
    try {
      dispatch({ type: SensorActionTypes.patchSensorSettingsSent });
      const { data } = await api.patchSensorSettings({
        sensorId,
        settings,
        auth,
      });
      const updatedSensor = parseSensor(data.sensor);
      const updatedSettings = parseSettings(data, updatedSensor.type);
      dispatch({
        type: SensorActionTypes.fetchSensorSettingsSuccess,
        payload: {
          sensorId,
          settings: updatedSettings,
          sensor: updatedSensor,
          id: id,
        },
      });
      return Promise.resolve();
    } catch (error) {
      displayError(error);
      dispatch({
        type: SensorActionTypes.patchSensorSettingsFail,
        error: true,
        payload: { error },
      });

      return Promise.reject();
    }
  };
}

export function fetchSensorSettings(sensorId: SensorId, id: TrailerId) {
  return async (
    dispatch: ThunkDispatch<State, {}, Action>,
    getState: () => State
  ) => {
    const { auth } = getState();
    try {
      dispatch({ type: SensorActionTypes.fetchSensorSettingsSent });
      const { data } = await api.fetchSensorSettings({ sensorId, auth });
      const sensor = parseSensor(data);
      const settings = parseSettings(data.setting, sensor.type);
      dispatch({
        type: SensorActionTypes.fetchSensorSettingsSuccess,
        payload: { sensorId, settings, sensor, id },
      });
    } catch (error) {
      dispatch({
        type: SensorActionTypes.fetchSensorSettingsFail,
        error: true,
        payload: { error },
      });
    }
  };
}

function parseSettings(data: any, type: SensorTypes): SensorSettings {
  return {
    sensorType: type,
    settingId: data.id,
    alarmEnabled: data.alarm_enabled,
    alarmPrimaryValue: data.alarm_primary_value,
    alarmSecondaryValue: data.alarm_secondary_value,
    warningPrimaryValue: data.warning_primary_value,
    warningSecondaryValue: data.warning_secondary_value,
    emailAddresses: data.email_addresses.length ? data.email_addresses : [""],
    phoneNumbers: data.phone_numbers.length ? data.phone_numbers : [""],
    sendEmail: Boolean(data?.send_email),
    sendSms: Boolean(data?.send_sms),
  };
}

function parseSensor(data: any): Sensor {
  const type = fromApiPropertyName(data.kind);
  if (!type) {
    throw new Error("Unknown sensor type");
  }
  return {
    averageValue: data.average_value,
    id: data.id,
    type: type,
    latestReadAt: new Date(data.latest_read_at).toISOString(),
    status: data.status,
    value: data.value,
    percentage: data.value_percentage,
  };
}

export function updateSensorSettings(id: SensorId, settings: SensorSettings) {
  return {
    type: SensorActionTypes.updateSensorSettings,
    payload: { id, settings },
  };
}
