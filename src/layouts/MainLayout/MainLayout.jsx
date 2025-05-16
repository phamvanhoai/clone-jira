import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";

const drawerWidth = 240;

function MainLayout(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <SideBar
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        container={container}
        mobileOpen={mobileOpen}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },

          "@media (max-width:1200px)": {
            p: 0,
            width: "100%",
          },
        }}
      >
        <Toolbar />

        <Outlet />

        <Footer />
      </Box>
    </Box>
  );
}

MainLayout.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default MainLayout;
