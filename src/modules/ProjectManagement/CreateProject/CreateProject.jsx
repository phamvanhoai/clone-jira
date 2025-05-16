import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { AlertJiraFilled } from "../../../components/styled/styledAlert";
import { useState } from "react";
import { object, string } from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjectCategogy } from "../../../apis/projectAPI";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import Loading from "../../../components/Loading";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const CreateProjectSchema = object({
    projectName: string().required("Name must not be empty"),
  });

  const { data: projectCategory = [], isLoading } = useQuery({
    queryKey: ["projectCategoryCreate"],
    queryFn: getProjectCategogy,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: "",
      description: "",
      categoryId: "",
    },
    resolver: yupResolver(CreateProjectSchema),
    mode: "onTouched",
  });

  const { mutate: handleCreateProject, error } = useMutation({
    mutationFn: (values) => createProject(values),
    onError: () => {
      setOpenError(true);
    },
    onSuccess: () => {
      setOpenSuccess(true);
      queryClient.invalidateQueries("projectCategoryCreate");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
  });

  const onSubmit = (values) => {
    const categoryId = Number(values.categoryId);
    console.log({ ...values, categoryId });
    handleCreateProject({ ...values, categoryId });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
    setOpenSuccess(false);
  };

  useEffect(() => {
    if (projectCategory) {
      setValue("categoryId", projectCategory[0]?.id);
    }
  }, [setValue, projectCategory]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box padding={5}>
      <Typography
        component={"h3"}
        variant="h5"
        fontWeight={800}
        marginBottom={3}
      >
        CREATE PROJECT
      </Typography>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, mb: 2, width: "90%" },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box>
          <label htmlFor="name">
            <Typography color={"red"} variant="span" fontWeight={"bold"}>
              *
            </Typography>{" "}
            <Typography
              variant="p"
              color={"rgb(32, 73, 138)"}
              fontWeight={"bold"}
              fontSize={"20px"}
            >
              Name
            </Typography>
          </label>
          <TextField
            id="name"
            variant="outlined"
            fullWidth
            placeholder="Name project..."
            {...register("projectName")}
            error={!!errors.projectName}
            helperText={errors.projectName?.message}
          />
        </Box>
        <label htmlFor="name">
          <Typography
            variant="p"
            color={"rgb(32, 73, 138)"}
            fontWeight={"bold"}
            fontSize={"20px"}
          >
            Description
          </Typography>
        </label>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Editor
              apiKey="72kky9500fv0uynktlqiappvucuwf1l9frkoxa359zt4grrv"
              onEditorChange={field.onChange}
              value={field.value}
              init={{
                height: 350,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
              }}
            />
          )}
        />

        <label htmlFor="categoryId">
          <Typography color={"red"} variant="span" fontWeight={"bold"}>
            *
          </Typography>{" "}
          <Typography
            variant="p"
            color={"rgb(32, 73, 138)"}
            fontWeight={"bold"}
            fontSize={"20px"}
          >
            Project Category
          </Typography>
        </label>
        <FormControl fullWidth error={!!errors.categoryId}>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                labelId="categoryId"
                id="categoryId"
                {...field}
                placeholder="Choose Project Category"
              >
                {projectCategory.map((item) => {
                  return (
                    <MenuItem value={`${item.id}`} key={item?.id}>
                      {item.projectCategoryName}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
          />
        </FormControl>
        <Box textAlign={"right"}>
          <Button type="submit" color="warning" variant="contained">
            Create Project
          </Button>
        </Box>
      </Box>

      {/* Alert thông báo lỗi và thành công */}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccess}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <AlertJiraFilled
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Tạo project thành công
          </AlertJiraFilled>
        </Snackbar>
        <Snackbar
          open={openError}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <AlertJiraFilled
            onClose={handleClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </AlertJiraFilled>
        </Snackbar>
      </Stack>
    </Box>
  );
}
