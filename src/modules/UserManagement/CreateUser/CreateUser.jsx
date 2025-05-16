import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../../../apis/userAPI";
import { number, object, string } from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AlertJiraFilled } from "../../../components/styled/styledAlert";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function CreateUser(props) {
  const { open, handleClose } = props;
  const [showPassword, setShowPassword] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);

  const queryClient = useQueryClient();

  const createUserSchema = object({
    email: string()
      .required("Email must not be empty")
      .email("Email is not in the correct format"),
    password: string()
      .required("Password must not be empty")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
        "Password must be at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
      ),
    name: string().required("Name must not be empty"),
    phoneNumber: number().positive().typeError("You can only enter the number"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phoneNumber: "",
    },
    resolver: yupResolver(createUserSchema),
    mode: "onTouched",
  });

  // Show password
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Hàm đóng Alert thông báo
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
    setOpenSuccess(false);
  };

  const { mutate: handleSignup, error } = useMutation({
    mutationFn: (payload) => signup(payload),
    onSuccess: () => {
      setOpenSuccess(true);
      reset();
      queryClient.invalidateQueries("getUserManagement");
    },
    onError: () => {
      setOpenError(true);
    },
  });

  const onSubmit = (values) => {
    console.log(values);
    handleSignup(values);
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth={"sm"}
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Create User
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
      <DialogContent dividers sx={{ padding: 2 }}>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { width: "100%" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            id="email-basic"
            fullWidth
            label="Email"
            variant="outlined"
            sx={{ mb: 3 }}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <FormControl
            sx={{ mb: 3 }}
            variant="outlined"
            error={!!errors.password}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              {...register("password")}
            />
          </FormControl>
          {!!errors.password && (
            <Typography
              sx={{
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                fontWeight: 400,
                fontSize: "0.75rem",
                lineHeight: 1.66,
                letterSpacing: "0.03333em",
                margin: "-20px 14px 25px 14px",
                color: "#d32f2f",
              }}
            >
              {errors.password?.message}
            </Typography>
          )}
          <TextField
            id="name-basic"
            fullWidth
            label="Name"
            variant="outlined"
            sx={{ mb: 3 }}
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name")}
          />
          <TextField
            id="phone-basic"
            fullWidth
            label="Phone Number"
            variant="outlined"
            sx={{ mb: 3 }}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              sx={{ ml: 1 }}
              color="warning"
              variant="contained"
              type="submit"
            >
              Create
            </Button>
          </Box>
        </Box>
      </DialogContent>
      {/* Alert thông báo lỗi và thành công */}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccess}
          autoHideDuration={2000}
          onClose={handleCloseAlert}
        >
          <AlertJiraFilled
            onClose={handleCloseAlert}
            severity="success"
            sx={{ width: "100%" }}
          >
            Tạo user thành công
          </AlertJiraFilled>
        </Snackbar>
        <Snackbar
          open={openError}
          autoHideDuration={2000}
          onClose={handleCloseAlert}
        >
          <AlertJiraFilled
            onClose={handleCloseAlert}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </AlertJiraFilled>
        </Snackbar>
      </Stack>
    </BootstrapDialog>
  );
}
