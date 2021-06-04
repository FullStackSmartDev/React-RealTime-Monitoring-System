import React from "react";
import moment from "moment";

import styled from "@ui/Theme";
import { MonitoringCamera } from "../types";

interface Props {
  timeline: { [date: string]: MonitoringCamera };
  quantity: number;
  date?: Date;
  onThumbClick: (time: Date) => void;
}

const renderThumbs = (
  { quantity, date, timeline, onThumbClick }: Props,
  half: number
) =>
  new Array(quantity).fill(0).map((_, index) => {
    const diff = index - half;
    const thumbDate = moment(date).add(diff, "minutes");
    const key = thumbDate.toISOString();
    const image = timeline[key];
    const clickHandler = () => {
      onThumbClick(thumbDate.toDate());
    };
    return (
      <Thumb
        src={image && image.snapshotUrl}
        alarm={image && image.alarm}
        onClick={clickHandler}
        key={key}
      />
    );
  });

export default function (props: Props) {
  const { quantity, onThumbClick, date } = props;
  const half = Math.floor(quantity / 2);
  const tiles = renderThumbs(props, half);
  const prev = () =>
    onThumbClick(moment(date).subtract(half, "minutes").toDate());
  const next = () => onThumbClick(moment(date).add(half, "minutes").toDate());

  React.useEffect(() => {
    function changePicture(e: KeyboardEvent) {
      if (e.code === 'ArrowLeft') {
        onThumbClick(moment(date).subtract(1, "minutes").toDate())
      }
      else if (e.code === 'ArrowRight') {
        onThumbClick(moment(date).add(1, "minutes").toDate())
      }
    }

    window.addEventListener('keydown', changePicture);

    return () => window.removeEventListener('keydown', changePicture);
  })
  return (
    <Thumbnails>
      {[
        <PrevButton key="prev" onClick={prev} />,
        ...tiles,
        <NextButton key="next" onClick={next} />,
      ]}
    </Thumbnails>
  );
}

const Thumb = styled.button<{ src?: string; alarm?: boolean }>`
  margin: 4px 1px;
  min-width: 28px;
  flex: 10;
  background-color: gray;
  background-image: url(${({ src }) => src});
  background-position: center center;
  background-size: cover;
  border: solid 2px ${({ alarm }) => (alarm ? "#ff0000" : "transparent")};
  outline: none;
  &:nth-of-type(7) {
    margin: 0px 1px;
    flex: 15;
  }
`;

const Thumbnails = styled.div`
  flex: 85;
  display: flex;
`;

const PrevButton = styled(Thumb)`
  min-width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f6f8;
  &:before {
    content: "";
    display: block;
    border: 0;
    width: 7px;
    height: 7px;
    border-left: solid 2px #232f34;
    border-bottom: solid 2px #232f34;
    transform: rotate(45deg);
  }
`;
const NextButton = styled(PrevButton)`
  &:before {
    transform: rotate(-135deg);
  }
`;
