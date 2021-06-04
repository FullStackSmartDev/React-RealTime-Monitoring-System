import React, { ReactElement } from "react";

interface RadioGroupProps {
  name: string;
  children: ReactElement[];
  selectedValue: string;
  onClickRadioButton: (radioText: string) => void;
}

const RadioGroup = (props: RadioGroupProps) => {
  const { name, children, selectedValue, onClickRadioButton, ...rest } = props;

  return (
    <div role="radiogroup" {...rest}>
      {React.Children.map(children, (element) =>
        React.cloneElement(element as ReactElement<any>, {
          ...element.props,
          checked: selectedValue === element.props.value,
          onChange: () => onClickRadioButton(element.props.value),
          name,
        })
      )}
    </div>
  );
};

export default React.memo(RadioGroup);
