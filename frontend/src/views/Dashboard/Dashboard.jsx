import { Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

export default function Dashboard() {
  const { logout } = useLogout();
  const navigate = useNavigate();

  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <Typography>Welcome to dashboard</Typography>
      <Stack direction="row" spacing={2}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/activity-page')}
        >
          Create Activity
        </Button>
        <Button 
          onClick={logout} 
          variant="outlined" 
          color="error"
        >
          Sign Out
        </Button>
      </Stack>
    </Stack>
  );
}
