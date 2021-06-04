import { SortIcon } from "@common/icons";
import { State } from "@store/index";
import styled from "@ui/Theme";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setCustomOrder } from "../actions";
import { OrderFunctions } from "../reducer";

export const TrailerSort = () => {
  const [menuShown, toggleMenu] = React.useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation("trailers");
  const order = useSelector((state: State) => state.trailers.orderFunction);

  console.log(order);

  return (
    <FilterSort>
      <SortIcon onClick={() => toggleMenu((v) => !v)} />

      {menuShown && (
        <Dropdown>
          <select
            onChange={({ target: { value } }) => {
              if (value) {
                dispatch(setCustomOrder(value));
              } else {
                dispatch(setCustomOrder(null));
              }
              toggleMenu(false);
            }}
          >
            <option value={0}>{t("orderBy.priority")}</option>
            <option
              selected={order === OrderFunctions.byName}
              value={OrderFunctions.byName}
            >
              {t("orderBy.name")}
            </option>
            <option
              selected={order === OrderFunctions.byLastLogin}
              value={OrderFunctions.byLastLogin}
            >
              {t("orderBy.lastLogin")}
            </option>
          </select>
        </Dropdown>
      )}
    </FilterSort>
  );
};

const FilterSort = styled.div`
  padding-right: 0.5rem;
  position: relative;

  .mdi-icon {
    cursor: pointer;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  padding: 0.5rem;
  background: white;
  bottom: -10px;
  right: 0;
  transform: translateY(100%);
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
  z-index: 1;

  &::before {
    content: " ";
    display: inline-block;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid white;
    position: absolute;
    top: -10px;
    right: 10px;
  }

  select {
    padding: 0.5rem;
  }
`;
