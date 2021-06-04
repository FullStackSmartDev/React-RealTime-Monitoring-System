import { AuthActions } from "./actions";

export enum AuthErrors {
  loginRequestFail = "loginRequestFail",
  magicLoginRequestFail = "magicLoginRequestFail",
  invalidateSession = "invalidateSession",
}

export function toReadableName(name: AuthErrors) {
  switch (name) {
    case AuthErrors.loginRequestFail:
      return "AuthErrors.loginRequestFail";
    case AuthErrors.magicLoginRequestFail:
      return "AuthErrors.magicLoginRequestFail";
    case AuthErrors.invalidateSession:
      return "AuthErrors.invalidateSession";
  }
}

export interface AuthState {
  token?: string;
  client?: string;
  uid?: string;
  login: string;
  password: string;
  error?: AuthErrors;
  language: string;
  firstName: string;
  lastName: string;
}

const initialState: AuthState = {
  login: "",
  password: "",
  language: "en",
  firstName: "",
  lastName: "",
};

function reducer(
  state: AuthState = initialState,
  action: Action = { type: "" }
): AuthState {
  switch (action.type) {
    case AuthActions.loginRequestSuccess:
      return {
        ...state,
        token: action.payload.headers["access-token"],
        client: action.payload.headers["client"],
        uid: action.payload.headers["uid"],
        password: "",
        firstName: action.payload.data["first_name"],
        lastName: action.payload.data["last_name"],
        error: undefined,
      };
    case AuthActions.invalidateSession:
      return {
        ...state,
        token: undefined,
        client: undefined,
        uid: undefined,
        password: "",
        error: AuthErrors.invalidateSession,
      };
    case AuthActions.loginRequestFail:
      return {
        ...state,
        token: undefined,
        client: undefined,
        uid: undefined,
        password: "",
        error: AuthErrors.loginRequestFail,
      };
    case AuthActions.magicLoginRequestFail:
      return {
        ...state,
        token: undefined,
        client: undefined,
        uid: undefined,
        password: "",
        error: AuthErrors.magicLoginRequestFail,
      };
    case AuthActions.logoutRequestSuccess:
      return {
        ...state,
        token: undefined,
        client: undefined,
        uid: undefined,
        login: "",
        password: "",
        firstName: "",
        lastName: "",
        error: undefined,
      };
    case AuthActions.updatePassword:
      return {
        ...state,
        password: action.payload.password,
      };
    case AuthActions.updateLogin:
      return {
        ...state,
        login: action.payload.login,
      };
    case AuthActions.updateLanguage:
      return {
        ...state,
        language: action.payload.language,
      };
    case AuthActions.changeUserName:
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
      };
    default:
      return state;
  }
}

export default reducer;
