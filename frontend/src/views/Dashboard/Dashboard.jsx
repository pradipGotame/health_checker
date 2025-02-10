import { Button, Typography } from "@mui/material";
import useLogout from "../../hooks/useLogout";

export default function Dashboard() {
  const { logout } = useLogout();
  return (
    <>
      <Typography>Welcome to dashboard</Typography>
      <Button onClick={logout}>Sign Out</Button>
    </>
  );
}
