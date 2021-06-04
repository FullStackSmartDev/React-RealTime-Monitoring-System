import React from "react";
import styled from "@ui/Theme";

interface AvatarProps {
  backgroundColor: string;
  textColor: string;
  name: string;
  size?: number;
  onClick: () => void;
}

const Avatar = ({
  backgroundColor,
  textColor,
  name,
  size = 30,
  onClick,
}: AvatarProps) => {
  return (
    <AvatarContainer
      backgroundColor={backgroundColor}
      textColor={textColor}
      name={name}
      size={size}
      onClick={onClick}
    >
      {name}
    </AvatarContainer>
  );
};

export default React.memo(Avatar);

const AvatarContainer = styled.div<AvatarProps>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  line-height: ${(props) => props.size}px;
`;
