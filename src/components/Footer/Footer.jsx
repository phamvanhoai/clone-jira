import React from "react";
import MediaQueries from "../MediaQueries/MediaQueries";
import { Box } from "@mui/material";
import FooterMobile from "./FooterMobile";
import FooterDesktop from "./FooterDesktop";

export default function Footer() {
  const { isDesktop, isTablet, isMobile } = MediaQueries();
  return (
    <Box>
      {isMobile && <FooterMobile />}
      {isTablet && <FooterMobile />}
      {isDesktop && <FooterDesktop />}
    </Box>
  );
}
