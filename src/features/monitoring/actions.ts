import { ThunkDispatch } from "redux-thunk";
import moment from "moment";

import api, { MediaRequestQuery, MediaListRequestQuery } from "@api/index";
import { MonitoringCameras, MediaId, MonitoringCamera, fromApi } from "./types";
import { MonitoringState } from "./reducer";
import { State } from "@store/index";
import { TrailerId } from "@screens/trailers/reducer";
import { TrailerStates, TrailerStatesHelper } from "@screens/trailers/types";
import { IMAGE_DOWNLOAD_TIMEOUT } from "../../config";

export enum MonitoringActionTypes {
  fetchMediaSent = "MonitoringActionTypes.fetchMediaSent",
  fetchMediaSuccess = "MonitoringActionTypes.fetchMediaSuccess",
  fetchMediaFail = "MonitoringActionTypes.fetchMediaFail",
  requestMediaSent = "MonitoringActionTypes.requestMediaSent",
  requestMediaSuccess = "MonitoringActionTypes.requestMediaSuccess",
  requestMediaFail = "MonitoringActionTypes.requestMediaFail",
  requestMediaTimeout = "MonitorigActionTypes.requestMediaTimeout",
  process = "MonitoringActionTypes.process",
  selectCamera = "MonitoringActionTypes.selectCamera",
  selectTime = "MonitoringActionTypes.selectTime",
}

export function selectCamera(camera: MonitoringCameras) {
  return {
    type: MonitoringActionTypes.selectCamera,
    payload: { camera },
  };
}

export function selectTime(time: string, isNow: boolean = false) {
  return {
    type: MonitoringActionTypes.selectTime,
    payload: { time, isNow },
  };
}

export function fetchMedia(id: TrailerId) {
  return async (
    dispatch: ThunkDispatch<State, {}, Action>,
    getState: () => State
  ) => {
    dispatch({ type: MonitoringActionTypes.fetchMediaSent });
    try {
      const { auth, monitoring } = getState();
      const time = monitoring.ui.isNow ? moment() : moment(monitoring.ui.time);

      const query: MediaListRequestQuery = {
        from: time.startOf("day").toDate(),
        to: time.endOf("day").toDate(),
      };
      const { data } = await api.fetchMedia({ id, query, auth });
      const payload = data.reduce(handleMediaFromApi, {
        media: {},
        trailerImages: {},
        trailerVideos: {},
      });
      dispatch({
        type: MonitoringActionTypes.fetchMediaSuccess,
        payload: {
          media: payload.media,
          trailerImages: { [id]: payload.trailerImages },
          trailerVideos: { [id]: payload.trailerVideos },
        },
      });
      if (data) {
        dispatch({ type: MonitoringActionTypes.process, payload: true });
      }
    } catch (error) {
      dispatch({
        type: MonitoringActionTypes.fetchMediaFail,
        error: true,
        payload: { error },
      });
    }
  };
}

export function requestMedia(id: TrailerId, query: MediaRequestQuery) {
  return async (
    dispatch: ThunkDispatch<State, {}, Action>,
    getState: () => State
  ) => {
    dispatch({ type: MonitoringActionTypes.requestMediaSent });

    try {
      const { auth } = getState();
      const { data } = await api.requestMedia({ id, query, auth });
      const media = {
        ...mapRawMedia(data),
        trailerId: id.toString(),
        type: query.camera,
      };

      dispatch({
        type: MonitoringActionTypes.requestMediaSuccess,
        payload: { media },
      });

      /**
       * Set a timeout to check if the download has suceeded, if not, mark the request as failed
       */
      setTimeout(() => {
        const stored = getImageById(getState().monitoring.media, media.id);
        if (!stored || !stored?.snapshotUrl) {
          dispatch({
            type: MonitoringActionTypes.requestMediaTimeout,
            payload: {
              id: media.id,
            },
          });
        }
      }, IMAGE_DOWNLOAD_TIMEOUT * 1000);
    } catch (error) {
      const media = { type: query.camera };
      dispatch({
        type: MonitoringActionTypes.requestMediaFail,
        error: true,
        payload: { error, media },
      });
    }
  };
}

function getImageById(
  mediaLibrary: Record<string, MonitoringCamera | undefined>,
  id: string
): MonitoringCamera | undefined {
  return mediaLibrary[id];
}

function getImageOnDate(
  mediaLibrary: Record<string, MonitoringCamera | undefined>,
  trailerId: string,
  camera: MonitoringCameras,
  date: string
): MonitoringCamera | undefined {
  const record = Object.values(mediaLibrary).find((entry) => {
    if (!entry) return false;
    if (
      entry.trailerId === trailerId &&
      entry.mediaType === "image" &&
      entry.type === camera &&
      entry.eventDate === date
    ) {
      return true;
    }
    return false;
  });

  if (record) {
    return record as MonitoringCamera;
  }

  return undefined;
}

export function requestMediaForRange(
  trailerId: string,
  camera: MonitoringCameras,
  date: Date,
  timeSpan = 5
) {
  return async (
    dispatch: ThunkDispatch<State, {}, Action>,
    getState: () => State
  ) => {
    for (let diff = -1 * timeSpan; diff < timeSpan + 1; diff++) {
      const requestDate = moment(date).add(diff, "minutes");
      if (requestDate.isAfter(new Date())) continue;

      // Check if the image is already in store
      const stored = getImageOnDate(
        getState().monitoring.media,
        trailerId,
        camera,
        requestDate.toISOString()
      );
      if (!stored) {
        dispatch(
          requestMedia(trailerId, {
            camera,
            time: requestDate.toDate(),
            type: "photo",
          })
        );
      }
    }
  };
}

type Accumulator = {
  media: MonitoringState["media"];
  trailerImages: { [camera in MonitoringCameras]: MediaId[] };
  trailerVideos: { [camera in MonitoringCameras]: MediaId[] };
};

export const mapRawMedia = (media: any): MonitoringCamera => {
  return {
    id: media.id,
    trailerId: media.trailer_id.toString(),
    type: fromApi(media.camera),
    mediaType: media.kind === "video" ? "video" : "image",
    alarm: media.trailer_event
      ? TrailerStatesHelper.from(media.trailer_event.kind) ===
        TrailerStates.alarm
      : false,
    downloadDate: new Date(media.requested_at).toISOString(),
    eventDate: new Date(media.requested_time).toISOString(),
    isLoading: media.status !== "completed",
    snapshotUrl: media.url,
    logistician: media.logistician
      ? {
          firstName: media.logistician.first_name,
          id: media.logistician.id,
          lastName: media.logistician.last_name,
          phoneNumber: media.logistician.phone_number,
        }
      : undefined,
  };
};

const handleMediaFromApi = (
  accumulator: Accumulator,
  current: any
): Accumulator => {
  const { media, trailerImages, trailerVideos } = accumulator;
  const bucket = current.kind === "video" ? trailerVideos : trailerImages;
  const bucketName =
    current.kind === "video" ? "trailerVideos" : "trailerImages";

  return {
    ...accumulator,
    media: {
      [current.id]: mapRawMedia(current),
      ...media,
    },
    [bucketName]: {
      ...bucket,
      [fromApi(current.camera)]: [
        current.id,
        ...(bucket[fromApi(current.camera)] || []),
      ],
    },
  };
};
