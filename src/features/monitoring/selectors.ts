import { createSelector } from "reselect";

import { MonitoringCameras, MonitoringCamera, emptyImage } from "./types";
import { MonitoringState } from "./reducer";
import { State } from "@store/index";
import { TrailerId } from "@screens/trailers/reducer";
import { getTrailer } from "@screens/trailers/selectors";

const getMedia = ({ monitoring }: State) => monitoring.media;
const getTrailerImages = ({ monitoring }: State) => monitoring.trailerImages;
const getTrailerVideos = ({ monitoring }: State) => monitoring.trailerVideos;
const getTime = ({ monitoring }: State) =>
  monitoring.ui.time || new Date().toISOString();
const getCamera = ({ monitoring }: State) =>
  monitoring.ui.camera || MonitoringCameras.interior;

type TrailerMediaIds = { [key in MonitoringCameras]: string[] };
const emptyTrailerMediaIds: TrailerMediaIds = {
  [MonitoringCameras.exterior]: [],
  [MonitoringCameras.interior]: [],
  [MonitoringCameras.leftBottom]: [],
  [MonitoringCameras.leftTop]: [],
  [MonitoringCameras.rightBottom]: [],
  [MonitoringCameras.rightTop]: [],
};

const getMediaForTrailer = (
  trailer: TrailerId | null,
  media: { [x: string]: TrailerMediaIds }
) => (trailer && media[trailer]) || emptyTrailerMediaIds;

const getVideosForTrailer = createSelector(
  [getTrailer, getTrailerVideos],
  getMediaForTrailer
);

const getImagesForTrailer = createSelector(
  [getTrailer, getTrailerImages],
  getMediaForTrailer
);

const timelineForMedia = (
  trailerMediaIds: TrailerMediaIds,
  media: MonitoringState["media"],
  camera: MonitoringCameras
) => {
  const map: { [date: string]: MonitoringCamera } = {};
  if (!camera || !trailerMediaIds) {
    return map;
  }
  const mediaForCamera = trailerMediaIds[camera] || [];
  for (const id of mediaForCamera) {
    const image = media[id];
    if (!image) {
      continue;
    }
    const key = image.eventDate;
    if (!key) {
      continue;
    }
    map[key] = image;
  }
  return map;
};

export const getVideosTimeline = createSelector(
  [getVideosForTrailer, getMedia, getCamera],
  timelineForMedia
);

export const getImagesTimeline = createSelector(
  [getImagesForTrailer, getMedia, getCamera],
  timelineForMedia
);

export const getSnapshotForTime = createSelector(
  [getTrailer, getImagesForTrailer, getMedia, getTime],
  (trailer, images, media, time) => {
    const find = (camera: MonitoringCameras) =>
      images &&
      camera &&
      images[camera] &&
      images[camera].reduce((acc, id) => {
        const image = media[id];
        if (!image || image.eventDate !== time) {
          return acc;
        }
        if (acc.isLoading) {
          return { ...acc, ...image };
        }
        return { ...image, ...acc };
      }, {} as MonitoringCamera);

    const _emptyImage = (type: MonitoringCameras): MonitoringCamera => {
      return emptyImage(trailer || "", type, time);
    };

    const map = (image: MonitoringCamera | null, type: MonitoringCameras) => {
      if (!image || image.id === undefined) {
        return _emptyImage(type);
      }
      return image;
    };

    const snapshot = {
      [MonitoringCameras.exterior]: map(
        find(MonitoringCameras.exterior),
        MonitoringCameras.exterior
      ),
      [MonitoringCameras.interior]: map(
        find(MonitoringCameras.interior),
        MonitoringCameras.interior
      ),
      [MonitoringCameras.leftBottom]: map(
        find(MonitoringCameras.leftBottom),
        MonitoringCameras.leftBottom
      ),
      [MonitoringCameras.leftTop]: map(
        find(MonitoringCameras.leftTop),
        MonitoringCameras.leftTop
      ),
      [MonitoringCameras.rightBottom]: map(
        find(MonitoringCameras.rightBottom),
        MonitoringCameras.rightBottom
      ),
      [MonitoringCameras.rightTop]: map(
        find(MonitoringCameras.rightTop),
        MonitoringCameras.rightTop
      ),
    };
    return snapshot;
  }
);

export const getImage = createSelector(
  [getCamera, getSnapshotForTime],
  (camera, snapshot) => {
    return (camera && snapshot[camera]) || null;
  }
);

export const getVideo = createSelector(
  [getTime, getVideosTimeline],
  (time, videos) => {
    const video = videos[time];
    return video || null;
  }
);
