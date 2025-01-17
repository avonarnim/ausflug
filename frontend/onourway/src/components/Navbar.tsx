import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link as NavLink, useNavigate } from "react-router-dom";
import { ThemeButton } from "./ThemeButton";
import { useMediaQuery } from "react-responsive";
import {
  AppBar,
  AppBarProps,
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { useAuth } from "../core/AuthContext";
import { Logout as LogoutIcon } from "../icons/Logout";
import { Logout } from "./Logout";
import { useState, useEffect } from "react";
import logo from "../assets/logo-removebg.png";
import logo250 from "../assets/logo250-removebg.png";

export function NavBar(props: AppBarProps): JSX.Element {
  const { sx, ...other } = props;

  // base on if user is logged in or not, display different things
  const { currentUser } = useAuth();
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 599px)",
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [loginAnchorEl, setLoginAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const open = Boolean(anchorEl);
  const loginOpen = Boolean(loginAnchorEl);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const handleAccountClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAccountClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoginAnchorEl(event.currentTarget);
  };
  const handleLoginClose = () => {
    setLoginAnchorEl(null);
  };

  const handleLogin = () => {
    setLoginAnchorEl(null);
    navigate(`/login`);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    setModal(true);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate(`/profile/${currentUser?.uid}`);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleMobileMenu = (newPage: string) => {
    setMobileMenuAnchorEl(null);
    navigate(newPage);
  };

  return (
    <>
      <AppBar
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, ...sx }}
        color="default"
        variant="outlined"
        {...other}
      >
        <Toolbar>
          <Typography variant="h1">
            <Link color="inherit" underline="none" to="/" component={NavLink}>
              <Box
                display={"flex"}
                alignContent="center"
                justifyContent={"center"}
              >
                {isTabletOrMobile ? (
                  <img src={logo250} height={50} />
                ) : (
                  <img src={logo} height={50} />
                )}
              </Box>
            </Link>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Link
              color="inherit"
              underline="none"
              to="/trips"
              component={NavLink}
              sx={{ pl: 2, pr: 2 }}
            >
              Trips
            </Link>
            <Link
              color="inherit"
              underline="none"
              to="/search"
              component={NavLink}
              sx={{ pl: 2, pr: 2 }}
            >
              Search
            </Link>
            <Link
              color="inherit"
              underline="none"
              to="/gas"
              component={NavLink}
              sx={{ pl: 2, pr: 2 }}
            >
              Gas
            </Link>
            <Link
              color="inherit"
              underline="none"
              to="/guide"
              component={NavLink}
              sx={{ pl: 2, pr: 2 }}
            >
              Guides
            </Link>
            {currentUser && (
              <Link
                color="inherit"
                underline="none"
                to="/activity"
                component={NavLink}
                sx={{ pl: 2, pr: 2 }}
              >
                Activity
              </Link>
            )}
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            width="100%"
            pl="auto"
            sx={{ right: 0 }}
          >
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
                sx={{ display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              {/* Add a dropdown menu for mobile */}
              <Menu
                anchorEl={mobileMenuAnchorEl}
                keepMounted
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
              >
                <MenuItem onClick={() => handleMobileMenu("/trips")}>
                  Trips
                </MenuItem>
                <MenuItem onClick={() => handleMobileMenu("/search")}>
                  Search
                </MenuItem>
                <MenuItem onClick={() => handleMobileMenu("/gas")}>
                  Gas
                </MenuItem>
                <MenuItem onClick={() => handleMobileMenu("/activity")}>
                  Activity
                </MenuItem>
                <MenuItem onClick={() => handleMobileMenu("/guide")}>
                  Guides
                </MenuItem>
              </Menu>
            </Box>
            <ThemeButton />
            {currentUser ? (
              <>
                <IconButton
                  id="account-menu-button"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleAccountClick}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="account-menu"
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleAccountClose}
                  MenuListProps={{
                    "aria-labelledby": "account-menu-button",
                  }}
                >
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <IconButton
                  id="login-menu-button"
                  aria-controls={loginOpen ? "login-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={loginOpen ? "true" : undefined}
                  onClick={handleLoginClick}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="login-menu"
                  open={loginOpen}
                  anchorEl={loginAnchorEl}
                  onClose={handleLoginClose}
                  MenuListProps={{
                    "aria-labelledby": "login-menu-button",
                  }}
                >
                  <MenuItem onClick={handleLogin}>Login</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  );
}
