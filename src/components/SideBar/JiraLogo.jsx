import React from "react";
import { Box, Typography } from "@mui/material";

export default function JiraLogo() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "16px 24px",
        userSelect: "none",
        cursor: "default",
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50% 50% 50% 0",
          backgroundColor: "#0052CC",
          transform: "rotate(-45deg)",
          boxShadow: "0 3px 8px rgba(0,82,204,0.4)",
        }}
      />
      <Typography
        variant="h5"
        sx={{
          fontWeight: "700",
          color: "#0052CC",
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
          letterSpacing: 1.4,
        }}
      >
        Jira
      </Typography>
    </Box>
  );
}
