import React, { SyntheticEvent } from "react";
import Datepicker from "@common/datepicker";
import moment, { Moment } from "moment";
import Timepicker from "@common/timepicker";
import { useTranslation } from "react-i18next";

import styled from "@ui/Theme";

interface Props {
  date: Date;
  onChange: (date: Date) => void;
  setCurrentTime?: () => void;
}

export default function ({ date, onChange, setCurrentTime }: Props) {
  const { t } = useTranslation("monitoring");

  const onPickerChange = (
    change: Date | Moment,
    pickerType?: "day" | "hour" | "maxDate" | "minDate"
  ) => {
    if (!change) return;
    const combined = moment(date);
    const updated = moment(change);
    switch (pickerType) {
      case "day": {
        combined.set({
          year: updated.year(),
          month: updated.month(),
          date: updated.date(),
        });
        break;
      }
      case "hour": {
        combined.set({
          hour: updated.hour(),
          minute: updated.minute(),
          seconds: 0,
        });
        break;
      }
    }
    onChange(combined.toDate());
  };

  const validDate = (date: any) => {
    return date.isValid();
  };

  return (
    <Pickers>
      <Label
        onClick={(e: SyntheticEvent<HTMLLabelElement>) => e.preventDefault()}
      >
        <Caption>{t`day`}</Caption>
        <Datepicker
          pickerType="day"
          date={date}
          onPickerChange={onPickerChange}
          validDate={validDate}
        />
      </Label>
      <Label
        onClick={(e: SyntheticEvent<HTMLLabelElement>) => e.preventDefault()}
      >
        <Caption>{t`hour`}</Caption>
        <Timepicker
          pickerType="hour"
          date={date}
          onPickerChange={onPickerChange}
        />
      </Label>
      <NowButton onClick={setCurrentTime}>{t`now`}</NowButton>
    </Pickers>
  );
}

const Pickers = styled.div`
  flex: 45;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Label = styled.label`
  flex: 1;
  height: 26px;
  max-width: 190px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  & > div.react-datepicker-popper {
    max-width: 73%;

    * {
      max-width: 100%;
    }
  }

  & > div.react-datepicker-wrapper {
    max-width: 100px;

    * {
      max-width: 100%;
    }
  }
`;

const Caption = styled.span`
  display: inline-block;
  text-transform: capitalize;
  opacity: 0.8;
  font-size: 14px;
  line-height: 1.5;
  color: #354052;
`;

export const NowButton = styled.button`
  cursor: pointer;
  margin: auto;
  position: relative;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  color: #ffffff;
  background-color: #ffa500;
  border: 1px solid #dfe3e9;
  border-radius: 4px;
  &::first-letter {
    text-transform: capitalize;
  }
`;
