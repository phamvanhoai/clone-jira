import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { number, object, string } from "yup";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function EditProfile({
  setIsEdit,
  currentUser,
  handleEditProfile,
}) {
  const [showPassword, setShowPassword] = React.useState(false);

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
    phoneNumber: number().positive(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      id: "",
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

  const onSubmit = (values) => {
    console.log(values);
    handleEditProfile(values);
    const userWithoutPassword = {
      ...values,
      avatar: currentUser.avatar,
      accessToken: currentUser.accessToken,
    };
    delete userWithoutPassword.password;
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    setIsEdit(false);
  };

  useEffect(() => {
    if (currentUser) {
      setValue("id", currentUser.id);
      setValue("email", currentUser.email);
      setValue("password", currentUser.password);
      setValue("name", currentUser.name);
      setValue("phoneNumber", currentUser.phoneNumber);
    }
  }, [currentUser, setValue]);

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { width: "100%" },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      mt={3}
    >
      <TextField
        id="myId-basic"
        fullWidth
        label="My ID"
        variant="outlined"
        disabled
        sx={{ mb: 3 }}
        {...register("id")}
      />

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
      <FormControl sx={{ mb: 3 }} variant="outlined" error={!!errors.password}>
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
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
        <Button
          color="inherit"
          onClick={() => {
            setIsEdit(false);
          }}
        >
          Cancel
        </Button>
        <Button
          sx={{ ml: 1 }}
          color="inherit"
          variant="contained"
          type="submit"
          onClick={() => {
            reset({
              email: "",
              password: "",
              name: "",
              phoneNumber: "",
            });
          }}
        >
          Reset
        </Button>
        <Button
          sx={{ ml: 1 }}
          color="warning"
          variant="contained"
          type="submit"
        >
          Edit
        </Button>
      </Box>
    </Box>
  );
}
