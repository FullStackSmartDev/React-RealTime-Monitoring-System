import React from "react";
import { Link } from "react-router-dom";

import styled from "@ui/Theme";
import { useTranslation } from "react-i18next";

interface Props {
  to: string;
  children?: React.ReactNode;
}

export default function SeeMore({ children, to }: Props) {
  const { t } = useTranslation();
  return <Button to={to}>{children ? children : t`see_more`}</Button>;
}

const Button = styled(Link)`
  font-size: 10px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 2.2px;
  text-align: center;
  color: #4390e5;
  text-decoration: none;
  text-transform: uppercase;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  cursor: pointer;
`;
