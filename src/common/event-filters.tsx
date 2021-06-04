import React, { ChangeEvent } from "react";
import Datepicker from "@common/datepicker";
import moment, { Moment } from "moment";
import { useTranslation } from "react-i18next";

import styled from "@ui/Theme";
import { TrailerEventsState } from "@features/events/reducer";
import { TrailerStates } from "@screens/trailers/types";
import { TrailerEvent, TrailerEventTypeCategory } from "@features/events/types";

import MultiSelect from "react-multi-select-component";
import { CSSProperties } from "styled-components";

interface MapFiltersProps {
  container: React.ComponentType;
  description?: string;

  filters: TrailerEventsState["filters"];
  minDate: TrailerEventsState["minDate"];
  maxDate: TrailerEventsState["maxDate"];

  onFilterChange: (filter: TrailerStates, value: boolean) => void;
  onMinDateChange: (date: Date | Moment) => void;
  onMaxDateChange: (date: Date | Moment) => void;
}

interface FilterProps {
  text: string;
  name: string;
  value: boolean;
  onFilterChange: (value: boolean) => void;
  color: string;
  tooltipInfo: string;
  children?: React.ReactNode;
}

const filterGroups: { [key in TrailerEventTypeCategory]: TrailerStates[] } = {
  [TrailerEventTypeCategory.armed]: [
    TrailerStates.armed,
    TrailerStates.disarmed,
  ],
  [TrailerEventTypeCategory.loading]: [
    TrailerStates.startLoading,
    TrailerStates.endLoading,
  ],
  [TrailerEventTypeCategory.alarm]: [
    TrailerStates.alarm,
    TrailerStates.silenced,
    TrailerStates.off,
    TrailerStates.resolved,
    TrailerStates.quiet,
    TrailerStates.emergency,
    TrailerStates.shutdownImmediate,
    TrailerStates.jammingDetected,
  ],
  [TrailerEventTypeCategory.parking]: [TrailerStates.truckParkingOn],
  [TrailerEventTypeCategory.normal]: [
    TrailerStates.truckConnected,
    TrailerStates.truckBatteryNormal,
    TrailerStates.truckEngineOff,
    TrailerStates.truckEngineOn,
    TrailerStates.truckParkingOff,
    TrailerStates.systemTurnedOn,
    TrailerStates.jammingOff,
    TrailerStates.networkOn,
  ],
  [TrailerEventTypeCategory.warning]: [
    TrailerStates.warning,
    TrailerStates.truckDisconnected,
    TrailerStates.shutdownPending,
    TrailerStates.truckBatteryLow,
    TrailerStates.networkOff,
  ],
  [TrailerEventTypeCategory.recognition]: [
    TrailerStates.doorClosed,
    TrailerStates.doorOpened,
    TrailerStates.humanCleared,
    TrailerStates.humanDetected,
    TrailerStates.motionCleared,
    TrailerStates.motionDetected,
  ],
  [TrailerEventTypeCategory.unknown]: [],
  [TrailerEventTypeCategory.engine]: [],
  [TrailerEventTypeCategory.network]: [],
};

const skipCategories = [
  TrailerEventTypeCategory.unknown,
  TrailerEventTypeCategory.engine,
  TrailerEventTypeCategory.network,
];

const filterColors: { [key in TrailerEventTypeCategory]: string } = {
  [TrailerEventTypeCategory.alarm]: "#d0021b",
  [TrailerEventTypeCategory.loading]: "#4a90e2",
  [TrailerEventTypeCategory.parking]: "#2a40c2",
  [TrailerEventTypeCategory.armed]: "#64be00",
  [TrailerEventTypeCategory.warning]: "#FFD700",
  [TrailerEventTypeCategory.normal]: "#b0b0b0",
  [TrailerEventTypeCategory.unknown]: "#9b9b9b",

  [TrailerEventTypeCategory.engine]: "#b0b0b0",
  [TrailerEventTypeCategory.network]: "#b0b0b0",
  [TrailerEventTypeCategory.recognition]: "#b0b0b0",
};

function EventFilters(props: MapFiltersProps) {
  const { t } = useTranslation();

  const options: Option[] = React.useMemo(() => {
    return Object.entries(filterGroups)
      .filter(([category]) => {
        if (
          TrailerEvent.isTrailerEventCategory(category) &&
          !skipCategories.includes(category)
        ) {
          return TrailerEvent.toReadableName(
            category as TrailerEventTypeCategory
          );
        }
        return false;
      })
      .map(([category, filters]) => {
        return {
          label: t(
            "enum:" +
              TrailerEvent.toReadableName(category as TrailerEventTypeCategory)
          ),
          value: filters,
          tooltip: t(
            "enum:" +
              TrailerEvent.toReadableInfo(category as TrailerEventTypeCategory)
          ),
          style: {
            color: filterColors[category as TrailerEventTypeCategory],
          },
        };
      });
  }, [t]);

  const today = moment().endOf("day");
  const minDate = moment(today).subtract(1, "month").startOf("day");
  const maxDate = today;
  const Container = props.container || React.Fragment;

  const validMinDate = (date: Moment) => {
    const isValid = date.isValid();
    const isBetween = date.isSameOrAfter(minDate) && date.isBefore(maxDate);
    return isValid && isBetween;
  };

  const validMaxDate = (date: Moment) => {
    const isValid = date.isValid();
    const isBetween = date.isAfter(minDate) && date.isSameOrBefore(maxDate);
    return isValid && isBetween;
  };

  const selected: Option[] = [];

  Object.entries(filterGroups).forEach(([_group, states]) => {
    if (
      Object.entries(props.filters).some(([state, selected]) => {
        if (selected && states.includes(state as TrailerStates)) return true;
        return false;
      })
    ) {
      const _option = options.find((option) => option.value === states);
      if (_option) {
        selected.push(_option);
      }
    }
  });

  return (
    <Container>
      <Dropdown>
        <MultiSelect
          options={options}
          value={selected}
          onChange={(data: Option[]) => {
            // check what was added
            const added = data.filter(
              (item: Option) => !selected.includes(item)
            );
            const removed = selected.filter(
              (item: Option) => !data.includes(item)
            );

            added.forEach((item: Option) =>
              item.value.forEach((category: TrailerStates) =>
                props.onFilterChange(category, true)
              )
            );
            removed.forEach((item: Option) =>
              item.value.forEach((category: TrailerStates) =>
                props.onFilterChange(category, false)
              )
            );
          }}
          labelledBy={"Select"}
          ItemRenderer={ItemRenderer}
          overrideStrings={{
            selectSomeItems: t("filterMultiselect:selectSomeItems"),
            allItemsAreSelected: t("filterMultiselect:allItemsAreSelected"),
            selectAll: t("filterMultiselect:selectAll"),
            search: t('filterMultiselect:search"'),
            clearSearch: t('filterMultiselect:clearSearch"'),
          }}
        />{" "}
      </Dropdown>
      <DatepickerContainer>
        <StyledDatepicker
          pickerType="minDate"
          date={props.minDate}
          onPickerChange={props.onMinDateChange}
          selectsStart={true}
          startDate={props.minDate}
          endDate={props.maxDate}
          minDate={minDate.toDate()}
          maxDate={props.maxDate}
          highlightDates={[new Date()]}
          validDate={validMinDate}
        />
      </DatepickerContainer>
      <DatepickerContainer>
        <StyledDatepicker
          pickerType="maxDate"
          date={props.maxDate}
          onPickerChange={props.onMaxDateChange}
          selectsEnd={true}
          startDate={props.minDate}
          endDate={props.maxDate}
          minDate={props.minDate}
          maxDate={maxDate.toDate()}
          highlightDates={[new Date(Date.now())]}
          validDate={validMaxDate}
        />
      </DatepickerContainer>
    </Container>
  );
}

export default React.memo(EventFilters);

type Option = {
  label: string;
  value: TrailerStates[];
  style?: CSSProperties;
  tooltip?: string;
};

interface IDefaultItemRendererProps {
  checked: boolean;
  option: Option;
  disabled?: boolean;
  onClick: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ItemRenderer = ({
  checked,
  option,
  onClick,
  disabled,
}: IDefaultItemRendererProps) => {
  return (
    <div style={option.style}>
      <input
        type="checkbox"
        onChange={onClick}
        checked={checked}
        tabIndex={-1}
        disabled={disabled}
      />
      <span>{option.label}</span>
    </div>
  );
};

const Dropdown = styled.div`
  width: calc(100% - 160px - 160px - 1rem);
  font-size: 0.85rem;
  font-family: "Lato", Helvetica;
`;

const DatepickerContainer = styled.label`
  flex-basis: 160px;
  margin-left: 0.5rem;

  input[type="text"] {
    height: 40px;
    border: 1px solid #cccccc;
    border-radius: 3px;
    font-size: 0.85rem;
  }
`;

const StyledDatepicker = styled(Datepicker)`
  width: 100px;
  height: 30px;
  font-size: 12px;
  color: #b0b0b0;
  text-align: center;
  border: 1px solid #dfe3e9;
  border-radius: 4px;
  outline: none !important;
`;
