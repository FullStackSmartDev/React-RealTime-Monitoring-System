import React from "react";

import { spinner } from "@assets/index";
import styled from "@ui/Theme";

interface LoaderProps {
  wrapperHeight?: number | string;
  wrapperWidth?: number | string;
  spinnerSize?: number | string;
}

export default function Spinner(props: LoaderProps) {
  const { spinnerSize, wrapperHeight, wrapperWidth } = props;

  return (
    <Container wrapperHeight={wrapperHeight} wrapperWidth={wrapperWidth}>
      <SpinnerImage
        src={spinner}
        spinnerSize={spinnerSize}
        className="spinner"
      />
    </Container>
  );
}
const Container = styled.div<LoaderProps>`
  width: ${(props) => (props.wrapperWidth ? props.wrapperWidth : "100%")};
  height: ${(props) => (props.wrapperHeight ? props.wrapperHeight : "100%")};
  max-width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpinnerImage = styled.img<LoaderProps>`
  width: ${(props) => (props.spinnerSize ? props.spinnerSize : "100px")};
  height: ${(props) => (props.spinnerSize ? props.spinnerSize : "100px")};
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;
