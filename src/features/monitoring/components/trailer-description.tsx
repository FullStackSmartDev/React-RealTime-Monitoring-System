import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

import styled from "@ui/Theme";
import { Property, Header as PlateNumber } from "@common/trailer-row";
import { Trailer } from "@screens/trailers/reducer";

interface Props {
  trailer?: Trailer;
}

export default function ({ trailer }: Props) {
  const { t } = useTranslation("trailers");
  return (
    <TrailerDescription>
      <PlateNumber>{trailer && trailer.plateNumber}</PlateNumber>
      <TighterProperty name={t`name`} value={"Krone czerwona"} />
      <TighterProperty
        name={t`last_login`}
        value={
          trailer &&
          trailer.lastLogin &&
          moment(trailer.lastLogin).format("LT L")
        }
      />
      <TighterProperty name={t`location`} value={trailer && trailer.location} />
      <TighterProperty
        name={t`base_time`}
        value={
          trailer && trailer.baseTime && moment(trailer.baseTime).format("LT")
        }
      />
    </TrailerDescription>
  );
}

const TighterProperty = styled(Property)`
  margin: 2px 0;
  font-size: 12px;
`;

const TrailerDescription = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 14px;
`;
