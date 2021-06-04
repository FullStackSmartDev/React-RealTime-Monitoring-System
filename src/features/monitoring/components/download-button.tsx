import React from "react";

import styled from "@ui/Theme";
import { PhotoIcon, VideoIcon, } from "@common/icons";

interface ButtonProps {
  onClick?: () => void;
  children?: any;
  type?: string;
  active?: boolean | true;
}

export default function DownloadButton({
  onClick,
  children,
  type,
  active,
}: ButtonProps) {
  return (
    <Button onClick={onClick} active={active}>
      {type === "photo" ? (
        <StyledPhotoIcon
          wrapperSize={22}
          iconSize={22}
          color={"#ffffff"}
          backgroundColor={"transparent"}
          active={active}
        />
      ) : (
        <StyledVideoIcon
          wrapperSize={22}
          iconSize={22}
          color={"#ffffff"}
          backgroundColor={"transparent"}
          active={active}
        />
      )}
      {children}
    </Button>
  );
}

const Button = styled.button<ButtonProps>`
  position: relative;
  margin: 12px auto;
  padding: 4px 16px 4px 16px;
  width: 100%;
  max-width: 265px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  line-height: 2;
  text-align: center;
  color: #ffffff;
  text-decoration: none;
  border: 1px solid #dfe3e9;
  border-radius: 4px;
  &::first-letter {
    text-transform: capitalize;
  }
  background-color: ${(props) => (props.active ? "#4a90e2" : "#5f5f5f")};
`;

const StyledVideoIcon = styled(VideoIcon)`
  margin-right: 8px;
`;

const StyledPhotoIcon = styled(PhotoIcon)`
  margin-right: 8px;
`;
