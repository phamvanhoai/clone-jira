import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserContext } from "../../contexts/UserContext/UserContext";
import DialogLogout from "../Dialog/DialogLogout";
import { useNavigate } from "react-router-dom";

export default function Header({ drawerWidth = 240, handleDrawerToggle }) {
  const { currentUser, handleSignout } = useUserContext();
  const [openLogout, setOpenLogout] = useState(false);
  const navigate = useNavigate();

  const handleClickOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#fff",
          color: "#000",
          borderBottom: "1px solid #e0e0e0",
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        }}
      >
        <Toolbar
          sx={{
            minHeight: 56,
            px: { xs: 1, sm: 3 },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Menu button mobile */}
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { sm: "none" },
              color: "#0052CC",
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Avatar
            src="/img/jira.png"
            alt="Jira Logo"
            variant="square"
            sx={{
              width: { xs: 70, sm: 90 },
              height: "auto",
              cursor: "pointer",
              filter: "drop-shadow(0 0 1px rgba(0,82,204,0.6))",
            }}
            onClick={() => navigate("/")}
          />

          {/* Right side user/auth */}
          {!!currentUser ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={currentUser.avatar}
                alt="User Avatar"
                sx={{
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  boxShadow: "0 0 5px rgba(0,82,204,0.4)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
                onClick={() => navigate("/profile")}
              />

              <IconButton
                onClick={handleClickOpenLogout}
                aria-label="logout"
                sx={{
                  color: "#0052CC",
                  transition: "background-color 0.2s",
                  "&:hover": { bgcolor: "rgba(0,82,204,0.1)" },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                fontSize: 15,
                fontWeight: 600,
                color: "#0052CC",
                userSelect: "none",
              }}
            >
              <Typography
                sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                onClick={() => navigate("/sign-in")}
              >
                Log in
              </Typography>
              <Box
                sx={{ width: 1, height: 20, borderLeft: "1px solid #ccc" }}
              />
              <Typography
                sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                onClick={() => navigate("/sign-up")}
              >
                Register
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <DialogLogout
        open={openLogout}
        handleClose={handleCloseLogout}
        handleSignout={handleSignout}
      />
    </>
  );
}
