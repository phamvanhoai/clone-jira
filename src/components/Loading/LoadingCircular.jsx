import { Box, CircularProgress } from "@mui/material";
import React from "react";

export default function LoadingCircular() {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "absolute",
        top: "50%",
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
          transform: "translateY(-50%)",
        }}
      >
        <CircularProgress />
      </Box>
    </Box>
  );
}
