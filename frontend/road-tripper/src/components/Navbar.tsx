import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link as NavLink } from "react-router-dom";
import { ThemeButton } from "./ThemeButton";
import { useMediaQuery } from "react-responsive";
import {
  AppBar,
  AppBarProps,
  Toolbar,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useAuth } from "../core/AuthContext";
import { Logout as LogoutIcon } from "../icons/Logout";
import { Logout } from "./Logout";
import { useState } from "react";
import logo from "../assets/logo-removebg.png";
import logo250 from "../assets/logo250-removebg.png";

export function NavBar(props: AppBarProps): JSX.Element {
  const { sx, ...other } = props;

  // base on if user is logged in or not, display different things
  const { currentUser } = useAuth();
  const [modal, setModal] = useState(false);

  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 599px)",
  });

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
              to="/spots"
              component={NavLink}
              sx={{ pl: 2, pr: 2 }}
            >
              Spots
            </Link>
            <Link
              color="inherit"
              underline="none"
              to="/profile"
              component={NavLink}
              sx={{ pl: 2, pr: 2 }}
            >
              Profile
            </Link>
            {!currentUser && (
              <Link
                color="inherit"
                underline="none"
                to="/login"
                component={NavLink}
                sx={{ pl: 2, pr: 2 }}
              >
                Login
              </Link>
            )}
            {currentUser && (
              <>
                <button
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
                  onClick={() => setModal(true)}
                >
                  <LogoutIcon className="h-8 w-8" aria-hidden="true" />
                </button>

                <NavLink
                  to="/profile"
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.photoURL}
                    alt=""
                  />
                </NavLink>
              </>
            )}
          </Box>
          <ThemeButton />
        </Toolbar>
      </AppBar>
      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  );
}
