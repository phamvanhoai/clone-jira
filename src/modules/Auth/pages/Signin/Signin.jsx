import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React, { useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { signin } from "../../../../apis/userAPI";
import { Navigate, useSearchParams } from "react-router-dom";
import { useUserContext } from "../../../../contexts/UserContext/UserContext";
import { Link as RouterLink } from "react-router-dom";

export default function Signin() {
  const [checked, setChecked] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const { currentUser, handleSignin: onSigninSuccess } = useUserContext();
  const [searchParams] = useSearchParams();

  const signinSchema = object({
    email: string()
      .required("Please enter your email")
      .email("Invalid email format"),
    password: string().required("Please enter your password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signinSchema),
    mode: "onTouched",
  });

  const { mutate: handleSignin, error } = useMutation({
    mutationFn: (payload) => signin(payload),
    onSuccess: (data) => {
      handleClickOpen();
      onSigninSuccess(data);
    },
  });

  const onSubmit = (values) => {
    handleSignin(values);
  };

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  const handleClickOpen = () => {
    setOpenSuccess(true);
  };

  const handleClose = () => {
    setOpenSuccess(false);
  };

  if (currentUser) {
    const redirectTo = searchParams.get("redirectTo");
    return <Navigate to={redirectTo || "/"} replace />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(to bottom right, #f2f3f5, #e5e6eb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "#fff",
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          padding: 4,
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={1}>
          Sign in to Jira
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Your will starts here.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Password"
            type={checked ? "text" : "password"}
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            variant="outlined"
          />

          <Box display="flex" alignItems="center" mt={1} mb={2}>
            <IconButton onClick={handleCheckboxChange} size="small">
              {checked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            </IconButton>
            <Typography variant="body2">Show password</Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#007aff",
              ":hover": {
                backgroundColor: "#005ce6",
              },
              borderRadius: 3,
              py: 1.2,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              mb: 2,
            }}
          >
            Sign In
          </Button>
        </form>

        {!!error && (
          <Typography color="error" fontSize="0.875rem" mt={1}>
            {error.message || "Login failed"}
          </Typography>
        )}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<FacebookIcon sx={{ color: "#0866FF" }} />}
          sx={{
            borderColor: "#0866FF",
            color: "#0866FF",
            textTransform: "none",
            fontWeight: 500,
            mb: 3,
            ":hover": {
              backgroundColor: "#f2f6ff",
              borderColor: "#005ce6",
            },
          }}
        >
          Login with Facebook
        </Button>

        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.primary">
            Don’t have an account?{" "}
            <RouterLink
              to="/sign-up"
              style={{
                color: "#007aff",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              Sign up
            </RouterLink>
          </Typography>
        </Box>
      </Container>

      <Dialog open={openSuccess} onClose={handleClose}>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box width={80}>
            <img
              src="/img/animation_success_small.gif"
              alt="success"
              width="100%"
              height="100%"
            />
          </Box>
          <DialogContentText id="alert-dialog-description">
            Login success
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
