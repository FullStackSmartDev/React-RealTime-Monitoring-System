import React from "react";
import styled from "@ui/Theme";

export interface RadioProps {
  name?: string;
  value: string;
  labelText: string;
  checked?: boolean;
  onChange?: () => void;
}

interface RootProps {
  size?: number;
  borderColor?: string;
  backgroundColor?: string;
}

interface FillProps {
  fillColor?: string;
  borderActive?: string;
}

const Radio = (props: RadioProps) => {
  const { name, value, labelText, checked, onChange } = props;

  return (
    <Root>
      <label>
        {labelText}
        <Input
          type="radio"
          onChange={onChange}
          name={name}
          value={value}
          checked={checked}
          aria-checked={checked}
        />
        <Fill />
      </label>
    </Root>
  );
};

export default React.memo(Radio);

const Root = styled.div<RootProps>`
  margin: 5px 0;
  cursor: pointer;
  width: ${(props) => (props.size ? props.size : 20)}px;
  height: ${(props) => (props.size ? props.size : 20)}px;
  position: relative;
  label {
    margin-left: 25px;
  }
  &::before {
    content: "";
    border-radius: 100%;
    border: 1px solid
      ${(props) => (props.borderColor ? props.borderColor : "#DDD")};
    background: ${(props) =>
      props.backgroundColor ? props.backgroundColor : "#FAFAFA"};
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    box-sizing: border-box;
    pointer-events: none;
    z-index: 0;
  }
`;

const Fill = styled.div<FillProps>`
  background: ${(props) => (props.fillColor ? props.fillColor : "#A475E4")};
  width: 0;
  height: 0;
  border-radius: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.2s ease-in, height 0.2s ease-in;
  pointer-events: none;
  z-index: 1;

  &::before {
    content: "";
    opacity: 0;
    width: calc(20px - 4px);
    position: absolute;
    height: calc(20px - 4px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid
      ${(props) => (props.borderActive ? props.borderActive : "#A475E4")};
    border-radius: 100%;
  }
`;

const Input = styled.input`
  opacity: 0;
  z-index: 2;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:checked {
    & ~ ${Fill} {
      width: calc(100% - 8px);
      height: calc(100% - 8px);
      transition: width 0.2s ease-out, height 0.2s ease-out;

      &::before {
        opacity: 1;
        transition: opacity 1s ease;
      }
    }
  }
`;
