import React, { FocusEvent, useState } from "react";
import DatePicker from "react-datepicker";
import moment, { Moment } from "moment";
import { useTranslation } from "react-i18next";

interface TimepickerProps {
  pickerType: "day" | "hour" | "maxDate" | "minDate";
  date: Date;
  onPickerChange: (
    date: Date | Moment,
    pickerType?: "day" | "hour" | "maxDate" | "minDate"
  ) => void;
}

export default function Timepicker(props: TimepickerProps) {
  const { pickerType, date, onPickerChange } = props;
  const [isTimeValid, setIsTimeValid] = useState(true);

  const validationTimeFormat = moment.localeData().longDateFormat("LT");

  const { t } = useTranslation();

  const handleTimeChangeRaw = (value: string) => {
    const currentTimeChangeRaw = moment(value, validationTimeFormat, true);
    const isCurrentTimeValid = currentTimeChangeRaw.isValid();
    setIsTimeValid(isCurrentTimeValid);
    if (isCurrentTimeValid) {
      onPickerChange(currentTimeChangeRaw, pickerType);
    }
  };

  const handleTimeOnBlur = (
    event: FocusEvent<HTMLInputElement>,
    date: Date | undefined
  ) => {
    const timeOnBlur = moment(event.target.value, validationTimeFormat, true);
    const isTimeOnBlurValid = timeOnBlur.isValid();
    if (!isTimeOnBlurValid) {
      date && onPickerChange(date, pickerType);
      setIsTimeValid(true);
    }
  };

  return (
    <DatePicker
      selected={date}
      onChange={(date) => {
        if (date && !Array.isArray(date) && moment(date).isValid()) {
          onPickerChange(date, pickerType);
        }
      }}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      dateFormat={moment
        .localeData()
        .longDateFormat("LT")
        .replace(/A/g, "a")
        .replace(/Y/g, "y")}
      timeFormat={moment
        .localeData()
        .longDateFormat("LT")
        .replace(/A/g, "a")
        .replace(/Y/g, "y")}
      timeCaption={t`time`}
      disabledKeyboardNavigation
      fixedHeight
      popperPlacement="top"
      popperModifiers={{
        offset: {
          enabled: true,
          offset: "0px, 5px",
        },
        preventOverflow: {
          enabled: true,
          escapeWithReference: false,
          boundariesElement: "viewport",
        },
      }}
      onChangeRaw={(event) => handleTimeChangeRaw(event.target.value)}
      onBlur={(event) => handleTimeOnBlur(event, date)}
      className={isTimeValid ? "" : "react-datepicker__input-error"}
    />
  );
}
