import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DialogInfoUser(props) {
  const { open, handleClose, userInfo } = props;

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth={"xs"}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          fontSize: "1.5rem",
          fontWeight: 800,
          textTransform: "uppercase",
          color: "#172B4D",
        }}
      >
        Info User
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box>
          <Typography
            color={"#172B4D"}
            fontWeight={"bold"}
            sx={{ margin: "10px 0" }}
          >
            User Name:{" "}
            <Typography component={"span"}>{userInfo.name}</Typography>
          </Typography>
          <Typography
            color={"#172B4D"}
            fontWeight={"bold"}
            sx={{ margin: "10px 0" }}
          >
            User Id:{" "}
            <Typography component={"span"}>{userInfo.userId}</Typography>
          </Typography>
          <Typography
            color={"#172B4D"}
            fontWeight={"bold"}
            sx={{ margin: "10px 0" }}
          >
            Email: <Typography component={"span"}>{userInfo.email}</Typography>
          </Typography>
          <Typography
            color={"#172B4D"}
            fontWeight={"bold"}
            sx={{ margin: "10px 0" }}
          >
            Password: <Typography component={"span"}>[Hidden]</Typography>
          </Typography>
          <Typography
            color={"#172B4D"}
            fontWeight={"bold"}
            sx={{ margin: "16px 0" }}
          >
            Phone number:{" "}
            <Typography component={"span"}>{userInfo.phoneNumber}</Typography>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
