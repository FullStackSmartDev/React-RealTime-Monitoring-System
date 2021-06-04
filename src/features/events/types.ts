import { TrailerStates } from "@screens/trailers/types";

export enum TrailerEventTypeCategory {
  loading = "loading",
  alarm = "alarm",
  armed = "armed",
  warning = "warning",
  unknown = "unknown",
  engine = "engine",
  network = "network",
  normal = "normal",
  parking = "parking",
  recognition = "recognition",
}

export interface Logistician {
  email: string;
  extra_phone_number: string;
  first_name: string;
  id: string;
  last_name: string;
  phone_number: string;
  preferred_locale: string;
  trailer_access_permissions: any[];
}

export interface AlarmAction {
  date: Date;
  logistician: Logistician;
  type: TrailerStates;
}

export const TrailerEvent = {
  isTrailerEventCategory: function (
    value: any
  ): value is TrailerEventTypeCategory {
    if (!value) {
      return false;
    }
    return Object.keys(TrailerEventTypeCategory).includes(value);
  },

  toReadableName: function (
    category: TrailerEventTypeCategory = TrailerEventTypeCategory.unknown
  ) {
    switch (category) {
      case TrailerEventTypeCategory.loading:
        return "TrailerEventTypeCategory.loading";
      case TrailerEventTypeCategory.alarm:
        return "TrailerEventTypeCategory.alarm";
      case TrailerEventTypeCategory.armed:
        return "TrailerEventTypeCategory.armed";
      case TrailerEventTypeCategory.warning:
        return "TrailerEventTypeCategory.warning";
      case TrailerEventTypeCategory.engine:
        return "TrailerEventTypeCategory.engine";
      case TrailerEventTypeCategory.parking:
        return "TrailerEventTypeCategory.parking";
      case TrailerEventTypeCategory.recognition:
        return "TrailerEventTypeCategory.recognition";
      case TrailerEventTypeCategory.normal:
        return "TrailerEventTypeCategory.normal";
      default:
        return "TrailerEventTypeCategory.unknown";
    }
  },

  toReadableInfo: function (
    category: TrailerEventTypeCategory = TrailerEventTypeCategory.unknown
  ) {
    switch (category) {
      case TrailerEventTypeCategory.loading:
        return "TrailerEventTypeInfo.loading";
      case TrailerEventTypeCategory.alarm:
        return "TrailerEventTypeInfo.alarm";
      case TrailerEventTypeCategory.armed:
        return "TrailerEventTypeInfo.armed";
      case TrailerEventTypeCategory.warning:
        return "TrailerEventTypeInfo.warning";
      case TrailerEventTypeCategory.engine:
        return "TrailerEventTypeInfo.engine";
      case TrailerEventTypeCategory.parking:
        return "TrailerEventTypeInfo.parking";
      case TrailerEventTypeCategory.recognition:
        return "TrailerEventTypeInfo.recognition";
      case TrailerEventTypeCategory.normal:
        return "TrailerEventTypeInfo.normal";
      default:
        return "TrailerEventTypeInfo.unknown";
    }
  },
};
