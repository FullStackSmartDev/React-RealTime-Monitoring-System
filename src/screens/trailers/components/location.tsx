import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import Loading from "@common/loading";
import MapPanel from "@common/map-panel";
import styled from "@ui/Theme";
import { Trailer } from "../reducer";

interface Props {
  loading: boolean;
  error: Error | null;
  trailer: Trailer | null;
  children?: ReactNode;
}

const Location = ({ loading, error, trailer, children }: Props) => {
  const trailers = [];
  const { t } = useTranslation();
  if (trailer) {
    trailers.push(trailer);
  }
  return (
    <Container>
      <Loading error={error} loading={loading}>
        <MapPanel trailers={trailers} t={t} />
        {children}
      </Loading>
    </Container>
  );
};

const Memoized = React.memo(Location);
((Memoized as unknown) as any).whyDidYouRender = true;

export default Memoized;

const Container = styled.div`
  position: relative;
  margin: 8px;
  height: 245px;
  background-color: #ffffff;
`;
