import React, { useEffect, useState } from "react";
import styled from "@ui/Theme";
import { useTranslation } from "react-i18next";
import RadioGroup from "@common/radiogroup";
import Radio from "@common/radio";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "@store/index";
import { AuthState } from "@features/auth/reducer";
import { changeUserName, updateLanguage } from "@features/auth/actions";
import { ToastType, useToast } from "@ui/Toast/Toast";
import { changePassword } from "@features/auth/actions";
import { PersonIcon } from "@common/icons";

enum UserNameUpdateValidationErrors {
  firstNameRequiredFail = "firstNameRequiredFail",
  firstNameMinimumLengthFail = "firstNameMinimumLengthFail",
  lastNameRequiredFail = "lastNameRequiredFail",
  lastNameMinimumLengthFail = "lastNameMinimumLengthFail",
}

enum PasswordUpdateValidationErrors {
  currentRequiredFail = "currentRequiredFail",
  newRequiredFail = "newRequiredFail",
  minimumLengthFail = "minimumLengthFail",
  confirmRequiredFail = "confirmRequiredFail",
  confirmFail = "confirmFail",
}

export default function UserRoute() {
  const { t, i18n } = useTranslation("navbar");
  const auth = useTypedSelector<AuthState>((state) => state.auth);
  const [language, setLanguage] = useState(auth.language);
  const [firstName, setFirstName] = useState(auth.firstName);
  const [lastName, setLastName] = useState(auth.lastName);
  const [userNameValidationError, setUserNameValidationError] = useState({
    firstNameRequiredFail: "",
    firstNameMinimumLengthFail: "",
    lastNameRequiredFail: "",
    lastNameMinimumLengthFail: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState({
    currentRequiredFail: "",
    newRequiredFail: "",
    minimumLengthFail: "",
    confirmRequiredFail: "",
    confirmationFail: "",
  });

  const dispatch = useDispatch<(arg: any) => Promise<any>>();
  const toast = useToast();

  const onClickRadioButton = React.useCallback((selectedValue: string) => {
    setLanguage(selectedValue);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(auth.language);
  }, [i18n, auth.language]);

  return (
    <UserContainer>
      <h3>{t`user_settings`}</h3>
      <SettingContainer>
        <SettingLabel>{t`language`}</SettingLabel>
        <RadioGroup
          name="setLanguage"
          onClickRadioButton={onClickRadioButton}
          selectedValue={language}
        >
          <Radio value="pl" labelText="PL" />
          <Radio value="en" labelText="EN" />
          <Radio value="de" labelText="DE" />
        </RadioGroup>
      </SettingContainer>
      <SettingContainer>
        <SettingLabel>{t`user_name`}</SettingLabel>
        <Label>
          {t`first_name`}
          <InputElement>
            <PersonIcon
              color={"#dfe3e9"}
              backgroundColor={"transparent"}
              active={false}
              wrapperSize={33}
              iconSize={17}
            />
            <UserNameInput
              value={firstName}
              onInput={() => {
                auth.error = undefined;
                setUserNameValidationError({
                  ...userNameValidationError,
                  firstNameRequiredFail: "",
                  firstNameMinimumLengthFail: "",
                });
              }}
              onChange={({ target }: { target: HTMLInputElement }) =>
                setFirstName(target.value)
              }
              onBlur={() => {
                if (firstName.trim().length === 0) {
                  setUserNameValidationError({
                    ...userNameValidationError,
                    firstNameRequiredFail:
                      UserNameUpdateValidationErrors.firstNameRequiredFail,
                  });
                } else if (firstName.trim().length < 2) {
                  setUserNameValidationError({
                    ...userNameValidationError,
                    firstNameMinimumLengthFail:
                      UserNameUpdateValidationErrors.firstNameMinimumLengthFail,
                  });
                }
              }}
              type="text"
              placeholder={t`first_name`}
              autoComplete={"first-name"}
            />
          </InputElement>
          {userNameValidationError.firstNameRequiredFail && (
            <ErrorAlert>{t`first_name_required_fail`}</ErrorAlert>
          )}
          {userNameValidationError.firstNameMinimumLengthFail && (
            <ErrorAlert>{t`first_name_minimum_length_fail`}</ErrorAlert>
          )}
        </Label>
        <Label>
          {t`last_name`}
          <InputElement>
            <PersonIcon
              color={"#dfe3e9"}
              backgroundColor={"transparent"}
              active={false}
              wrapperSize={33}
              iconSize={17}
            />
            <UserNameInput
              value={lastName}
              onInput={() => {
                auth.error = undefined;
                setUserNameValidationError({
                  ...userNameValidationError,
                  lastNameRequiredFail: "",
                  lastNameMinimumLengthFail: "",
                });
              }}
              onChange={({ target }: { target: HTMLInputElement }) =>
                setLastName(target.value)
              }
              onBlur={() => {
                if (lastName.trim().length === 0) {
                  setUserNameValidationError({
                    ...userNameValidationError,
                    lastNameRequiredFail:
                      UserNameUpdateValidationErrors.lastNameRequiredFail,
                  });
                } else if (lastName.trim().length < 2) {
                  setUserNameValidationError({
                    ...userNameValidationError,
                    lastNameMinimumLengthFail:
                      UserNameUpdateValidationErrors.lastNameMinimumLengthFail,
                  });
                }
              }}
              type="text"
              placeholder={t`last_name`}
              autoComplete={"last-name"}
            />
          </InputElement>
          {userNameValidationError.lastNameRequiredFail && (
            <ErrorAlert>{t`last_name_required_fail`}</ErrorAlert>
          )}
          {userNameValidationError.lastNameMinimumLengthFail && (
            <ErrorAlert>{t`last_name_minimum_length_fail`}</ErrorAlert>
          )}
        </Label>
      </SettingContainer>
      <SettingContainer>
        <SettingLabel>{t`password`}</SettingLabel>
        <PasswordLabel>
          {t`current_password`}
          <Input
            value={currentPassword}
            onInput={() => {
              auth.error = undefined;
              setPasswordValidationError({
                ...passwordValidationError,
                currentRequiredFail: "",
              });
            }}
            onChange={({ target }: { target: HTMLInputElement }) =>
              setCurrentPassword(target.value.trim())
            }
            onBlur={() => {
              if (!currentPassword.trim().length) {
                setPasswordValidationError({
                  ...passwordValidationError,
                  currentRequiredFail:
                    PasswordUpdateValidationErrors.currentRequiredFail,
                });
              }
            }}
            type="password"
            placeholder={t`current_password`}
            autoComplete={"current-password"}
          />
          {passwordValidationError.currentRequiredFail && (
            <ErrorAlert>{t`current_password_required_fail`}</ErrorAlert>
          )}
        </PasswordLabel>
        <PasswordLabel>
          {t`new_password`}
          <Input
            value={newPassword}
            onChange={({ target }: { target: HTMLInputElement }) =>
              setNewPassword(target.value.trim())
            }
            onInput={() => {
              auth.error = undefined;
              setPasswordValidationError({
                ...passwordValidationError,
                newRequiredFail: "",
                minimumLengthFail: "",
              });
            }}
            onBlur={() => {
              if (newPassword.trim().length === 0) {
                setPasswordValidationError({
                  ...passwordValidationError,
                  newRequiredFail:
                    PasswordUpdateValidationErrors.newRequiredFail,
                });
              } else if (newPassword.trim().length < 6) {
                setPasswordValidationError({
                  ...passwordValidationError,
                  minimumLengthFail:
                    PasswordUpdateValidationErrors.minimumLengthFail,
                });
              }
            }}
            type="password"
            placeholder={t`new_password`}
            autoComplete={"new-password"}
          />
          {passwordValidationError.newRequiredFail && (
            <ErrorAlert>{t`new_password_required_fail`}</ErrorAlert>
          )}
          {passwordValidationError.minimumLengthFail && (
            <ErrorAlert>{t`new_password_minimum_length_fail`}</ErrorAlert>
          )}
        </PasswordLabel>
        <PasswordLabel>
          {t`repeat_new_password`}
          <Input
            value={confirmPassword}
            onChange={({ target }: { target: HTMLInputElement }) =>
              setConfirmPassword(target.value.trim())
            }
            onInput={() => {
              auth.error = undefined;
              setPasswordValidationError({
                ...passwordValidationError,
                confirmRequiredFail: "",
                confirmationFail: "",
              });
            }}
            onBlur={() => {
              if (!confirmPassword.trim().length) {
                setPasswordValidationError({
                  ...passwordValidationError,
                  confirmRequiredFail:
                    PasswordUpdateValidationErrors.confirmRequiredFail,
                });
              }
              if (newPassword !== confirmPassword)
                setPasswordValidationError({
                  ...passwordValidationError,
                  confirmationFail: PasswordUpdateValidationErrors.confirmFail,
                });
            }}
            type="password"
            placeholder={t`repeat_new_password`}
            autoComplete={"repeat-new-password"}
          />
          {passwordValidationError.confirmRequiredFail && (
            <ErrorAlert>{t`confirm_password_required_fail`}</ErrorAlert>
          )}
          {passwordValidationError.confirmationFail && (
            <ErrorAlert>{t`confirm_password_fail`}</ErrorAlert>
          )}
        </PasswordLabel>
      </SettingContainer>
      <ButtonsWrapper>
        <SaveButton
          onClick={() => {
            dispatch(updateLanguage(language));

            if (
              firstName.trim() &&
              lastName.trim() &&
              Object.values(userNameValidationError).every(
                (x) => x === null || x === ""
              )
            ) {
              dispatch(changeUserName(firstName, lastName));
            }

            if (
              currentPassword &&
              newPassword &&
              confirmPassword &&
              Object.values(passwordValidationError).every(
                (x) => x === null || x === ""
              )
            ) {
              toast.add({
                children: <span>{t`profile_change_start`}</span>,
              });
              dispatch(changePassword({ currentPassword, newPassword }))
                .then(() => {
                  toast.add({
                    type: ToastType.SUCCESS,
                    children: <span>{t`profile_change_success`}</span>,
                  });
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                })
                .catch(() => {
                  toast.add({
                    type: ToastType.ERROR,
                    children: <span>{t`profile_change_fail`}</span>,
                  });
                });
            }
          }}
        >
          {t`save`}
        </SaveButton>
        <Link to={`/trailers`}>
          <CancelButton>{t`cancel`}</CancelButton>
        </Link>
      </ButtonsWrapper>
    </UserContainer>
  );
}

const UserContainer = styled.div`
  margin: 10px;
  padding: 10px 20px 0;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
`;

const SettingContainer = styled.div`
  margin: 5px 0 0;
  display: flex;
  flex-direction: column;
`;

const SettingLabel = styled.div`
  font-size: 16px;
  margin: 0 0 10px;
  line-height: 1.5;
  color: #354052;
`;

const ErrorAlert = styled.span`
  display: flex;
  font-size: 14px;
  line-height: 1.5;
  color: #c40000;
`;

const Label = styled.label`
  margin: 0 0 10px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #354052;
  position: relative;
`;

const InputElement = styled.div`
  margin-top: 5px;
  width: 100%;
  max-width: 320px;
  display: flex;
  align-items: center;
  border: 1px solid #dfe3e9;
  border-radius: 2px;
`;

const UserNameInput = styled.input`
  padding: 6px 8px 6px 0;
  width: 300px;
  font-size: 14px;
  line-height: 1.5;
  color: #354052;
  border: none;
  outline: none;
  border-radius: 2px;
  z-index: 1000;

  &::placeholder {
    color: #dfe3e9;
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

const ButtonsWrapper = styled.div`
  margin: 10px 0;
  flex: 100%;
  display: flex;
`;

const SaveButton = styled.button`
  margin: 5px 10px 0 0;
  padding: 8px 52px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 600;
  color: #ffffff;
  background-color: #4a90e2;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  &::first-letter {
    text-transform: capitalize;
  }
`;

const CancelButton = styled(SaveButton)`
  background-color: #cccccc;
`;
