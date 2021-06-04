import React from "react";

import Loading from "./loading";
import Search from "@screens/trailers/components/search";
import styled from "@ui/Theme";
import Trailer from "./trailer-row";
import { TrailerId } from "@screens/trailers/reducer";
import { Trailer as ITrailer } from "@screens/trailers/reducer";
import { useTypedSelector } from "@store/index";
import { useDispatch } from "react-redux";
import { filterTrailers } from "@screens/trailers/actions";
import { TrailerSort } from "@screens/trailers/components/TrailerSort";

interface TrailersContainerProps {
  selected?: string;
  trailers: ITrailer[];
  onTrailerClick: (id: TrailerId) => void;
  path: string;
}

export default function TrailersList(props: TrailersContainerProps) {
  const { trailers, onTrailerClick, path, selected } = props;
  const query = useTypedSelector<string>((state) => state.trailers.query);
  const loading = useTypedSelector<boolean>((state) => state.trailers.loading);
  const error = useTypedSelector<Error | null>((state) => state.trailers.error);
  const dispatch = useDispatch();

  const handleQueryChange = React.useCallback(
    (search) => {
      dispatch(filterTrailers(search));
    },
    [dispatch]
  );

  const handleTrailerSelect = React.useCallback(
    (id: TrailerId) => {
      onTrailerClick(id);
    },
    [onTrailerClick]
  );

  const list = trailers.map((trailer: ITrailer) => (
    <Trailer
      key={trailer.id}
      selected={trailer.id === selected}
      onClick={handleTrailerSelect}
      trailer={trailer}
      url={path}
    />
  ));

  return (
    <Container>
      <FilterUI>
        <FilterText>
          <Search query={query} updateQuery={handleQueryChange} />
        </FilterText>
        <TrailerSort />
      </FilterUI>
      <Loading error={error} loading={loading}>
        <ListWrapper>{list}</ListWrapper>
      </Loading>
    </Container>
  );
}

const FilterUI = styled.div`
  display: flex;
  align-items: center;
`;

const FilterText = styled.div`
  flex: 1;
`;

const Container = styled.div`
  position: relative;
  min-width: 280px;
  width: 280px;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 812px) {
    display: none;
  }
`;

const ListWrapper = styled.div`
  min-width: 100%;
  top: 70px;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  background-color: #ffffff;
  flex: 1;
`;
