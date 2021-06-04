import { SensorActionTypes } from "./constants";
import { TrailerId } from "@screens/trailers/reducer";
import createFetchingReducer from "@common/create-loading-reducer";
import { TrailerStates } from "@screens/trailers/types";

export enum SensorStates {
  alarm = "alarm",
  warning = "warning",
  ok = "ok",
}

export enum SensorTypes {
  trailerTemperature = "trailerTemperature",
  safewayBattery = "safewayBattery",
  tabletBattery = "tabletBattery",
  dataTransfer = "dataTransfer",
  carbonDioxideLevel = "carbonDioxideLevel",
  trailerBattery = "trailerBattery",
  dataTransferUE = "dataTransferUE",
}

export function isSensorType(object: any): object is SensorTypes {
  if (!object) {
    return false;
  }
  return Object.keys(SensorTypes).includes(object);
}
export function fromApiPropertyName(name?: string): SensorTypes | undefined {
  switch (name) {
    case "trailer_temperature":
      return SensorTypes.trailerTemperature;
    case "safeway_battery":
      return SensorTypes.safewayBattery;
    case "driver_panel_battery":
      return SensorTypes.tabletBattery;
    case "data_transfer":
      return SensorTypes.dataTransfer;
    case "co2":
      return SensorTypes.carbonDioxideLevel;
    case "truck_battery":
      return SensorTypes.trailerBattery;
    case "data_transfer_ue":
      return SensorTypes.dataTransferUE;
  }
  return undefined;
}
export function toApiPropertyName(name: SensorTypes) {
  switch (name) {
    case SensorTypes.trailerTemperature:
      return "trailer_temperature";
    case SensorTypes.safewayBattery:
      return "safeway_battery";
    case SensorTypes.tabletBattery:
      return "driver_panel_battery";
    case SensorTypes.dataTransfer:
      return "data_transfer";
    case SensorTypes.carbonDioxideLevel:
      return "co2";
    case SensorTypes.trailerBattery:
      return "truck_battery";
    case SensorTypes.dataTransferUE:
      return "data_transfer_ue";
  }
}
export function toReadableName(name: SensorTypes) {
  switch (name) {
    case SensorTypes.trailerTemperature:
      return "SensorTypes.trailerTemperature";
    case SensorTypes.safewayBattery:
      return "SensorTypes.safewayBattery";
    case SensorTypes.tabletBattery:
      return "SensorTypes.tabletBattery";
    case SensorTypes.carbonDioxideLevel:
      return "SensorTypes.carbonDioxideLevel";
    case SensorTypes.dataTransfer:
      return "SensorTypes.dataTransfer";
    case SensorTypes.trailerBattery:
      return "SensorTypes.trailerBattery";
    case SensorTypes.dataTransferUE:
      return "SensorTypes.dataTransferUE";
  }
}
export function getSensorUnit(name: SensorTypes) {
  switch (name) {
    case SensorTypes.trailerTemperature:
      return "\u2103";
    case SensorTypes.safewayBattery:
    case SensorTypes.tabletBattery:
    case SensorTypes.carbonDioxideLevel:
    case SensorTypes.trailerBattery:
      return "%";
    case SensorTypes.dataTransfer:
      return "GB";
    case SensorTypes.dataTransferUE:
      return "GB";
    default:
      return "";
  }
}

export type SensorId = string;

export interface Sensor {
  averageValue: string | number;
  id: SensorId;
  type: SensorTypes;
  latestReadAt: string;
  status: SensorStates;
  value: string | number;
  percentage: number;
}

export interface SensorSettings {
  sensorType: SensorTypes;
  settingId: string;
  alarmEnabled: boolean;
  alarmPrimaryValue: number;
  alarmSecondaryValue: number;
  warningPrimaryValue: number;
  warningSecondaryValue: number;
  sendSms: boolean;
  sendEmail: boolean;
  emailAddresses: string[];
  phoneNumbers: string[];
}

export type SensorEntry = { [key in SensorTypes]: Sensor };
export type SensorSettingsEntry = { [key in SensorTypes]?: SensorSettings };

export type SensorEventId = string;

export interface SensorEvent {
  id: SensorEventId;
  type: SensorTypes;
  status: TrailerStates;
  latitude: number;
  longitude: number;
  date: Date;
  value: number;
}

export interface SensorsState {
  order: { [key in TrailerId]?: SensorEventId[] };
  alarms: { [key in SensorEventId]?: SensorEvent };
  sensors: { [key in TrailerId]?: SensorEntry };
  settings: { [key in TrailerId]?: SensorSettings };
  loading: boolean;
  error: Error | null;
}

const initialState: SensorsState = {
  order: {},
  alarms: {},
  sensors: {},
  settings: {},
  loading: true,
  error: null,
};

function sensor(
  state = initialState,
  action: Action = { type: "" }
): SensorsState {
  switch (action.type) {
    case SensorActionTypes.patchSensorSettingsSuccess:
      return {
        ...state,
        settings: {
          [action.payload.id]: action.payload.settings,
        },
      };
    case SensorActionTypes.fetchSensorSettingsSuccess: {
      const {
        sensorId,
        settings,
        sensor,
        id,
      }: {
        sensorId: SensorId;
        sensor: Sensor;
        settings: SensorSettings;
        id: TrailerId;
      } = action.payload;

      const trailerSensors = state.sensors[id];

      return {
        ...state,
        sensors: {
          ...state.sensors,
          [id]: {
            ...(trailerSensors || ({} as SensorEntry)),
            [sensor.type]: sensor,
          },
        },
        settings: {
          ...state.settings,
          [sensorId]: settings,
        },
      };
    }
    case SensorActionTypes.fetchSensorEventsSuccess: {
      const {
        id,
        alarms,
        order,
      }: {
        id: TrailerId;
        alarms: { [key in SensorEventId]: SensorEvent };
        order: SensorEventId[];
      } = action.payload;
      return {
        ...state,
        alarms: { ...state.alarms, ...alarms },
        order: { ...state.order, [id]: order },
      };
    }
    case SensorActionTypes.fetchSensorsSuccess: {
      const {
        id,
        sensors,
      }: { id: TrailerId; sensors: SensorEntry; date: string } = action.payload;
      return {
        ...state,
        sensors: {
          ...state.sensors,
          [id]: sensors,
        },
      };
    }
    default:
      return state;
  }
}

export default createFetchingReducer(
  sensor,
  SensorActionTypes.fetchSensorsSent,
  SensorActionTypes.fetchSensorsSuccess,
  SensorActionTypes.fetchSensorsFail
);
