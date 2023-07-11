import React, { ChangeEvent, Component, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useMutation } from "../core/api";
import { ProfileProps } from "../pages/Profile";
import { FiberManualRecord } from "@mui/icons-material";
import { styled } from "@mui/system";

const StyledButton = styled(Button)`
  border-radius: 20px;
  padding: 10px 16px;
  background-color: #fff;
`;

export const StyledIndicator = styled(FiberManualRecord)`
  color: ${({ color }) => color};
  margin-right: 8px;
`;

const StyledMenuItem = styled(MenuItem)`
  &:hover {
    background-color: #f0f0f0;
  }
`;

export type Status =
  | "Planning a road trip"
  | "Looking to join a trip"
  | "Looking for trip partners"
  | "Inactive"
  | "On a trip";

export const statusMap: Record<
  Status,
  | "action"
  | "disabled"
  | "inherit"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning"
> = {
  "Planning a road trip": "primary",
  "Looking to join a trip": "secondary",
  "Looking for trip partners": "warning",
  Inactive: "info",
  "On a trip": "error",
};

export function ProfileStatus(props: {
  user?: ProfileProps;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const [status, setStatus] = useState<string>(
    props.user?.status || "Inactive"
  );

  return (
    <div>
      <StyledButton
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        endIcon={<StyledIndicator color={statusMap[status as Status]} />}
      >
        {status}
      </StyledButton>
    </div>
  );
}

export function ProfileStatusSelector(props: {
  user?: ProfileProps;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [status, setStatus] = useState<string>(
    props.user?.status || "Inactive"
  );

  const updateProfile = useMutation("UpdateProfile");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionSelect = async (option: string) => {
    setStatus(option);
    if (props.handleChange) {
      const event = {
        target: {
          name: "status",
          value: option,
        },
      } as ChangeEvent<HTMLInputElement>;
      props.handleChange(event);
    } else if (props.user) {
      const updateRes = await updateProfile.commit({
        ...props.user,
        status: option,
      });
      console.log(updateRes);
    }
    handleClose();
  };

  return (
    <div>
      <StyledButton
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        onClick={handleClick}
        endIcon={<StyledIndicator color={statusMap[status as Status]} />}
      >
        {status}
      </StyledButton>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(statusMap).map((option, index) => (
          <StyledMenuItem
            key={index}
            onClick={() => handleOptionSelect(option)}
          >
            <StyledIndicator color={statusMap[option as Status]} />
            {option}
          </StyledMenuItem>
        ))}
      </Menu>
    </div>
  );
}
