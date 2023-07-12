import { useState, useEffect, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Box, TextField, Typography } from "@mui/material";
import { useAuth } from "../core/AuthContext";
import { useMutation } from "../core/api";
import { ProfileProps } from "./Profile";
import { NewAccountForm } from "../forms/NewAccount";

export default function Register() {
  const navigate = useNavigate();

  const { currentUser, register, setError } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, []);

  return <NewAccountForm />;
}
