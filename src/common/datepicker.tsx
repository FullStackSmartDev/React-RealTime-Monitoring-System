import React, { FocusEvent, useState } from "react";
import DatePicker from "react-datepicker";
import moment, { Moment } from "moment";

export type PickerType = "day" | "hour" | "maxDate" | "minDate";

interface DatepickerProps {
  pickerType: PickerType;
  date?: Date;
  selectsStart?: boolean;
  selectsEnd?: boolean;
  startDate?: Date;
  endDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  highlightDates?: Date[];
  onPickerChange: (date: Date | Moment, pickerType?: PickerType) => void;
  validDate: (date: Moment) => boolean;
}

export default function Datepicker(props: DatepickerProps) {
  const {
    pickerType,
    date,
    onPickerChange,
    selectsStart,
    selectsEnd,
    startDate,
    endDate,
    minDate,
    maxDate,
    highlightDates,
    validDate,
  } = props;

  const [isDateValid, setIsDateValid] = useState(true);
  const validationDateFormat = moment.localeData().longDateFormat("L");

  const handleDateChangeRaw = (value: string) => {
    const currentDateChangeRaw = moment(value, validationDateFormat, true);
    const isCurrentDateValid = validDate(currentDateChangeRaw);
    setIsDateValid(isCurrentDateValid);
    if (isCurrentDateValid) {
      onPickerChange(currentDateChangeRaw, pickerType);
    }
  };

  const handleDateOnBlur = (
    event: FocusEvent<HTMLInputElement>,
    date: Date | undefined
  ) => {
    const dateOnBlur = moment(event.target.value, validationDateFormat, true);
    const isDateOnBlurValid = validDate(dateOnBlur);
    if (!isDateOnBlurValid) {
      date && onPickerChange(date, pickerType);
      setIsDateValid(true);
    }
  };

  return (
    <DatePicker
      selected={date}
      onChange={(date) => {
        if (date && !Array.isArray(date) && validDate(moment(date))) {
          onPickerChange(date, pickerType);
        }
      }}
      selectsStart={selectsStart}
      selectsEnd={selectsEnd}
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      maxDate={maxDate}
      highlightDates={highlightDates}
      dateFormat={moment
        .localeData()
        .longDateFormat("L")
        .replace(/D/g, "d")
        .replace(/Y/g, "y")}
      timeFormat={moment
        .localeData()
        .longDateFormat("LT")
        .replace(/A/g, "a")
        .replace(/Y/g, "y")}
      disabledKeyboardNavigation
      fixedHeight
      popperPlacement="top-start"
      popperModifiers={{
        offset: {
          enabled: true,
          offset: "-5px, 5px",
        },
        preventOverflow: {
          enabled: true,
          escapeWithReference: false,
          boundariesElement: "viewport",
        },
      }}
      onChangeRaw={(event) => handleDateChangeRaw(event.target.value)}
      onBlur={(event) => handleDateOnBlur(event, date)}
      className={isDateValid ? "" : "react-datepicker__input-error"}
    />
  );
}
