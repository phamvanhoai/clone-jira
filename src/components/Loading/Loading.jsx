import { Box, Typography } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <Box
      sx={{
        backgroundColor: "#f0f0f0",
        height: "100%",
        width: "100%",
        position: "absolute",
        top: "0",
        right: "0",
        zIndex: 10000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: "0.7",
          transform: "translateY(100%)",
        }}
      >
        <img src="/img/load.gif" alt="loading" width={250} />
        <Typography component={"h3"} variant="h4">
          Loading...
        </Typography>
      </Box>
    </Box>
  );
}
