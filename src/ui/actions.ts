import { ModalComponentTypes } from "./reducer";

export enum ModalActions {
  openModal = "ModalActions.openModal",
  closeModal = "ModalActions.closeModal",
}

export function closeModal() {
  return {
    type: ModalActions.closeModal,
    payload: {},
  };
}

export function openModal(type: ModalComponentTypes, props: any) {
  return {
    type: ModalActions.openModal,
    payload: { type, props },
  };
}
