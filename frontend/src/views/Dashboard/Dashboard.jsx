import { Button, Typography } from "@mui/material";
import React from "react";
import useLogout from "../../hooks/useLogout";

export default function Dashboard() {
  const { logout } = useLogout();
  return (
    <>
      <Typography style={{ color: "white" }}>Welcome to dashboard</Typography>
      <Button>
        <Typography>Sign Out</Typography>
      </Button>
    </>
  );
}
