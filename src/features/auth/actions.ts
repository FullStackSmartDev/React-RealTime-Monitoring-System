import { Dispatch } from "redux";

import { State } from "@store/index";
import api from "@api/index";
import { ThunkDispatch } from "redux-thunk";

export enum AuthActions {
  updateLogin = "AuthActions.updateLogin",
  updatePassword = "AuthActions.updatePassword",
  updateLanguage = "AuthActions.updateLanguage",
  changeUserName = "AuthActions.changeUserName",
  invalidateSession = "AuthActions.invalidateSession",
  loginRequestSent = "AuthActions.loginRequestSent",
  magicLoginRequestSent = "AuthActions.magicLoginRequestSent",
  magicLoginRequestFail = "AuthActions.magicLoginRequestFail",
  loginRequestSuccess = "AuthActions.loginRequestSuccess",
  loginRequestFail = "AuthActions.loginRequestFail",
  logoutRequestSent = "AuthActions.logoutRequestSent",
  logoutRequestSuccess = "AuthActions.logoutRequestSuccess",
  logoutRequestFail = "AuthActions.logoutRequestFail",
  changePasswordRequestSent = "AuthActions.changePasswordRequestSent",
  changePasswordRequestSuccess = "AuthActions.changePasswordRequestSuccess",
  changePasswordRequestFail = "AuthActions.changePasswordRequestFail",
}

export function updateLogin(login: string) {
  return { type: AuthActions.updateLogin, payload: { login } };
}

export function updatePassword(password: string) {
  return { type: AuthActions.updatePassword, payload: { password } };
}

export function updateLanguage(language: string) {
  return { type: AuthActions.updateLanguage, payload: { language } };
}

export function changeUserName(firstName: string, lastName: string) {
  return {
    type: AuthActions.changeUserName,
    payload: { firstName, lastName },
  };
}

export function login() {
  return async function (dispatch: Dispatch, getState: () => State) {
    dispatch({ type: AuthActions.loginRequestSent });
    try {
      const { auth } = getState();
      const { data, headers } = await api.login({
        email: auth.login,
        password: auth.password,
      });
      dispatch({
        type: AuthActions.loginRequestSuccess,
        payload: { data, headers },
      });
    } catch (error) {
      dispatch({
        type: AuthActions.loginRequestFail,
        error: true,
        payload: { error },
      });
    }
  };
}

export function magicLogin(magicLink: string) {
  return async function (dispatch: Dispatch, getState: () => State) {
    dispatch({ type: AuthActions.magicLoginRequestSent });
    try {
      const { data, headers } = await api.magicLogin({ magicLink: magicLink });
      dispatch({
        type: AuthActions.loginRequestSuccess,
        payload: { data, headers },
      });
    } catch (error) {
      dispatch({
        type: AuthActions.magicLoginRequestFail,
        error: true,
        payload: { error },
      });
    }
  };
}

export function logout() {
  return async function (dispatch: Dispatch, getState: () => State) {
    dispatch({ type: AuthActions.logoutRequestSent });
    try {
      const { auth } = getState();
      await api.logout({ auth });
      dispatch({ type: AuthActions.logoutRequestSuccess, payload: null });
    } catch (error) {
      dispatch({
        type: AuthActions.logoutRequestFail,
        error: true,
        payload: { error },
      });
    }
  };
}

export function changePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  return async (
    dispatch: ThunkDispatch<State, {}, Action>,
    getState: () => State
  ) => {
    const { auth } = getState();
    try {
      dispatch({ type: AuthActions.changePasswordRequestSent });
      const { data, headers } = await api.changePassword({
        currentPassword,
        newPassword,
        auth,
      });
      dispatch({
        type: AuthActions.changePasswordRequestSuccess,
        payload: { data, headers },
      });
      return Promise.resolve();
    } catch (error) {
      dispatch({
        type: AuthActions.changePasswordRequestFail,
        error: true,
        payload: { error },
      });

      return Promise.reject();
    }
  };
}
