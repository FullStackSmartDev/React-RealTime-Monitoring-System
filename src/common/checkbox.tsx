import React, { RefObject, createRef, useState } from "react";

import styled from "@ui/Theme";
import { CheckIcon, InformationOutlineIcon } from "./icons";

interface CheckboxProps {
  id: string;
  text: string;
  name: string;
  value: boolean;
  onChange: (checked: boolean) => void;
  checkboxSize: string | number;
  checkboxColor?: string;
  labelColor?: string;
  isTooltipEnabled: boolean;
  tooltipSize: string | number;
  tooltipColor: string;
  tooltipInfo: string;
  disabled?: boolean;
}

interface InputWrapperProps {
  checkboxSize: string | number;
  disabled: boolean | undefined;
}

interface InputProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkboxSize: string | number;
  checkboxColor: string | undefined;
  disabled: boolean | undefined;
  ref: RefObject<{}>;
}

interface LabelProps {
  checkboxSize: string | number;
  disabled: boolean;
  onClick: () => void;
}

interface LabelTextProps {
  checkboxSize: string | number;
  labelColor: string | undefined;
}

export default class Checkbox extends React.PureComponent<CheckboxProps> {
  inputRef = createRef<HTMLInputElement>();

  render() {
    const {
      id,
      text,
      name,
      value,
      onChange,
      checkboxSize,
      checkboxColor,
      labelColor,
      isTooltipEnabled,
      tooltipSize,
      tooltipColor,
      tooltipInfo,
      disabled,
      children,
      ...rest
    } = this.props;

    return (
      <Container>
        <InputWrapper checkboxSize={checkboxSize} disabled={disabled}>
          <Input
            id={id}
            name={name}
            checked={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onChange(event.target.checked)
            }
            checkboxSize={checkboxSize}
            checkboxColor={checkboxColor}
            disabled={disabled}
            {...rest}
            ref={this.inputRef}
          />
          <Label
            checkboxSize={checkboxSize}
            disabled
            onClick={() => this.inputRef.current!.click()}
          >
            <CheckIcon
              color={"#ffffff"}
              backgroundColor={"transparent"}
              active={false}
              wrapperSize={checkboxSize || "16px"}
              iconSize={checkboxSize || "16px"}
            />
          </Label>
        </InputWrapper>
        {text && (
          <LabelText
            checkboxSize={checkboxSize}
            labelColor={labelColor}
            onClick={() => this.inputRef.current!.click()}
          >
            {text}
          </LabelText>
        )}
        {isTooltipEnabled && (
          <Tooltip info={tooltipInfo}>
            <InformationOutlineIcon
              color={tooltipColor}
              backgroundColor={"transparent"}
              active={true}
              wrapperSize={tooltipSize}
              iconSize={tooltipSize}
            />
          </Tooltip>
        )}
      </Container>
    );
  }
}

interface TooltipProps {
  info: string;
  children: JSX.Element;
}

function Tooltip(props: TooltipProps) {
  const { info, children } = props;

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <Wrapper
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      {children}
      {info && isTooltipVisible && <TextWrapper>{info}</TextWrapper>}
    </Wrapper>
  );
}

const Container = styled.div`
  margin: 0 5px;
  flex: 1 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled.div<InputWrapperProps>`
  box-sizing: content-box !important;
  position: relative;
  width: ${({ checkboxSize }: { checkboxSize: string | number }) =>
    checkboxSize ? checkboxSize + "px" : "16px"};
  height: ${({ checkboxSize }: { checkboxSize: string | number }) =>
    checkboxSize ? checkboxSize + "px" : "16px"};
  background: #ffffff;
  border: 1px solid #dfe3e9;
  border-radius: 2px;
  opacity: ${({ disabled }: { disabled: boolean | undefined }) =>
    disabled ? "0.5" : "unset"};
`;

const Input = styled.input.attrs({
  type: "checkbox",
})<InputProps>`
  margin: 0;
  width: ${({ checkboxSize }: { checkboxSize: string | number }) =>
    checkboxSize ? checkboxSize + "px" : "16px"};
  height: ${({ checkboxSize }: { checkboxSize: string | number }) =>
    checkboxSize ? checkboxSize + "px" : "16px"};
  visibility: hidden;

  &:checked + label {
    background: ${({ checkboxColor }: { checkboxColor: string | undefined }) =>
      checkboxColor ? checkboxColor : "#4a90e2"};
    opacity: 1;
    width: ${({ checkboxSize }: { checkboxSize: string | number }) =>
      checkboxSize ? checkboxSize + "px" : "16px"};
    height: ${({ checkboxSize }: { checkboxSize: string | number }) =>
      checkboxSize ? checkboxSize + "px" : "16px"};
  }
`;

const Label = styled.label<LabelProps>`
  position: absolute;
  width: ${({ checkboxSize }: { checkboxSize: string | number }) =>
    checkboxSize ? checkboxSize + "px" : "16px"};
  height: ${({ checkboxSize }: { checkboxSize: string | number }) =>
    checkboxSize ? checkboxSize + "px" : "16px"};
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  font-size: ${({ checkboxSize }: { checkboxSize: string | number }) =>
    checkboxSize ? checkboxSize + "px" : "16px"};
  opacity: 0;
  cursor: pointer;
`;

const LabelText = styled.span<LabelTextProps>`
  margin: 0 5px;
  font-size: ${({ checkboxSize }: { checkboxSize: string | number }) =>
    checkboxSize ? checkboxSize + "px" : "16px"};
  color: ${({ labelColor }: { labelColor: string | undefined }) =>
    labelColor ? labelColor : "#354052"};
  white-space: nowrap;
  cursor: pointer;

  &::first-letter {
    text-transform: uppercase;
  }
`;

const Wrapper = styled.div`
  position: relative;
`;

const TextWrapper = styled.span`
  padding: 5px 10px;
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  opacity: 1;
  transition: opacity 0.5s;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  background: #232f34;
  border-radius: 4px;
  z-index: 1;

  &:after {
    content: "";
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #232f34;
  }
`;
