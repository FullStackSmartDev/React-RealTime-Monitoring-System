import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AuthState } from "@features/auth/reducer";
import { logo } from "@assets/index";
import { logout } from "@features/auth/actions";
import { useTypedSelector } from "@store/index";
import styled from "@ui/Theme";
import { MenuIcon } from "@common/icons";
import Avatar from "@ui/Navbar/components/avatar";

function Navbar() {
  const { t } = useTranslation("navbar");
  const auth = useTypedSelector<AuthState>((state) => state.auth);
  const dispatch = useDispatch();
  const [mobileMenu, setMobileMenu] = React.useState(false);

  const location = useLocation();

  React.useEffect(() => {
    setMobileMenu(false);
  }, [location.pathname]);

  const history = useHistory();
  let avatarName;

  if (auth.firstName) {
    avatarName =
      auth.firstName.charAt(0).toUpperCase() +
      auth.lastName.charAt(0).toUpperCase();
  } else {
    let userName = auth.login.substring(0, auth.login.lastIndexOf("@"));

    if (userName.includes(".")) {
      avatarName =
        userName.split(".")[0].charAt(0).toUpperCase() +
        userName.split(".")[1].charAt(0).toUpperCase();
    } else {
      avatarName = userName.charAt(0).toUpperCase();
    }
  }

  const onAvatarClick = React.useCallback(() => {
    history.push("/user");
  }, [history]);

  if (!auth.token) {
    return null;
  }

  return (
    <NavbarContainer>
      <Logo to="/dashboard">
        <img src={logo} alt="Safeway" />
      </Logo>
      <Wrapper isOpen={mobileMenu}>
        <Menu>
          <MenuItem>
            <NavLink to="/trailers">{t`trailers`}</NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to="/map">{t`map`}</NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to="/whatsnew">{t`whatsnew`}</NavLink>
          </MenuItem>
        </Menu>
        <OtherMenus>
          <Menu>
            <MenuItem>
              <Logout onClick={() => dispatch(logout())}>{t`logout`}</Logout>
            </MenuItem>
          </Menu>
          <AvatarContainer>
            <Avatar
              backgroundColor="#f06595"
              textColor="#fff"
              name={avatarName}
              onClick={onAvatarClick}
            />
          </AvatarContainer>
        </OtherMenus>
      </Wrapper>
      <MobileTrigger onClick={() => setMobileMenu((v) => !v)}>
        <MenuIcon
          color={mobileMenu ? "#ffffff" : "#272422"}
          active={true}
          iconSize={24}
        />
      </MobileTrigger>
    </NavbarContainer>
  );
}

export default React.memo(Navbar);

const Logo = styled(NavLink)`
  min-width: 280px;
  display: block;
  align-self: center;
  text-align: center;

  @media screen and (max-width: 812px) {
    text-align: left;
  }
`;

const MobileTrigger = styled.span`
  display: none;
  @media screen and (max-width: 812px) {
    display: block;
    position: absolute;
    height: 24px;
    width: 24px;
    top: 6px;
    right: 6px;
    z-index: 2;
  }
`;

const NavbarContainer = styled.nav`
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: row;
  height: 40px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
`;

const Menu = styled.ol`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style: none;

  & + & {
    margin-left: 35px;
  }
`;

const OtherMenus = styled.div`
  margin-left: auto;
  flex-direction: row;
  display: flex;
`;

const Logout = styled.button`
  border: 0;
  background: none;
  outline: none;
  cursor: pointer;
`;

const AvatarContainer = styled.button`
  border: 0;
  background: none;
  outline: none;
  cursor: pointer;
`;

const MenuItem = styled.li`
  flex: 1;
  font-size: 14px;
  font-weight: bold;
  line-height: 40px;
  white-space: nowrap;
  & + & {
    margin-left: 10px;
  }
  & a {
    color: #272422;
    background-color: #ffffff;
    display: inline-block;
    line-height: 40px;
    text-align: center;
    text-decoration: none;
    position: relative;
    padding: 0 10px;
    &::first-letter {
      text-transform: uppercase;
    }

    &:hover,
    &.active {
      &::after {
        content: " ";
        display: inline-block;
        position: absolute;
        height: 4px;
        background: #4a90e2;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }
`;

const Wrapper = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex: 1;

  @media screen and (max-width: 812px) {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: white;
    height: 100vh;
    flex-direction: column;
    width: 70vw;
    transform: translateX(-100vw);
    transition: 0.25s all;

    ${({ isOpen }) =>
      isOpen &&
      `
      transform: translateX(0);
      box-shadow: 0 0 10px 100vw rgba(0,0,0,0.5);
    `}

    ${Menu} {
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #d4d4d4;
    }

    ${OtherMenus},
    ${Menu} {
      flex-direction: column;
      width: 100%;
      margin-left: 0;

      ${MenuItem} {
        margin: 0;
      }

      a,
      button {
        line-height: 1.4;
        margin: 0;
        padding: 10px;
        display: block;
        text-align: left;
      }

      button {
        text-align: center;
        width: 100%;
      }
    }

    ${OtherMenus} {
      ${Menu} {
        flex-direction: row;
        text-align: center;
      }
    }
  }
`;
