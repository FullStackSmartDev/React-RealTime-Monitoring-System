import React from "react";
import styled from "@ui/Theme";
import { useTranslation } from "react-i18next";

export interface ClearSearchProps {
  onClick: () => void;
}

const Container = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: darkgrey 0px 0px 20px;
  left: 290px;
  padding: 10px;
  position: absolute;
  top: 15px;
  width: 180px;
  font-size: 12px;
  line-height: 15px;
  color: rgb(128, 128, 128);
  font-family: "Lato", Helvetica;
  cursor: pointer;
  &::first-letter {
    text-transform: uppercase;
  }

  button {
    margin: 8px auto;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background-color: #4a90e2;
    outline: none;
    width: 100%;
    span {
      padding: 3px 7px;
      font-size: 12px;
      line-height: 1.5;
      text-align: center;
      color: #ffffff;
      white-space: nowrap;
      display: inline-block;
      justify-content: center;
      &::first-letter {
        text-transform: uppercase;
      }
    }
  }

  &:before {
    border: solid 10px transparent;
    border-right: solid 10px white;
    content: "";
    display: block;
    height: 1px;
    left: -20px;
    position: absolute;
    width: 1px;
  }
`;

function ClearSearch(props: ClearSearchProps) {
  const { t } = useTranslation();
  return (
    <Container>
      {t`clear_search_description`}
      <button onClick={props.onClick}>
        <span>{t`clear_search`}</span>
      </button>
    </Container>
  );
}

export default ClearSearch;
