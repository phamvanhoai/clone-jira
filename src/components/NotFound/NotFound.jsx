import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundImage: `url('https://cdn.svgator.com/images/2024/04/electrocuted-caveman-animation-404-error-page.gif')`,
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",

        "@media (max-width:600px)": {
          backgroundSize: "300px",
        },
      }}
    >
      <Button
        sx={{
          color: "primary",
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",

          "&:hover": {
            color: "#ff9f1a",
            boxShadow: `rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px`,
            fontWeight: "bold",
          },
        }}
        variant="contained"
        onClick={() => navigate("/")}
      >
        Go to home page
      </Button>
    </Box>
  );
}
