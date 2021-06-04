import React from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";

import styled from "@ui/Theme";

export interface PreviewDetailsProps {
  downloadDate?: string;
  eventDate?: string;
}

export const Container = styled.div`
  padding: 5px;
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 12px;
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.4);
`;

export function PreviewDetails(props: PreviewDetailsProps) {
  const { t } = useTranslation("monitoring");

  return (
    <Container>
      {props.downloadDate && (
        <>
          <div>{t`downloaded`}</div>
          <span>{moment(props.downloadDate).format("LT l")}</span>
        </>
      )}
      {props.eventDate && (
        <>
          <div>{t`event`}</div>
          <span>{moment(props.eventDate).format("LT l")}</span>
        </>
      )}
    </Container>
  );
}
