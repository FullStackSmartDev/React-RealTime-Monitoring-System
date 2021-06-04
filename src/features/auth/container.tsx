import React, { SyntheticEvent } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";

import styled from "@ui/Theme";
import { AuthState, toReadableName } from "./reducer";
import { useTypedSelector } from "@store/index";
import { logo } from "@assets/index";
import { updateLogin, updatePassword, login, magicLogin } from "./actions";
import { useTranslation } from "react-i18next";

interface AuthContainerMatch {
  match: {
    url: string;
    path: string;
    isExact: boolean;
    params: {
      magicLink: string;
    };
  };
}

function AuthContainer(props: AuthContainerMatch) {
  const auth = useTypedSelector<AuthState>((state) => state.auth);
  const dispatch = useDispatch();

  const { match } = props;

  if (Boolean(match.params?.magicLink)) {
    dispatch(magicLogin(match.params?.magicLink));
  }

  const { t } = useTranslation("auth");
  if (auth.token) {
    return <Redirect to="/" />;
  }

  return (
    <LoginScreen
      onSubmit={(event: SyntheticEvent<HTMLFormElement>) => {
        dispatch(login());
        event.preventDefault();
      }}
    >
      <Logo src={logo} />
      {auth.error && <ErrorAlert>{t(toReadableName(auth.error))}</ErrorAlert>}
      <Header>{t`login`}</Header>
      <EmailLabel>
        {t`email_address`}
        <Input
          value={auth.login}
          onChange={({ target }: { target: HTMLInputElement }) =>
            dispatch(updateLogin(target.value))
          }
          onInput={() => (auth.error = undefined)}
          placeholder={t`email_address_placeholder`}
          autoComplete={"username"}
        />
      </EmailLabel>
      <PasswordLabel>
        {t`password`}
        <Input
          value={auth.password}
          onChange={({ target }: { target: HTMLInputElement }) =>
            dispatch(updatePassword(target.value))
          }
          onInput={() => (auth.error = undefined)}
          type="password"
          placeholder={t`password_placeholder`}
          autoComplete={"current-password"}
        />
      </PasswordLabel>
      <LoginButton>{t`login_button`}</LoginButton>
      <Break />
      <Footnote>
        {t`forgotten_password`}{" "}
        <FootnoteLink to="#">{t`contact_us`}</FootnoteLink>
      </Footnote>
    </LoginScreen>
  );
}

export default AuthContainer;

const LoginScreen = styled.form`
  margin: 72px auto auto;
  width: 370px;
  border-radius: 6px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Logo = styled.img`
  width: 146px;
  height: 32px;
  margin: 40px auto 8px;
`;

const Break = styled.hr`
  margin: 26px 28px;
  border-top: solid 1px #f4f6f8;
`;

const Input = styled.input`
  background-color: #ffffff;
  border-radius: 4px;
  border: solid 1px #dfe3e9;
  font-size: 14px;
  height: 36px;
  width: 315px;
  padding-left: 44px;
  position: relative;
  ::placeholder {
    color: #dfe3e9;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin: 0 28px;
  font-size: 14px;
  line-height: 1.5;
  color: #354052;
  position: relative;
`;

const EmailLabel = styled(Label)`
  &:before {
    border: solid 3px #a8aab7;
    border-radius: 4px;
    content: "";
    display: block;
    height: 13px;
    left: 10px;
    top: 30px;
    position: absolute;
    width: 16px;
    z-index: 100;
  }
  &:after {
    content: "<";
    color: #a8aab7;
    position: absolute;
    z-index: 1000;
    top: 27px;
    font-weight: 900;
    left: 16px;
    display: inline-block;
    transform: rotate(270deg) scaleY(2) scaleX(1.2);
  }
`;

const PasswordLabel = styled(Label)`
  &:before {
    content: "";
    display: block;
    border: solid 3px #a8aab7;
    width: 5px;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    height: 5px;
    position: absolute;
    top: 27px;
    left: 16px;
    z-index: 1000;
  }
  &:after {
    content: "";
    display: block;
    border: solid 3px #a8aab7;
    width: 13px;
    height: 8px;
    position: absolute;
    top: 35px;
    left: 12px;
    border-radius: 3px;
  }
`;

const LoginButton = styled.button`
  font-size: 14px;
  font-weight: bold;
  line-height: 1.5;
  text-align: center;
  color: #ffffff;
  width: 315px;
  height: 36px;
  border-radius: 4px;
  background-color: #4a90e2;
  margin: 15px auto 0;
`;

const Header = styled.h1`
  margin-top: 8px;
  margin-bottom: 8px;
  height: 32px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const ErrorAlert = styled.div`
  margin: 8px 28px;
  padding: 15px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  background-color: #f8d7da;
  border: 1px solid #f8d7da;
  border-radius: 8px;
  color: #721c24;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const Footnote = styled.span`
  margin-bottom: 40px;
  font-size: 12px;
  line-height: 1.75;
  text-align: center;
  color: #344053;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const FootnoteLink = styled(Link)`
  font-size: 12px;
  line-height: 1.75;
  text-align: center;
  color: #4390e5;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
