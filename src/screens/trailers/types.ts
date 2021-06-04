import { TrailerEventTypeCategory } from "@features/events/types";

export enum SternKraftColours {
  STERNKRAFT_YELLOW = "#dccd0a",
  STERNKRAFT_RED = "#d0021b",
  STERNKRAFT_GREEN = "#7ed321",
  STERNKRAFT_BLUE = "#2a40c2",
  STERNKRAFT_GREY = "#a0a0a0",
  STERNKRAFT_WHITE = "#ebf3fd",
}

export enum TrailerStates {
  startLoading = "TrailerStates.startLoading",
  endLoading = "TrailerStates.endLoading",
  alarm = "TrailerStates.alarm",
  silenced = "TrailerStates.silenced",
  off = "TrailerStates.off",
  resolved = "TrailerStates.resolved",
  armed = "TrailerStates.armed",
  disarmed = "TrailerStates.disarmed",
  quiet = "TrailerStates.quiet",
  emergency = "TrailerStates.emergency",
  warning = "TrailerStates.warning",
  ok = "TrailerStates.ok",
  unknown = "TrailerStates.unknown",
  truckEngineOn = "TrailerStates.truckEngineOn", // ADDED https://www.wrike.com/open.htm?id=445612989
  truckEngineOff = "TrailerStates.truckEngineOff", // END
  truckParkingOn = "TrailerStates.truckParkingOn", // ADDED https://www.wrike.com/open.htm?id=485426010
  truckParkingOff = "TrailerStates.truckParkingOff", // END
  networkOn = "TrailerStates.networkOn",
  networkOff = "TrailerStates.networkOff",
  truckDisconnected = "TrailerStates.truckDisconnected", // ADDED https://www.wrike.com/open.htm?id=450195737
  truckConnected = "TrailerStates.truckConnected", //
  shutdownPending = "TrailerStates.shutdownPending", //
  shutdownImmediate = "TrailerStates.shutdownImmediate", //
  truckBatteryLow = "TrailerStates.truckBatteryLow", //
  truckBatteryNormal = "TrailerStates.truckBatteryNormal", // END
  gpsSignalLost = "TrailerStates.gpsSignalLost",
  motionDetected = "TrailerStates.motionDetected",
  motionCleared = "TrailerStates.motionCleared",
  humanDetected = "TrailerStates.humanDetected",
  humanCleared = "TrailerStates.humanCleared",
  doorOpened = "TrailerStates.doorOpened",
  doorClosed = "TrailerStates.doorClosed",
  jammingDetected = "TrailerStates.jammingDetected",
  jammingOff = "TrailerStates.jammingOff",
  systemTurnedOn = "TrailerStates.systemTurnedOn",
}

export enum TrailerPermissions {
  alarmControl = "alarmControl", //kontrola alarmu
  alarmResolveControl = "alarmResolveControl", //kontrola rozwiązywania alarmów
  currentPosition = "currentPosition", //aktualna pozycja
  eventLogAccess = "eventLogAccess", //dziennik zdarzeń
  loadInModeControl = "loadInModeControl", //kontrola trybu ładowania
  monitoringAccess = "monitoringAccess", //dostęp do monitoringu
  photoDownload = "photoDownload", //pobieranie zdjęć
  routeAccess = "routeAccess", //dostęp do tras
  sensorAccess = "sensorAccess", //czujniki
  systemArmControl = "systemArmControl", //kontrola uzbrajania systemu
  videoDownload = "videoDownload", //pobieranie wideo
}

export type TrailerNote = string;

export const TrailerStatesHelper = {
  isTrailerState: function (value: any): value is TrailerStates {
    if (!value) {
      return false;
    }
    return Object.values(TrailerStates).includes(value);
  },

  toReadableName: function (name: TrailerStates = TrailerStates.unknown) {
    switch (name) {
      case TrailerStates.startLoading:
        return "TrailerStates.startLoading";
      case TrailerStates.endLoading:
        return "TrailerStates.endLoading";
      case TrailerStates.resolved:
        return "TrailerStates.resolved";
      case TrailerStates.alarm:
        return "TrailerStates.alarm";
      case TrailerStates.silenced:
        return "TrailerStates.silenced";
      case TrailerStates.off:
        return "TrailerStates.off";
      case TrailerStates.armed:
        return "TrailerStates.armed";
      case TrailerStates.disarmed:
        return "TrailerStates.disarmed";
      case TrailerStates.quiet:
        return "TrailerStates.quiet";
      case TrailerStates.emergency:
        return "TrailerStates.emergency";
      case TrailerStates.warning:
        return "TrailerStates.warning";
      case TrailerStates.ok:
        return "TrailerStates.ok";
      case TrailerStates.truckEngineOn:
        return "TrailerStates.truckEngineOn"; // ADDED https://www.wrike.com/open.htm?id=445612989
      case TrailerStates.truckEngineOff:
        return "TrailerStates.truckEngineOff"; // END
      case TrailerStates.truckParkingOn:
        return "TrailerStates.truckParkingOn"; // ADDED https://www.wrike.com/open.htm?id=445612989
      case TrailerStates.truckParkingOff:
        return "TrailerStates.truckParkingOff"; // END
      case TrailerStates.networkOn:
        return "TrailerStates.networkOn";
      case TrailerStates.networkOff:
        return "TrailerStates.networkOff";
      case TrailerStates.truckDisconnected:
        return "TrailerStates.truckDisconnected"; // ADDED https://www.wrike.com/open.htm?id=450195737
      case TrailerStates.truckConnected:
        return "TrailerStates.truckConnected"; //
      case TrailerStates.shutdownPending:
        return "TrailerStates.shutdownPending"; //
      case TrailerStates.shutdownImmediate:
        return "TrailerStates.shutdownImmediate"; //
      case TrailerStates.truckBatteryLow:
        return "TrailerStates.truckBatteryLow"; //
      case TrailerStates.truckBatteryNormal:
        return "TrailerStates.truckBatteryNormal"; // END
      case TrailerStates.gpsSignalLost:
        return "TrailerStates.gpsSignalLost";
      case TrailerStates.motionDetected:
        return "TrailerStates.motionDetected";
      case TrailerStates.motionCleared:
        return "TrailerStates.motionCleared";
      case TrailerStates.humanDetected:
        return "TrailerStates.humanDetected";
      case TrailerStates.humanCleared:
        return "TrailerStates.humanCleared";
      case TrailerStates.doorOpened:
        return "TrailerStates.doorOpened";
      case TrailerStates.doorClosed:
        return "TrailerStates.doorClosed";
      case TrailerStates.jammingDetected:
        return "TrailerStates.jammingDetected";
      case TrailerStates.jammingOff:
        return "TrailerStates.jammingOff";
      case TrailerStates.systemTurnedOn:
        return "TrailerStates.systemTurnedOn";
      default:
        return "TrailerStates.unknown";
    }
  },

  getCancellingPair: function (
    name: TrailerStates = TrailerStates.unknown
  ): TrailerStates[] {
    let cancellingStates: TrailerStates[] = [];

    switch (name) {
      case TrailerStates.startLoading:
        cancellingStates.push(TrailerStates.endLoading);
        return cancellingStates;
      case TrailerStates.endLoading:
        cancellingStates.push(TrailerStates.startLoading);
        return cancellingStates;

      case TrailerStates.truckBatteryLow:
        cancellingStates.push(TrailerStates.truckBatteryNormal);
        return cancellingStates;
      case TrailerStates.truckBatteryNormal:
        cancellingStates.push(TrailerStates.truckBatteryLow);
        return cancellingStates;

      case TrailerStates.truckDisconnected:
        cancellingStates.push(TrailerStates.truckConnected);
        return cancellingStates;
      case TrailerStates.truckConnected:
        cancellingStates.push(TrailerStates.truckDisconnected);
        return cancellingStates;

      case TrailerStates.networkOff:
        cancellingStates.push(TrailerStates.networkOn);
        return cancellingStates;
      case TrailerStates.networkOn:
        cancellingStates.push(TrailerStates.networkOff);
        return cancellingStates;

      case TrailerStates.truckEngineOff:
        cancellingStates.push(TrailerStates.truckEngineOn);
        return cancellingStates;
      case TrailerStates.truckEngineOn:
        cancellingStates.push(TrailerStates.truckEngineOff);
        return cancellingStates;

      case TrailerStates.jammingDetected:
        cancellingStates.push(TrailerStates.jammingOff);
        return cancellingStates;

      default:
        return cancellingStates;
    }
  },

  toCategory: function (
    name: TrailerStates = TrailerStates.unknown
  ): TrailerEventTypeCategory {
    switch (name) {
      case TrailerStates.startLoading:
      case TrailerStates.endLoading:
        return TrailerEventTypeCategory.loading;
      case TrailerStates.alarm:
      case TrailerStates.silenced:
      case TrailerStates.off:
      case TrailerStates.resolved:
      case TrailerStates.quiet:
      case TrailerStates.emergency:
      case TrailerStates.jammingDetected:
      case TrailerStates.shutdownImmediate:
        return TrailerEventTypeCategory.alarm;
      case TrailerStates.armed:
      case TrailerStates.disarmed:
        return TrailerEventTypeCategory.armed;
      case TrailerStates.warning:
      case TrailerStates.shutdownPending:
      case TrailerStates.truckBatteryLow:
      case TrailerStates.truckDisconnected:
      case TrailerStates.gpsSignalLost:
        return TrailerEventTypeCategory.warning;
      case TrailerStates.networkOff:
      case TrailerStates.networkOn:
        return TrailerEventTypeCategory.network;
      case TrailerStates.truckParkingOn:
        return TrailerEventTypeCategory.parking;
      case TrailerStates.truckParkingOff:
      case TrailerStates.truckEngineOff:
      case TrailerStates.truckEngineOn:
      case TrailerStates.truckConnected:
      case TrailerStates.truckBatteryNormal:
      case TrailerStates.jammingOff:
      case TrailerStates.systemTurnedOn:
        return TrailerEventTypeCategory.normal;
      case TrailerStates.motionDetected:
      case TrailerStates.motionCleared:
      case TrailerStates.humanDetected:
      case TrailerStates.humanCleared:
      case TrailerStates.doorOpened:
      case TrailerStates.doorClosed:
        return TrailerEventTypeCategory.recognition;
      case TrailerStates.ok:
      default:
        return TrailerEventTypeCategory.unknown;
    }
  },

  toTrailerMarkerCategory: function (
    name: TrailerStates = TrailerStates.unknown
  ): TrailerEventTypeCategory {
    switch (name) {
      case TrailerStates.startLoading:
      case TrailerStates.endLoading:
        return TrailerEventTypeCategory.loading;
      case TrailerStates.alarm:
      case TrailerStates.silenced:
      case TrailerStates.off:
      case TrailerStates.resolved:
      case TrailerStates.quiet:
      case TrailerStates.emergency:
      case TrailerStates.jammingDetected:
      case TrailerStates.shutdownImmediate:
      case TrailerStates.networkOff:
        return TrailerEventTypeCategory.alarm;
      case TrailerStates.armed:
      case TrailerStates.disarmed:
        return TrailerEventTypeCategory.armed;
      case TrailerStates.warning:
      case TrailerStates.shutdownPending:
      case TrailerStates.truckBatteryLow:
      case TrailerStates.truckDisconnected:
      case TrailerStates.gpsSignalLost:
        return TrailerEventTypeCategory.warning;
      case TrailerStates.truckParkingOn:
        return TrailerEventTypeCategory.parking;
      case TrailerStates.truckParkingOff:
      case TrailerStates.truckEngineOff:
      case TrailerStates.truckEngineOn:
      case TrailerStates.truckConnected:
      case TrailerStates.truckBatteryNormal:
      case TrailerStates.jammingOff:
      case TrailerStates.systemTurnedOn:
      case TrailerStates.networkOn:
        return TrailerEventTypeCategory.normal;
      case TrailerStates.motionDetected:
      case TrailerStates.motionCleared:
      case TrailerStates.humanDetected:
      case TrailerStates.humanCleared:
      case TrailerStates.doorOpened:
      case TrailerStates.doorClosed:
        return TrailerEventTypeCategory.recognition;
      case TrailerStates.ok:
      default:
        return TrailerEventTypeCategory.unknown;
    }
  },

  toColor: function (name: TrailerStates = TrailerStates.unknown) {
    switch (name) {
      case TrailerStates.startLoading:
      case TrailerStates.endLoading:
        return "#606fff";
      case TrailerStates.shutdownImmediate:
      case TrailerStates.alarm:
      case TrailerStates.silenced:
      case TrailerStates.off:
      case TrailerStates.resolved:
      case TrailerStates.quiet:
      case TrailerStates.emergency:
      case TrailerStates.humanDetected:
      case TrailerStates.motionDetected:
      case TrailerStates.jammingDetected:
      case TrailerStates.doorOpened:
      case TrailerStates.networkOff:
        return SternKraftColours.STERNKRAFT_RED;
      case TrailerStates.armed:
      case TrailerStates.disarmed:
        return SternKraftColours.STERNKRAFT_GREEN;
      case TrailerStates.truckParkingOff:
      case TrailerStates.truckParkingOn:
        return SternKraftColours.STERNKRAFT_BLUE;
      case TrailerStates.shutdownPending:
      case TrailerStates.truckBatteryLow:
      case TrailerStates.truckDisconnected:
      case TrailerStates.gpsSignalLost:
      case TrailerStates.warning:
      case TrailerStates.motionCleared:
      case TrailerStates.humanCleared:
        return SternKraftColours.STERNKRAFT_YELLOW;
      case TrailerStates.ok:
      case TrailerStates.truckEngineOff:
      case TrailerStates.truckEngineOn:
      case TrailerStates.truckConnected:
      case TrailerStates.truckBatteryNormal:
      case TrailerStates.doorClosed:
      case TrailerStates.systemTurnedOn:
      case TrailerStates.jammingOff:
      case TrailerStates.networkOn:
      default:
        return SternKraftColours.STERNKRAFT_GREY;
    }
  },

  from: function (object: any) {
    switch (object) {
      case "start_loading":
      case 0:
        return TrailerStates.startLoading;
      case "end_loading":
      case 1:
        return TrailerStates.endLoading;
      case "alarm":
      case 2:
        return TrailerStates.alarm;
      case "alarm_silenced":
      case 3:
        return TrailerStates.silenced;
      case "alarm_resolved":
        return TrailerStates.resolved;
      case "alarm_off":
      case 4:
        return TrailerStates.off;
      case "armed":
      case 5:
        return TrailerStates.armed;
      case "disarmed":
      case 6:
        return TrailerStates.disarmed;
      case "quiet_alarm":
      case 9:
        return TrailerStates.quiet;
      case "emergency_call":
      case 8:
        return TrailerStates.emergency;
      case "warning":
      case 7:
        return TrailerStates.warning;
      case "truck_disconnected":
      case 11:
        return TrailerStates.truckDisconnected;
      case "truck_connected":
      case 12:
        return TrailerStates.truckConnected;
      case "shutdown_pending":
      case 13:
        return TrailerStates.shutdownPending;
      case "shutdown_immediate":
      case 14:
        return TrailerStates.shutdownImmediate;
      case "truck_battery_low":
      case 15:
        return TrailerStates.truckBatteryLow;
      case "ok":
        return TrailerStates.ok;
      case "truck_battery_normal":
      case 16:
        return TrailerStates.truckBatteryNormal;
      case "engine_off":
      case 17:
        return TrailerStates.truckEngineOff;
      case "engine_on":
      case 18:
        return TrailerStates.truckEngineOn;
      case "parking_on":
      case 19:
        return TrailerStates.truckParkingOn;
      case "parking_off":
      case 20:
        return TrailerStates.truckParkingOff;
      case "motion_detected":
      case 21:
        return TrailerStates.motionDetected;
      case "stagnation":
      case 22:
        return TrailerStates.motionCleared;
      case "human_detected":
      case 23:
        return TrailerStates.humanDetected;
      case "human_cleared":
      case 24:
        return TrailerStates.humanCleared;
      case "door_opened":
      case 25:
        return TrailerStates.doorOpened;
      case "door_closed":
      case 26:
        return TrailerStates.doorClosed;
      case "network_off":
      case 29:
        return TrailerStates.networkOff;
      case "network_on":
      case 30:
        return TrailerStates.networkOn;
      case 31:
      case "jamming_detected":
        return TrailerStates.jammingDetected;
      case 32:
      case "jamming_off":
        return TrailerStates.jammingOff;
      case "system_turned_on":
      case 99:
        return TrailerStates.systemTurnedOn;

      case "gps_lost":
      case 100: // Codes for Front-end originated events have ids starting with 100.
        return TrailerStates.gpsSignalLost;
      default:
        return TrailerStates.unknown;
    }
  },

  toApiParam: function (state: TrailerStates = TrailerStates.unknown) {
    switch (state) {
      case TrailerStates.startLoading:
        return "start_loading";
      case TrailerStates.endLoading:
        return "end_loading";
      case TrailerStates.alarm:
        return "alarm";
      case TrailerStates.silenced:
        return "alarm_silenced";
      case TrailerStates.off:
        return "alarm_off";
      case TrailerStates.resolved:
        return "alarm_resolved";
      case TrailerStates.armed:
        return "armed";
      case TrailerStates.disarmed:
        return "disarmed";
      case TrailerStates.quiet:
        return "quiet_alarm";
      case TrailerStates.emergency:
        return "emergency_call";
      case TrailerStates.warning:
        return "warning";
      case TrailerStates.truckEngineOn:
        return "engine_on";
      case TrailerStates.truckEngineOff:
        return "engine_off";
      case TrailerStates.truckParkingOn:
        return "parking_on";
      case TrailerStates.truckParkingOff:
        return "parking_off";
      case TrailerStates.shutdownImmediate:
        return "shutdown_immediate";
      case TrailerStates.shutdownPending:
        return "shutdown_pending";
      case TrailerStates.truckBatteryLow:
        return "truck_battery_low";
      case TrailerStates.truckBatteryNormal:
        return "truck_battery_normal";
      case TrailerStates.truckDisconnected:
        return "truck_disconnected";
      case TrailerStates.truckConnected:
        return "truck_connected";
      case TrailerStates.gpsSignalLost:
        return "gps_lost";
      case TrailerStates.motionDetected:
        return "motion_detected";
      case TrailerStates.motionCleared:
        return "stagnation";
      case TrailerStates.humanDetected:
        return "human_detected";
      case TrailerStates.humanCleared:
        return "human_cleared";
      case TrailerStates.doorOpened:
        return "door_opened";
      case TrailerStates.doorClosed:
        return "door_closed";
      case TrailerStates.jammingDetected:
        return "jamming_detected";
      case TrailerStates.jammingOff:
        return "jamming_off";
      case TrailerStates.networkOn:
        return "network_on";
      case TrailerStates.networkOff:
        return "network_off";
      case TrailerStates.systemTurnedOn:
        return "system_turned_on";

      default:
      case TrailerStates.ok:
      case TrailerStates.unknown:
        return "ok";
    }
  },
};
