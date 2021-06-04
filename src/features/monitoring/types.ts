import { TrailerId } from "@screens/trailers/reducer";

export type MediaId = string;

export enum MonitoringCameras {
  leftBottom = "leftBottom",
  rightBottom = "rightBottom",
  exterior = "exterior",
  leftTop = "leftTop",
  rightTop = "rightTop",
  interior = "interior",
}

export function isMonitoringCamera(value: string): value is MonitoringCameras {
  return Object.keys(MonitoringCameras).includes(value);
}

export function toReadableName(camera: MonitoringCameras) {
  switch (camera) {
    case MonitoringCameras.leftBottom:
      return "MonitoringCameras.leftBottom";
    case MonitoringCameras.rightBottom:
      return "MonitoringCameras.rightBottom";
    case MonitoringCameras.exterior:
      return "MonitoringCameras.exterior";
    case MonitoringCameras.leftTop:
      return "MonitoringCameras.leftTop";
    case MonitoringCameras.rightTop:
      return "MonitoringCameras.rightTop";
    case MonitoringCameras.interior:
      return "MonitoringCameras.interior";
  }
}
export function fromApi(id: number | string): MonitoringCameras {
  switch (id) {
    case 0:
    case "interior":
      return MonitoringCameras.interior;
    case "exterior":
    case 1:
      return MonitoringCameras.exterior;
    case "left_top":
    case 2:
      return MonitoringCameras.leftTop;
    case "right_top":
    case 3:
      return MonitoringCameras.rightTop;
    case 4:
    case "left_bottom":
      return MonitoringCameras.leftBottom;
    case 5:
    case "right_bottom":
      return MonitoringCameras.rightBottom;
    default:
      return MonitoringCameras.interior; // ...
  }
}

export function emptyImage(
  trailerId: TrailerId,
  type: MonitoringCameras,
  time: string
): MonitoringCamera {
  return {
    id: "",
    type,
    mediaType: "image",
    eventDate: time,
    trailerId,
    alarm: false,
    isLoading: false,
  };
}

export interface MonitoringCamera {
  id: MediaId;
  trailerId: TrailerId;
  type: MonitoringCameras;
  mediaType: "video" | "image";
  snapshotUrl?: string;
  alarm?: boolean;
  downloadDate?: string;
  eventDate?: string;
  isLoading?: boolean;
  logistician?: {
    firstName: "Jan";
    id: "9";
    lastName: "Kowalski";
    phoneNumber: "111111111";
  };
}

export interface CameraSetting {
  type: MonitoringCameras;
  installedAt: string;
}
