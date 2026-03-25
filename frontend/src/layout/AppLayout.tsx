import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Dashboard", to: "/", icon: <DashboardIcon /> },
  { label: "Projects", to: "/projects", icon: <FolderIcon /> },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            TeamOps Lite
          </Typography>

          {user && (
            <Typography variant="body2" sx={{ mr: 1, opacity: 0.85 }}>
              {user.displayName}
            </Typography>
          )}

          <Tooltip title="Sign out">
            <IconButton color="inherit" onClick={handleLogout} size="small">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List disablePadding>
          {NAV_ITEMS.map(({ label, to, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {({ isActive }) => (
                <ListItemButton selected={isActive}>
                  <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              )}
            </NavLink>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
