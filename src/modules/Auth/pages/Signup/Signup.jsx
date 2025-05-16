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
import { object, string, number } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../../../apis/userAPI";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

export default function Signup() {
  const [checked, setChecked] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const navigate = useNavigate();

  const schema = object({
    email: string()
      .required("Please enter your email")
      .email("Invalid email format"),
    password: string()
      .required("Please enter your password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        "Password must be at least 8 chars, include uppercase, lowercase, number and special char"
      ),
    name: string().required("Please enter your name"),
    phoneNumber: number()
      .positive()
      .typeError("Phone number must be a number"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phoneNumber: "",
    },
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const { mutate: signupMutate, error } = useMutation({
    mutationFn: (data) => signup(data),
    onSuccess: () => setOpenSuccess(true),
  });

  const onSubmit = (data) => {
    signupMutate(data);
  };

  const handleCheckboxChange = () => {
    setChecked((prev) => !prev);
  };

  const handleClose = () => {
    setOpenSuccess(false);
    navigate("/sign-in");
  };

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
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Start your journey with us.
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
          <TextField
            label="Name"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Phone Number"
            fullWidth
            {...register("phoneNumber")}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            margin="normal"
            variant="outlined"
          />

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
            Sign Up
          </Button>
        </form>

        {!!error && (
          <Typography color="error" fontSize="0.875rem" mt={1}>
            {error.message || "Signup failed"}
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
          Sign up with Facebook
        </Button>

        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.primary">
            Already have an account?{" "}
            <RouterLink
              to="/sign-in"
              style={{
                color: "#007aff",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              Sign in
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
            Signup successful!
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
