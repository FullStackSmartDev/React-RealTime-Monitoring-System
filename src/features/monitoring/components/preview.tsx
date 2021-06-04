import React from "react";
import moment from "moment";

import styled from "@ui/Theme";
import { spinner } from "@assets/index";
import { MonitoringCamera, toReadableName } from "../types";
import { useTranslation } from "react-i18next";
import { MediaWarning } from "./media-warning";

interface Props {
  media?: MonitoringCamera;
  isFuture?: boolean;
  onRefresh?: () => void;
}

interface PreloadProps {
  src?: string;
}

const Player = ({ video }: any) => (
  <PreviewVideo src={video.snapshotUrl} controls />
);

const noop = () => {};

function PreviewComponent({ media, isFuture, onRefresh }: Props) {
  const { t } = useTranslation("monitoring");

  if (isFuture) {
    return (
      <Preview>
        <MediaWarning
          closeModal={onRefresh || noop}
          labels={{
            info: t("image_future"),
            close: t("try_again"),
            open: true,
          }}
          inset
        />
      </Preview>
    );
  }

  if (!media) {
    return (
      <Preview>
        <Preload src={spinner} className="spinner" loading={true} />
      </Preview>
    );
  }

  function renderPreview(media: MonitoringCamera) {
    if (!media.isLoading && !media.snapshotUrl)
      return (
        <MediaWarning
          closeModal={onRefresh || noop}
          labels={{
            info: t("image_inavailable"),
            close: t("try_again"),
            open: true,
          }}
          inset
        />
      );

    if (media.isLoading) return <Preload src={spinner} loading={true} />;
    else {
      if (media.mediaType === "image") {
        return <PreviewImage src={media.snapshotUrl} />;
      } else
        return (
          <PreviewImage src={media.snapshotUrl}>
            <Player video={media} />
          </PreviewImage>
        );
    }
  }

  return (
    <Preview>
      {media.type && (
        <InfoBar position="top">
          <Left>{t("camera", { camera: t(toReadableName(media.type)) })}</Left>
          <Right>
            {media.eventDate && moment(media.eventDate).format("LT")}
          </Right>
        </InfoBar>
      )}
      {renderPreview(media)}
      {/* {media.snapshotUrl && (
        <PreviewImage
          loading={String(media.isLoading) || "false"}
          src={media.snapshotUrl}
        >
          {media.mediaType === "video" && <Player video={media} />}
        </PreviewImage>
      )} */}
      {/* Info Who download this clip disabled for now to not let customer know we are downloading those things- TODO: fix this */}
      {/* {media.logistician && (
        <InfoBar position="bottom">
          <Center>
            {t('downloaded_by', {
              date: moment(media.downloadDate).format('L'),
              username: `${media.logistician.firstName} ${media.logistician.lastName}`,
            })}
          </Center>
        </InfoBar>
      )} */}
    </Preview>
  );
}

export default React.memo(
  PreviewComponent,
  (prev, next) => prev.media?.snapshotUrl === next.media?.snapshotUrl
);

const Preview = styled.div`
  width: 100%;
  max-height: calc(100% - 215px);
  position: relative;
  display: flex;
  flex: 640;
  align-items: normal;
`;

const PreviewVideo = styled.video`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 99.5%;
  height: 99.5%;
`;

const Preload = styled.div<PreloadProps>`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  margin-bottom: 39px;
  background: transparent;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url("${({ src }) => src || ""}");
  ${({ loading }) =>
    loading &&
    `
    animation: rotating 1.5s steps(12) infinite;
    align-self: center;
    width: 128px;
    height: 128px;  
  `}
`;

const PreviewImage = styled(Preload)`
  background-color: black;
`;

const Left = styled.div`
  padding: 5px;
  float: left;
  line-height: 2;
`;

const Right = styled.div`
  padding: 5px;
  float: right;
  line-height: 2;
`;

const InfoBar = styled.div<{ position: "top" | "bottom" }>`
  position: absolute;
  left: 1px;
  width: 99.5%;
  height: 40px;
  color: white;
  background-color: #232f34;
  opacity: 0.7;
  z-index: 100;
  ${({ position }) => position}: 0;
  &::first-letter {
    text-transform: capitalize;
  }
`;
