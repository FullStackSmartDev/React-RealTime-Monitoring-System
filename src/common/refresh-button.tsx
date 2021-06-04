import React from "react";
import { useTranslation } from "react-i18next";

import styled from "@ui/Theme";

export default function ({
  loading,
  detailed,
  onClick,
}: {
  loading: boolean;
  detailed?: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();

  if (loading) {
    return detailed ? (
      <LoadingChartDataButton>{t`loading`}</LoadingChartDataButton>
    ) : (
      <Loading>{t`loading`}</Loading>
    );
  }
  return detailed ? (
    <RefreshChartDataButton
      onClick={onClick}
    >{t`refresh`}</RefreshChartDataButton>
  ) : (
    <Refresh onClick={onClick}>{t`refresh`}</Refresh>
  );
}

const Refresh = styled.button`
  margin-right: 15px;
  padding: 0;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 2.2px;
  text-align: center;
  color: #4390e5;
  text-align: right;
  text-transform: uppercase;
  background-color: transparent;
  border: none;
  outline: none;
  z-index: 1000;
  text-decoration: none;
  cursor: pointer;
`;

const Loading = styled(Refresh)`
  margin-left: 15px;
  margin-right: 15px;
  color: #a0a0a0;
`;

const RefreshChartDataButton = styled(Refresh)`
  margin: 25px 0 0 0;
`;

const LoadingChartDataButton = styled(Refresh)`
  margin: 25px 15px 0 15px;
  color: #a0a0a0;
`;
