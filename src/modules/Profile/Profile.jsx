import {
  Avatar,
  Box,
  Button,
  Container,
  Snackbar,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import { useUserContext } from "../../contexts/UserContext/UserContext";
import EditProfile from "./EditProfile/EditProfile";
import { useMutation } from "@tanstack/react-query";
import { editUser } from "../../apis/userAPI";
import { Alert } from "@mui/material";

export default function Profile() {
  const [isEdit, setIsEdit] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const { currentUser } = useUserContext();

  const { mutate: handleEditProfile, error } = useMutation({
    mutationFn: (user) => editUser(user),
    onSuccess: () => {
      setOpenSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    },
    onError: () => {
      setOpenError(true);
    },
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenError(false);
    setOpenSuccess(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f9f9fb 0%, #e3e4e8 100%)",
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 40,
        paddingBottom: 40,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "#fff",
          borderRadius: 4,
          boxShadow:
            "0 12px 32px rgba(0,0,0,0.1)",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="#0a0a0a"
          mb={3}
          sx={{ letterSpacing: "0.02em" }}
        >
          My Profile
        </Typography>

        <Avatar
          alt={currentUser.name}
          src={currentUser.avatar}
          sx={{
            width: 140,
            height: 140,
            mb: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}
        />

        {!isEdit ? (
          <>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#0a0a0a"
              mb={1}
            >
              {currentUser.name}
            </Typography>

            <Divider
              sx={{ width: "60%", mb: 3, borderColor: "#ddd" }}
            />

            <Box sx={{ width: "100%" }}>
              {[
                { label: "User ID", value: currentUser.id },
                { label: "Email", value: currentUser.email },
                { label: "Password", value: "[Hidden]" },
                { label: "Phone number", value: currentUser.phoneNumber },
              ].map(({ label, value }) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingY: 1.2,
                    borderBottom: "1px solid #eee",
                    fontSize: "1rem",
                    color: "#333",
                    fontWeight: 500,
                  }}
                >
                  <Typography color="#666">{label}</Typography>
                  <Typography>{value}</Typography>
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              sx={{
                mt: 4,
                backgroundColor: "#007aff",
                borderRadius: 3,
                paddingY: 1.3,
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                width: "100%",
                boxShadow:
                  "0 6px 12px rgba(0, 122, 255, 0.35)",
                ":hover": {
                  backgroundColor: "#005ecb",
                  boxShadow:
                    "0 8px 20px rgba(0, 94, 203, 0.5)",
                },
              }}
              onClick={() => setIsEdit(true)}
            >
              Edit Profile
            </Button>
          </>
        ) : (
          <EditProfile
            setIsEdit={setIsEdit}
            currentUser={currentUser}
            handleEditProfile={handleEditProfile}
          />
        )}

        {/* Alert thông báo */}
        <Stack spacing={2} sx={{ width: "100%", mt: 3 }}>
          <Snackbar
            open={openSuccess}
            autoHideDuration={3000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseAlert}
              severity="success"
              variant="filled"
              sx={{
                width: 320,
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                fontSize: "1rem",
                letterSpacing: "0.02em",
              }}
            >
              Chỉnh sửa profile thành công
            </Alert>
          </Snackbar>

          <Snackbar
            open={openError}
            autoHideDuration={4000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseAlert}
              severity="error"
              variant="filled"
              sx={{
                width: 320,
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                fontSize: "1rem",
                letterSpacing: "0.02em",
              }}
            >
              {error?.message || "Có lỗi xảy ra"}
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
    </Box>
  );
}
