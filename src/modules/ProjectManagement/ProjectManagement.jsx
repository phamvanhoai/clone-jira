import { Box } from "@mui/material";
import React from "react";
import MediaQueries from "../../components/MediaQueries/MediaQueries";
import ProjectManagementDesktop from "./ProjectManagementDesktop";
import ProjectManagementMobile from "./ProjectManagementMobile";

export default function ProjectManagement() {
  const { isDesktop, isTablet, isMobile } = MediaQueries();
  return (
    <Box>
      {isMobile && <ProjectManagementMobile />}
      {isTablet && <ProjectManagementMobile />}
      {isDesktop && <ProjectManagementDesktop />}
    </Box>
  );
}
