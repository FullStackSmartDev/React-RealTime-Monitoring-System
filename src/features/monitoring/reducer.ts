import moment from "moment";
import { MonitoringActionTypes } from "./actions";
import {
  isMonitoringCamera,
  MediaId,
  MonitoringCamera,
  MonitoringCameras,
} from "./types";
import { TrailerId } from "@screens/trailers/reducer";

export interface MonitoringState {
  media: { [key in MediaId]?: MonitoringCamera };
  trailerVideos: {
    [key in TrailerId]: { [camera in MonitoringCameras]: MediaId[] };
  };
  trailerImages: {
    [key in TrailerId]: { [camera in MonitoringCameras]: MediaId[] };
  };
  ui: {
    time: string;
    camera?: MonitoringCameras;
    isNow: boolean;
  };
  error: boolean;
  status: number;
  process?: boolean;
}

const DISPLAY = 0;
// const ERROR = 1;
// const LOADING_MEDIA = 2;
// const WAITING_DEVICE = 3;

const initialState: MonitoringState = {
  media: {},
  trailerImages: {},
  trailerVideos: {},
  ui: {
    time: moment().startOf("minute").toISOString(),
    camera: MonitoringCameras.interior,
    isNow: true,
  },
  error: false,
  status: DISPLAY,
  process: undefined,
};

function monitoring(
  state = initialState,
  action: Action = { type: "" }
): MonitoringState {
  switch (action.type) {
    case MonitoringActionTypes.fetchMediaFail:
      return {
        ...state,
        error: true,
        ui: { ...state.ui, camera: action.payload.media.type },
      };
    case MonitoringActionTypes.process:
      return {
        ...state,
        process: action.payload,
      };
    case MonitoringActionTypes.fetchMediaSuccess:
      return {
        ...state,
        media: { ...state.media, ...action.payload.media },
        trailerImages: {
          ...state.trailerImages,
          ...action.payload.trailerImages,
        },
        trailerVideos: {
          ...state.trailerVideos,
          ...action.payload.trailerVideos,
        },
      };
    case MonitoringActionTypes.selectCamera:
      return {
        ...state,
        ui: { ...state.ui, camera: action.payload.camera },
      };
    case MonitoringActionTypes.selectTime:
      return {
        ...state,
        ui: {
          ...state.ui,
          time: action.payload.time,
          isNow: action.payload.isNow,
        },
      };
    case MonitoringActionTypes.requestMediaTimeout:
      return {
        ...state,
        media: {
          ...state.media,
          [action.payload.id]: {
            ...state.media[action.payload.id],
            isLoading: false,
            snapshotUrl: "",
          },
        },
      };
    case MonitoringActionTypes.requestMediaFail:
      return {
        ...state,
        error: true,
        ui: { ...state.ui, camera: action.payload.media.type },
      };
    case MonitoringActionTypes.requestMediaSuccess: {
      const media = action.payload.media;
      if (!isMonitoringCamera(media.type)) return state;
      /**
       * As we can get the entity data from both AJAX call and WS message, we should make
       * sure to not re-update the store when not needed (snapshotUrl not changes) to save
       * on re-rendering the whole UI.
       */
      if (
        action.payload.media.snapshotUrl ===
        state.media[action.payload.media.id]?.snapshotUrl
      ) {
        return state;
      }
      const type: MonitoringCameras = media.type;
      const bucket =
        media.mediaType === "video" ? state.trailerVideos : state.trailerImages;
      const bucketName =
        media.mediaType === "video" ? "trailerVideos" : "trailerImages";
      const bucketForTrailer = bucket[media.trailerId] || {};
      const order = Array.from(
        new Set([media.id, ...(bucketForTrailer[type] || [])])
      );
      return {
        ...state,
        media: {
          ...state.media,
          [action.payload.media.id]: action.payload.media,
        },
        [bucketName]: {
          ...bucket,
          [media.trailerId]: {
            ...bucketForTrailer,
            [media.type]: order,
          },
        },
      };
    }
    default:
      return state;
  }
}

export default monitoring;
