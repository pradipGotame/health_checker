import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Logo from "./Logo";
import { Link as RouterLink, useLocation } from "react-router-dom"; // React Router Link
import { Link } from "@mui/material";
import useLogout from "../../hooks/useLogout";
import NotificationBadge from '../Notification/NotificationBadge';
import { useAuth } from "../../hooks/useAuth";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function NavBar() {
  const [open, setOpen] = React.useState(false);
  const { logout } = useLogout();
  const { user } = useAuth();

  const location = useLocation();
  const [activeLink, setActiveLink] = React.useState(location.pathname);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const linkStyle = (path) => ({
    color: activeLink === path ? "white" : "gray",
    textDecoration: "none",
    fontWeight: activeLink === path ? "bold" : "normal",
    marginRight: 16,
  });

  React.useEffect(() => {
    setActiveLink("/dashboard");
  }, []);

  React.useEffect(() => {
    if (!user) {
      setActiveLink("/");
    }
    console.log("user", user);
  }, [user]);

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar
          variant="dense"
          sx={{
            borderRadius: "12px",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Logo variant="h6" />
            <Stack direction="row" spacing={2} alignItems="center">
              <NotificationBadge />
              {localStorage.getItem("userId") && (
                <Stack
                  direction="row"
                  sx={{ display: { xs: "none", md: "flex" }, ml: 4 }}
                  spacing={2}
                >
                  <Link
                    component={RouterLink}
                    to="/dashboard"
                    style={linkStyle("/dashboard")}
                    onClick={() => setActiveLink("/dashboard")}
                  >
                    Home
                  </Link>

                  <Link
                    href="/featuress"
                    underline="none"
                    style={linkStyle("/featuress")}
                    onClick={() => setActiveLink("/featuress")}
                  >
                    Features
                  </Link>

                  <Link
                    component={RouterLink}
                    to="/activity-page"
                    style={linkStyle("/activity-page")}
                    onClick={() => setActiveLink("/activity-page")}
                  >
                    Workout
                  </Link>

                  <Link
                    component={RouterLink}
                    to="/profile"
                    style={linkStyle("/profile")}
                    onClick={() => setActiveLink("/profile")}
                  >
                    Profile
                  </Link>
                  <Link
                    component={RouterLink}
                    to="/notification"
                    style={linkStyle("/notification")}
                    onClick={() => setActiveLink("/notification")}
                  >
                    Notification
                  </Link>
                </Stack>
              )}
            </Stack>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {localStorage.getItem("userId") ? (
              <Button
                variant="text"
                color="secondary"
                style={{
                  textDecoration: "none",
                  fontWeight: "bold",
                  color: "white",
                }}
                onClick={logout}
              >
                Sign out
              </Button>
            ) : (
              <Link
                component={RouterLink} // Ensures MUI Link behaves like React Router's Link
                to="/login"
                style={{
                  textDecoration: "none",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Sign in
              </Link>
            )}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem>Features</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
