import Loading from "@common/loading";

import { fetchTrailers, filterTrailers } from "@screens/trailers/actions";
import Search from "@screens/trailers/components/search";
import { getFilteredTrailersInOrder } from "@screens/trailers/selectors";
import { useTypedSelector } from "@store/index";
import { Container } from "@ui/container";
import * as React from "react";
import { useDispatch } from "react-redux";

import { Trailer as ITrailer } from "@screens/trailers/reducer";

import Trailer from "@common/trailer-row";
import styled from "styled-components";
import { ListIcon, TileIcon } from "@common/icons";
import { TrailerSort } from "@screens/trailers/components/TrailerSort";

export const DashboardRoute = () => {
  const path = "/trailers/:id";
  const dispatch = useDispatch();
  const trailers = useTypedSelector<ITrailer[]>(getFilteredTrailersInOrder);

  const [uiStyle, setUiStyle] = React.useState<"list" | "tiles">("tiles");

  const hasTrailers = trailers.length !== 0;
  React.useEffect(() => {
    if (!hasTrailers) dispatch(fetchTrailers());
  }, [dispatch, hasTrailers]);

  const query = useTypedSelector<string>((state) => state.trailers.query);
  const loading = useTypedSelector<boolean>((state) => state.trailers.loading);
  const error = useTypedSelector<Error | null>((state) => state.trailers.error);

  const handleQueryChange = React.useCallback(
    (search) => {
      dispatch(filterTrailers(search));
    },
    [dispatch]
  );

  const handleTrailerSelect = () => {};

  const list = trailers.map((trailer: ITrailer) => (
    <TrailerWrapper key={trailer.id}>
      <Trailer
        selected={false}
        onClick={handleTrailerSelect}
        trailer={trailer}
        url={path}
        compressed={uiStyle === "list"}
      />
    </TrailerWrapper>
  ));

  return (
    <Container
      style={{
        flexDirection: "column",
        background: "#ebedef",
        overflow: "auto",
      }}
    >
      <Header>
        <Filter>
          <Search query={query} updateQuery={handleQueryChange} />
        </Filter>
        <Settings>
          <TrailerSort />
          <Button
            onClick={() => setUiStyle("tiles")}
            selected={uiStyle === "tiles"}
          >
            <TileIcon
              color={uiStyle === "tiles" ? "white" : "#808080"}
              active={true}
              iconSize={24}
            />
          </Button>
          <Button
            onClick={() => setUiStyle("list")}
            selected={uiStyle === "list"}
          >
            <ListIcon
              color={uiStyle === "list" ? "white" : "#808080"}
              active={true}
              iconSize={24}
            />
          </Button>
        </Settings>
      </Header>
      <TrailersList tiles={uiStyle === "tiles"}>
        <Loading error={error} loading={loading}>
          {list}
        </Loading>
      </TrailersList>
    </Container>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 11px 0 0;
`;

const Filter = styled.div`
  flex: 1;
`;

const Settings = styled.div`
  display: flex;
`;

const TrailerWrapper = styled.div`
  margin: 5px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);

  a {
    border-top: 0;
    &:last-of-type {
      border-bottom: 0;
    }
  }
`;

const TrailersList = styled.div<{ tiles: boolean }>`
  display: flex;
  flex-direction: ${({ tiles }) => (tiles ? "row" : "column")};
  flex-wrap: wrap;
  padding: 8px;

  ${TrailerWrapper} {
    flex-basis: ${({ tiles }) => (tiles ? "300px" : undefined)};

    @media screen and (max-width: 812px) {
      flex-basis: ${({ tiles }) => (tiles ? "100%" : undefined)};
    }
  }
`;

const Button = styled.button<{ selected: boolean }>`
  border: 0;
  background: transparent;
  border-radius: 5px;
  ${({ selected }) =>
    selected &&
    `
    background: #808080;
  `}
`;
