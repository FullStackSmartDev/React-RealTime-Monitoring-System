import React from "react";

import styled from "@ui/Theme";

interface ErrorProps {
  error: Error;
}

export default function ErrorMessage(props: ErrorProps) {
  const { error } = props;

  return (
    <Container>
      <Message>{error.message}</Message>
    </Container>
  );
}

const Container = styled.div`
  max-width: 100%;
  max-height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Message = styled.div`
  max-width: 100%;
  max-height: 100%;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.3;
  color: #fd0826;
  letter-spacing: 2.2;
`;
