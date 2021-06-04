import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CameraPicker from "./components/camera-picker";
import DownloadButton from "./components/download-button";
import Pickers from "./components/pickers";
import Preview from "./components/preview";
import Thumbnails from "./components/thumbnails";
import { MediaWarning } from "./components/media-warning";
import styled from "@ui/Theme";
import { MonitoringCameras } from "./types";
import { MonitoringState } from "./reducer";
import { State, useTypedSelector } from "@store/index";
import { getActiveTrailer } from "@screens/trailers/selectors";
import {
  requestMedia,
  requestMediaForRange,
  selectCamera,
  selectTime,
} from "./actions";
import { getImagesTimeline, getImage, getVideo } from "./selectors";
import { VIDEO_DOWNLOAD_TIMEOUT } from "../../config";

function MonitoringContainer() {
  const dispatch = useDispatch();

  const monitoring = useTypedSelector<MonitoringState>(
    (state) => state.monitoring
  );
  const { ui, error } = monitoring;
  const state = useSelector<State>((state) => state) as State;
  const trailerbaseid = getActiveTrailer(state)?.id;
  const imagesTimeline = getImagesTimeline(state);
  const image = getImage(state);
  const video = getVideo(state);

  const { t } = useTranslation(["monitoring"]);
  const [download, setDownload] = useState(false);
  const [info, setInfo] = useState("");
  const [modal, setModal] = useState(false);
  const [loadtimer, setLoadtimer] = useState<number>(0);
  const { camera, time } = ui;

  const currentMoment = moment(Date.now()).diff(time) < 60000;

  const datetime = moment(time).startOf("minute").toDate();

  const datetimeUnix = datetime.getTime();

  useEffect(() => {
    if (camera && trailerbaseid) {
      dispatch(
        requestMediaForRange(trailerbaseid, camera, new Date(datetimeUnix))
      );
    }
  }, [trailerbaseid, camera, datetimeUnix, dispatch]);

  if (!trailerbaseid || !camera || !time) {
    return <></>;
  }
  const videoExists = video !== null && video.snapshotUrl !== null;

  if (video?.snapshotUrl && !video?.isLoading && download) {
    setDownload(false);
  }

  function reRequestImage() {
    if (trailerbaseid && camera) {
      dispatch(
        requestMedia(trailerbaseid, {
          camera,
          time: datetime,
          type: "photo",
        })
      );
    }
  }

  const requestVideo = () => {
    if (image && image.snapshotUrl) {
      setDownload(true);
      dispatch(
        requestMedia(trailerbaseid, {
          camera,
          time: new Date(time),
          type: "video",
        })
      );

      if (!loadtimer) {
        let timer = setTimeout(() => {
          setInfo(t`video_inavailable`);
          setModal(true);
          setDownload(false);
          setLoadtimer(0);
        }, VIDEO_DOWNLOAD_TIMEOUT * 1000);
        setLoadtimer(timer);
      }
    } else {
      setInfo(t`wait_thumbnails`);
      setModal(true);
    }
  };

  const openVideo = () => {
    if (video) window.open(video.snapshotUrl, "_blank");
  };

  const openImage = () => {
    if (image) window.open(image.snapshotUrl, "_blank");
  };

  const closeModal = () => {
    setModal(false);
    setDownload(false);
  };

  if (error) {
    setInfo("Video is temporarily unavailable.");
    setModal(true);
    setDownload(false);
  }

  if (videoExists && loadtimer) {
    clearTimeout(loadtimer);
    setLoadtimer(0);
  }

  function renderVideoButton() {
    /**
     * This logic needs revision, the buttons LOOK fine, but the logic is weird
     */

    // The video is not ready yet
    if (currentMoment) {
      return (
        <DownloadButton
          type={"video"}
          active={false}
        >{t`requesting`}</DownloadButton>
      );
    }

    // Photo for given time is downloaded
    if (image?.snapshotUrl) {
      if (!videoExists && download) {
        return (
          // User has requested the video
          <DownloadButton
            type={"video"}
            active={false}
          >{t`wait`}</DownloadButton>
        );
      }
      return (
        <DownloadButton
          type={"video"}
          active={true}
          onClick={videoExists ? openVideo : requestVideo}
        >
          {videoExists && t`save`}
          {!videoExists && !download && t`download`}
        </DownloadButton>
      );
    }

    return (
      <DownloadButton
        type={"video"}
        active={false}
      >{t`data_unavailable`}</DownloadButton>
    );
  }

  function renderImageButton() {
    if (image?.snapshotUrl) {
      return (
        <DownloadButton
          onClick={openImage}
          type={"photo"}
          active={true}
        >{t`save_image`}</DownloadButton>
      );
    }
    return (
      <DownloadButton
        type={"photo"}
        active={false}
      >{t`data_unavailable`}</DownloadButton>
    );
  }

  function renderMedia() {
    const media = video || image;
    if (moment(time).isAfter(new Date()) && (!media || !media.id)) {
      // Use has selected an image from future, show the proper note
      return <Preview isFuture={true} onRefresh={reRequestImage} />;
    }
    if (!media || !media.id) {
      // No image selected (yet) - just opened the media library - spinner
      return <Preview />;
    }
    if (!videoExists && download) {
      // User has selected a video but it's not ready yet - spinner
      return <Preview />;
    }
    if (videoExists || !download)
      // Video is ready or not requested yet - show preview
      return <Preview media={media} onRefresh={reRequestImage} />;
  }

  return (
    <>
      <Container className="container">
        <Header>{t`monitoring`}</Header>
        <Content>
          <MonitoringDetails>
            {renderMedia()}
            <Pickers
              date={datetime}
              onChange={(date: Date) =>
                dispatch(selectTime(date.toISOString()))
              }
              setCurrentTime={() => {
                dispatch(selectTime(moment().startOf("minute").toISOString()));
              }}
            />
            <Thumbnails
              timeline={imagesTimeline}
              quantity={11}
              date={datetime}
              onThumbClick={(date) => {
                dispatch(selectTime(date.toISOString()));
                setDownload(false);
              }}
            />
            <ButtonContainer>
              {renderVideoButton()}
              {renderImageButton()}
            </ButtonContainer>
          </MonitoringDetails>
          <TrailerDetails>
            <CameraPicker
              onChange={(camera: MonitoringCameras) =>
                dispatch(selectCamera(camera))
              }
              picked={camera}
            />
          </TrailerDetails>
        </Content>
      </Container>
      {modal && (
        <MediaWarning
          closeModal={closeModal}
          labels={{ info: info, open: true }}
        />
      )}
    </>
  );
}

export default MonitoringContainer;

const Container = styled.div`
  position: relative;
  width: 600px;
  max-width: 600px;
  height: 90vh;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  position: relative;
  width: 450px;
  max-width: 450px;
  height: 10vh;
  max-height: 10vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Header = styled.h5`
  margin-top: 12px;
  margin-bottom: 12px;
  padding-left: 12px;
  display: block;
  align-self: flex-start;
  max-height: 64px;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  text-transform: capitalize;
`;

const Content = styled.div`
  max-height: calc(100% - 58px);
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const MonitoringDetails = styled.div`
  max-width: 440px;
  max-height: 100%;
  flex: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TrailerDetails = styled.div`
  flex: 80;
  max-width: 160px;
  display: flex;
  flex-direction: column;
`;
