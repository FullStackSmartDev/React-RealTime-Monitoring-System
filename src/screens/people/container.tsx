import React from "react";

import { peopleplaceholder } from "@assets/index";
import styled from "@ui/Theme";

export default function PeopleRoute() {
  return (
    <Container>
      <PeoplePlaceholder src={peopleplaceholder} />
    </Container>
  );
}

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: #f4f6f8;
`;

const PeoplePlaceholder = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
