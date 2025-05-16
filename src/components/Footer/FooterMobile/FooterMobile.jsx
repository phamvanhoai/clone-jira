import { Box, Typography } from "@mui/material";
import React from "react";

const CURRENT_YEAR = new Date().getFullYear();
const AUTHOR_NAME = "Huỳnh Tuấn";
const PROJECT_NAME = "Capstone Jira";

export default function FooterMobile() {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingY: 3,
        paddingX: 2,
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "#fafafa",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        userSelect: "none",
      }}
    >
      <Box sx={{ mb: 2, width: 90 }}>
        <img
          src="/img/jira.png"
          alt="Jira Footer Logo"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", fontWeight: 400, fontSize: 14 }}
      >
        © {CURRENT_YEAR}{" "}
        <Box component="span" sx={{ fontWeight: 600 }}>
          {PROJECT_NAME} - {AUTHOR_NAME}
        </Box>
        . Designed by {AUTHOR_NAME}
      </Typography>
    </Box>
  );
}
