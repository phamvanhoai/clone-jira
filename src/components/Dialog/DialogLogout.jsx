import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

export default function DialogLogout({ open, handleClose, handleSignout }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 12,
          px: 4,
          py: 3,
          backgroundColor: "#fff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          textAlign: "center",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "22px",
          color: "#1c1c1e",
          mb: 2,
          p: 0,
        }}
      >
        Log Out?
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Typography
          variant="body2"
          sx={{ color: "#8e8e93", mb: 4, px: 1 }}
        >
          You will need to sign in again to access your account.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Avatar
            src="/img/animation_ask_small.gif"
            alt="ask"
            sx={{
              width: 120,
              height: 120,
              borderRadius: 3,
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          px: 4,
          pb: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            handleSignout();
            handleClose();
          }}
          fullWidth
          sx={{
            backgroundColor: "#ff453a",
            color: "#fff",
            textTransform: "none",
            borderRadius: 16,
            fontWeight: 600,
            fontSize: "16px",
            paddingY: 1.2,
            "&:hover": {
              backgroundColor: "#ff6b66",
            },
          }}
        >
          Log Out
        </Button>

        <Button
          onClick={handleClose}
          fullWidth
          sx={{
            backgroundColor: "transparent",
            color: "#007aff",
            textTransform: "none",
            borderRadius: 16,
            fontWeight: 600,
            fontSize: "16px",
            paddingY: 1.2,
            "&:hover": {
              backgroundColor: "#f0f0f5",
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
