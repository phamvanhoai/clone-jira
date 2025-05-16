import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  NoteAddOutlined,
  DescriptionOutlined,
  DocumentScannerOutlined,
  AccountBoxOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import JiraLogo from "./JiraLogo";

const drawerWidth = 260;

const menuItems = [
  { text: "Create Project", icon: <NoteAddOutlined /> , path: "/createProject"},
  { text: "Project Management", icon: <DescriptionOutlined />, path: "/" },
  { text: "Project Detail", icon: <DocumentScannerOutlined />, path: null, disabled: true },
  { text: "My Profile", icon: <AccountBoxOutlined />, path: "/profile" },
  { text: "User Management", icon: <PeopleAltOutlined />, path: "/user" },
];

export default function SideBar({ container, mobileOpen, handleDrawerToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState("Project Management");
  const [isProjectDetailActive, setIsProjectDetailActive] = useState(false);
  const [previousProjectDetailPath, setPreviousProjectDetailPath] = useState(null);

  useEffect(() => {
    const path = location.pathname;

    if (path === "/createProject") {
      setSelectedItem("Create Project");
    } else if (path.startsWith("/projectDetail/")) {
      setSelectedItem("Project Detail");
      setIsProjectDetailActive(true);
      setPreviousProjectDetailPath(path);
    } else if (path === "/profile") {
      setSelectedItem("My Profile");
    } else if (path === "/user") {
      setSelectedItem("User Management");
    } else {
      setSelectedItem("Project Management");
      setIsProjectDetailActive(false);
    }
  }, [location]);

  const handleClick = (item) => {
    if (item.text === "Project Detail" && !isProjectDetailActive) return;

    setSelectedItem(item.text);

    if (item.text === "Project Detail" && isProjectDetailActive && previousProjectDetailPath) {
      navigate(previousProjectDetailPath);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#fff",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar sx={{ px: 0 }}>
        <JiraLogo />
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, p: 0 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            disabled={item.disabled && !isProjectDetailActive}
            selected={selectedItem === item.text}
            onClick={() => handleClick(item)}
            sx={{
              mx: 2,
              my: 0.5,
              borderRadius: 2,
              color: selectedItem === item.text ? "#0052CC" : "#444",
              fontWeight: selectedItem === item.text ? 600 : 400,
              transition: "background-color 0.3s ease",
              "&.Mui-selected": {
                bgcolor: "rgba(0, 82, 204, 0.12)",
                "&:hover": {
                  bgcolor: "rgba(0, 82, 204, 0.2)",
                },
              },
              "&:hover": {
                bgcolor: "rgba(0, 82, 204, 0.08)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: selectedItem === item.text ? "#0052CC" : "#888",
                minWidth: 36,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: selectedItem === item.text ? 600 : 400,
                fontSize: 16,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="sidebar navigation"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
