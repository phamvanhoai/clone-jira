import React from "react";

import MediaQueries from "../../components/MediaQueries/MediaQueries";
import { Box } from "@mui/material";
import UserManageMentDesktop from "./UserManageMentDesktop/UserManageMentDesktop";
import UserManagementMobile from "./UserManagementMobile/UserManagementMobile";

export default function UserManagement() {
  const { isDesktop, isTablet, isMobile } = MediaQueries();
  return (
    <Box>
      {isMobile && <UserManagementMobile />}
      {isTablet && <UserManagementMobile />}
      {isDesktop && <UserManageMentDesktop />}
    </Box>
  );
}
