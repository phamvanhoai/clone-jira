import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  getProjectCategogy,
  getProjectDetail,
  updateProject,
} from "../../../apis/projectAPI";
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
import { object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useState } from "react";
import { AlertJiraOutlined } from "../../../components/styled/styledAlert";
import LoadingCircular from "../../../components/Loading/LoadingCircular";

export default function EditProject({ projectId, isOpenEdit }) {
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const queryClient = useQueryClient();

  const editProjectSchema = object({
    projectName: string().required("Name must not be empty"),
    categoryId: string().required("Please select a Project Category"),
  });

  const { data: projectCategory = [] } = useQuery({
    queryKey: ["projectCategoryEdit"],
    queryFn: getProjectCategogy,
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ["projectEdit", projectId],
    queryFn: () => getProjectDetail(projectId),
    enabled: !!projectId,
  });

  const { mutate: handleUpdateProject, error } = useMutation({
    mutationFn: (values) => updateProject(values),
    onError: () => {
      setOpenError(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("projectCategoryCreate");
      setOpenSuccess(true);
    },
  });

  const projectCategoryId = data.projectCategory || [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: projectId,
      projectName: data.projectName,
      description: "",
      categoryId: "",
    },
    resolver: yupResolver(editProjectSchema),
    mode: "onTouched",
  });

  const onSubmit = (values) => {
    const newValues = {
      ...values,
      creator: data.creator.id,
    };
    handleUpdateProject(newValues);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
    setOpenSuccess(false);
  };

  useEffect(() => {
    if (data) {
      setValue("id", projectId);
      setValue("projectName", data.alias);
      setValue("description", data.description);
      setValue("categoryId", projectCategoryId.id);
    }
  }, [data, setValue, projectId, projectCategoryId]);

  if (isLoading) {
    return <LoadingCircular />;
  }
  return (
    <Box padding={5} mt={5}>
      <Typography
        component={"h3"}
        variant="h5"
        fontWeight={800}
        marginBottom={3}
      >
        EDIT PROJECT
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
        <label htmlFor="id">
          <Typography
            variant="p"
            color={"rgb(32, 73, 138)"}
            fontWeight={"bold"}
            fontSize={"20px"}
          >
            ProjectId
          </Typography>
        </label>
        <TextField
          id="id"
          variant="outlined"
          fullWidth
          placeholder="ProjectId..."
          disabled
          {...register("id")}
        />

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
        {isOpenEdit && (
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
        )}

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
            defaultValue={data?.projectCategory?.id}
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
            Update Project
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
          <AlertJiraOutlined
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Chỉnh sửa project thành công
          </AlertJiraOutlined>
        </Snackbar>
        <Snackbar
          open={openError}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <AlertJiraOutlined
            onClose={handleClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </AlertJiraOutlined>
        </Snackbar>
      </Stack>
    </Box>
  );
}
