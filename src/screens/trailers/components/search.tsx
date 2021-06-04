import React, { SyntheticEvent } from "react";

import styled from "@ui/Theme";
import { useTranslation } from "react-i18next";

interface SearchProps {
  query: string;
  updateQuery: (query: string) => void;
}

const Input = styled.input`
  margin: 17px 11px;
  padding-left: 40px;
  width: calc(100% - 22px);
  height: 36px;
  font-size: 13px;
  border: solid 1px silver;
  border-radius: 4px;
  ::placeholder {
    color: silver;
  }
`;
const Icon = styled.div`
  position: relative;
  &:before {
    content: "";
    width: 10px;
    height: 10px;
    display: block;
    position: absolute;
    top: 27px;
    left: 26px;
    border: 2px solid #c3cfe0;
    border-radius: 50%;
  }
  &:after {
    border-bottom: 2px solid #c3cfe0;
    content: "";
    display: block;
    width: 5px;
    position: absolute;
    top: 39px;
    left: 37px;
    transform: rotate(45deg);
  }
`;

export default function Search(props: SearchProps) {
  const { query, updateQuery } = props;
  const { t } = useTranslation("trailers");
  return (
    <Icon>
      <Input
        placeholder={t`search`}
        value={query}
        onChange={(event: SyntheticEvent<HTMLInputElement>) =>
          updateQuery((event.target as HTMLInputElement).value)
        }
      />
    </Icon>
  );
}
