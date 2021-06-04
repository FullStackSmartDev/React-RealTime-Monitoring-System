import React from "react";
import { useDispatch } from "react-redux";
import { createGlobalStyle } from "styled-components";

import styled from "@ui/Theme";
import { ModalComponents, UiState } from "./reducer";
import { useTypedSelector } from "@store/index";
import { closeModal } from "./actions";

import { ToastProvider } from "./Toast/Toast";

const ModalComponent: React.FC = ({ children }) => {
  const ui = useTypedSelector<UiState>((state) => state.ui);
  const dispatch = useDispatch();
  const handleCloseModal = React.useCallback(() => dispatch(closeModal()), [
    dispatch,
  ]);

  const Component =
    ui.modal.open && ui.modal.type && ModalComponents[ui.modal.type];
  return (
    <ToastProvider>
      <GlobalStyle />
      {Component && (
        <Overlay onClick={handleCloseModal}>
          <Modal
            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
              event.stopPropagation()
            }
          >
            <Component {...ui.modal.props} closeModal={handleCloseModal} />
          </Modal>
        </Overlay>
      )}
      <ModalShadow isOpen={ui.modal.open}>{children}</ModalShadow>
    </ToastProvider>
  );
};

// export default React.memo(ModalComponent);
export default ModalComponent;

export const Container = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  background-color: #ffffff;

  @media screen and (min-width: 812px) {
    height: calc(100vh - 80px);
  }
`;

const ModalShadow = styled.div<{ isOpen: boolean }>`
  ${(props) =>
    props.isOpen
      ? `
      -webkit-filter: blur(2px);
      -moz-filter: blur(2px);
      -o-filter: blur(2px);
      -ms-filter: blur(2px);
      filter: blur(2px);
      `
      : ""}
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
`;

const Modal = styled.div`
  display: inline-block;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  min-width: 200px;
  min-height: 200px;
  background: #ffffff;
  border: 5px solid white;
  z-index: 10000;
`;

const GlobalStyle = createGlobalStyle`
  img[draggable=false][role=presentation][src^="https://maps.googleapis.com/maps/vt"] {
    filter: brightness(100%) contrast(110%);
  }
  .container-element {
    & > * > :nth-child(2),
    & > * > :nth-child(3) {
      display: none !important;
    }
  }
  .react-datepicker__time-container, 
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
    width: 85px !important;
  }
  .react-datepicker__input-error {
    outline: #dc3545 auto 5px !important;
    outline-offset: -2px;
  }
  body {
    box-sizing: border-box;
    margin: 0;
    min-height: 100%;
    font-family: 'Lato', Helvetica;
    div#app {
      box-sizing: border-box;
      min-height: 100%;
      font-family: 'Lato', Helvetica;
      position: relative;
      * {
        box-sizing: border-box;
        font-family: 'Lato', Helvetica;
      }
    }
  }
  .fade-enter {
    opacity: 0.01;
  }
  .fade-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0.01;
    transition: opacity 500ms ease-in;
  }
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  div[src*="/spinner"] {
    background-size: 30%;
  }
  div[src*="/spinner"],
  img[src*="/spinner"],
  img.spinner {
    animation: rotating 1.5s steps(12) infinite;
  }
`;
