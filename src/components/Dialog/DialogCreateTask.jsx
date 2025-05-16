import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Snackbar,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getProject } from "../../apis/projectAPI";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect } from "react";
import { getPriority } from "../../apis/priorityAPI";
import { getTaskType } from "../../apis/taskTypeAPI";
import Loading from "../Loading";
import { AlertJiraFilled } from "../styled/styledAlert";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DialogCreateTask(props) {
  const { open, handleClose, projectId, projectDetail } = props;
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const queryClient = useQueryClient();

  const CreateTaskSchema = object({
    taskName: string().required("TaskName must not be empty"),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      taskName: "",
      projectId: "",
      statusId: "",
      priorityId: "",
      typeId: "",
      listUserAsign: [],
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      description: "",
    },
    resolver: yupResolver(CreateTaskSchema),
    mode: "onTouched",
  });

  const { data: projectManagement = [], isLoading } = useQuery({
    queryKey: ["CreateTask"],
    queryFn: getProject,
    enabled: !!projectId,
  });

  const { data: priority = [] } = useQuery({
    queryKey: ["getStatusAllCreate"],
    queryFn: getPriority,
    enabled: !!projectId,
  });

  const { data: taskType = [] } = useQuery({
    queryKey: ["getTaskTypeCreate"],
    queryFn: getTaskType,
    enabled: !!projectId,
  });

  const { mutate: handleCreateTask, error } = useMutation({
    mutationFn: (values) => createTask(values),
    onError: () => {
      setOpenError(true);
    },
    onSuccess: () => {
      setOpenSuccess(true);
      queryClient.invalidateQueries("getProjectDetail");
      setTimeout(() => {
        handleClose();
        reset();
      }, 2000);
    },
  });

  const onSubmit = (values) => {
    const newValues = {
      ...values,
      originalEstimate: Number(values.originalEstimate),
      timeTrackingSpent: Number(values.timeTrackingSpent),
      timeTrackingRemaining: Number(values.timeTrackingRemaining),
    };
    handleCreateTask(newValues);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
    setOpenSuccess(false);
  };

  //   console.log(projectManagement);
  // console.log(projectDetail);
  //   console.log(priority);

  // Hàm tự định nghĩa để lấy tên của thành viên dựa trên ID
  function getMemberNameById(memberId) {
    const member = projectDetail.members.find(
      (member) => member.userId === memberId
    );
    return member ? member.name : "";
  }

  // Time Tracking

  const [valueTimeSpent, setValueTimeSpent] = useState(0);
  const [valueTimeRemaining, setValueTimeRemaining] = useState(0);
  const [valueOriginalEstimate, setValueOriginalEstimate] = useState(0);

  const RemainingAndEstimate = (Remaining, Estimate) => {
    if (Remaining) {
      if (Remaining > 0) {
        return <Typography>{Remaining}h remaining</Typography>;
      } else {
        return <Typography>0h remaining</Typography>;
      }
    } else if (Estimate) {
      if (Remaining > 0) {
        return <Typography>{Remaining}h remaining</Typography>;
      } else if (Estimate > 0) {
        return <Typography>{Estimate}h estimate</Typography>;
      } else {
        return <Typography>0h remaining</Typography>;
      }
    } else {
      return <Typography>0h remaining</Typography>;
    }
  };

  useEffect(() => {
    if (projectDetail || projectManagement) {
      setValue("projectId", projectId.toString());
      setValue("statusId", projectDetail.lstTask[0].statusId);
      setValue("priorityId", priority[0]?.priorityId);
      setValue("typeId", taskType[0]?.id);
    }
  }, [
    setValue,
    projectDetail,
    projectId,
    projectManagement,
    priority,
    taskType,
  ]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="lg"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Create Issue
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
        <DialogContent dividers sx={{ padding: "0 16px !important" }}>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, mb: 2, width: "98%" },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Task Name */}
            <Box>
              <label htmlFor="taskName">
                <Typography color={"red"} variant="span" fontWeight={"bold"}>
                  *
                </Typography>{" "}
                <Typography
                  variant="p"
                  color={"rgb(32, 73, 138)"}
                  fontWeight={"bold"}
                >
                  Name
                </Typography>
              </label>
              <TextField
                size="small"
                id="taskName"
                variant="outlined"
                fullWidth
                placeholder="Name task..."
                {...register("taskName")}
                error={!!errors.taskName}
                helperText={errors.taskName?.message}
              />
            </Box>
            {/* Project Name and Status Type */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              {/* Project Name */}
              <Box width={"100%"}>
                <label htmlFor="projectId">
                  <Typography
                    variant="p"
                    color={"rgb(32, 73, 138)"}
                    fontWeight={"bold"}
                  >
                    Project Name
                  </Typography>
                </label>
                <FormControl fullWidth>
                  <Controller
                    name="projectId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="projectId"
                        id="projectId"
                        {...field}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200, // Đặt chiều cao tối đa của menu danh sách
                            },
                          },
                        }}
                      >
                        {projectManagement.map((project) => {
                          return (
                            <MenuItem key={project.id} value={project.id}>
                              {project.projectName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
              {/* Status Type */}
              <Box width={"100%"}>
                <label htmlFor="statusId">
                  <Typography
                    variant="p"
                    color={"rgb(32, 73, 138)"}
                    fontWeight={"bold"}
                  >
                    Status Type
                  </Typography>
                </label>
                <FormControl fullWidth size="small">
                  <Controller
                    name="statusId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="statusId"
                        id="statusId"
                        {...field}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200, // Đặt chiều cao tối đa của menu danh sách
                            },
                          },
                        }}
                      >
                        {projectDetail.lstTask.map((status) => {
                          return (
                            <MenuItem
                              key={status.statusId}
                              value={status.statusId}
                            >
                              {status.statusName}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
            </Box>
            {/* Priority and Issue Type */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              {/* Priority */}
              <Box sx={{ width: "100%" }}>
                <label htmlFor="priorityId">
                  <Typography
                    variant="p"
                    color={"rgb(32, 73, 138)"}
                    fontWeight={"bold"}
                  >
                    Priority
                  </Typography>
                </label>
                <FormControl fullWidth size="small">
                  <Controller
                    name="priorityId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="priorityId"
                        id="priorityId"
                        {...field}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200, // Đặt chiều cao tối đa của menu danh sách
                            },
                          },
                        }}
                      >
                        {priority.map((item) => {
                          return (
                            <MenuItem
                              key={item.priorityId}
                              value={item.priorityId}
                            >
                              {item.priority}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
              {/* Issue Type */}
              <Box sx={{ width: "100%" }}>
                <label htmlFor="typeId">
                  <Typography
                    variant="p"
                    color={"rgb(32, 73, 138)"}
                    fontWeight={"bold"}
                  >
                    Issue Type
                  </Typography>
                </label>
                <FormControl fullWidth size="small">
                  <Controller
                    name="typeId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="typeId"
                        id="typeId"
                        {...field}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200, // Đặt chiều cao tối đa của menu danh sách
                            },
                          },
                        }}
                      >
                        {taskType.map((type) => {
                          return (
                            <MenuItem key={type.id} value={type.id}>
                              {type.taskType}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
            </Box>
            {/* Assignees and Time Tracking */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              {/* Assignees */}
              <Box sx={{ width: "100%" }}>
                <label htmlFor="listUserAsign">
                  <Typography
                    variant="p"
                    color={"rgb(32, 73, 138)"}
                    fontWeight={"bold"}
                  >
                    Assignees
                  </Typography>
                </label>
                <FormControl fullWidth size="small">
                  <InputLabel id="listUserAsign-label">
                    Select assignees
                  </InputLabel>
                  <Controller
                    name="listUserAsign"
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId="listUserAsign-label"
                        id="listUserAsign"
                        multiple
                        label="Select assignees"
                        {...field}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200, // Đặt chiều cao tối đa của menu danh sách
                            },
                          },
                        }}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={getMemberNameById(value)}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {projectDetail.members.map((member) => {
                          return (
                            <MenuItem key={member.userId} value={member.userId}>
                              {member.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
              {/* Time Tracking */}
              <Box sx={{ width: "100%" }}>
                <label htmlFor="timeTracking">
                  <Typography
                    variant="p"
                    color={"rgb(32, 73, 138)"}
                    fontWeight={"bold"}
                  >
                    Time Tracking
                  </Typography>
                </label>
                <Box sx={{ pl: 1 }}>
                  <Slider
                    onMouseDown={(e) => {
                      if (true) {
                        e.preventDefault();
                      }
                    }}
                    sx={{
                      "& .MuiSlider-thumb": {
                        display: "none",
                      },
                    }}
                    aria-labelledby="timeTracking-slider"
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} hours`}
                    step={1}
                    min={0}
                    max={
                      Number(valueTimeRemaining) ||
                      Number(valueOriginalEstimate)
                    }
                    value={Number(valueTimeSpent)}
                    onChange={(event, newValue) => {
                      // Cập nhật giá trị của valueTimeSpent khi Slider thay đổi
                      setValueTimeSpent(Number(newValue));
                    }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {valueTimeSpent > 0 ? (
                      <Typography>{valueTimeSpent}h logged</Typography>
                    ) : (
                      <Typography>0h logged</Typography>
                    )}
                    {RemainingAndEstimate(
                      valueTimeRemaining,
                      valueOriginalEstimate
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* Original Estimate, Time Spent and Time Remaining */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              {/* Original Estimate */}
              <Box width={"100%"}>
                <label htmlFor="originalEstimate">
                  <Typography
                    variant="p"
                    color={"rgb(32, 73, 138)"}
                    fontWeight={"bold"}
                  >
                    Original Estimate
                  </Typography>
                </label>
                <Controller
                  name="originalEstimate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      id="originalEstimate"
                      variant="outlined"
                      fullWidth
                      placeholder="0"
                      value={field.value}
                      onInput={(e) => {
                        const newValue = e.target.value;

                        // Xóa các ký tự "e", "+", và "-" khỏi giá trị mới
                        const sanitizedValue = newValue.replace(/[e+-]/gi, "");

                        // Kiểm tra giá trị mới sau khi xóa ký tự không hợp lệ
                        if (/^[0-9]*$/.test(sanitizedValue)) {
                          // Nếu giá trị hợp lệ (chỉ chứa các chữ số), thì cập nhật giá trị
                          field.onChange(sanitizedValue);
                          setValueOriginalEstimate(Number(sanitizedValue));
                        }
                        // Nếu giá trị không hợp lệ, không thực hiện thay đổi
                      }}
                    />
                  )}
                />
              </Box>
              {/* Time Spent and Time Remaining */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  width: "100%",
                }}
              >
                {/* Time Spent */}
                <Box width={"100%"}>
                  <label htmlFor="timeTrackingSpent">
                    <Typography
                      variant="p"
                      color={"rgb(32, 73, 138)"}
                      fontWeight={"bold"}
                    >
                      Time Spent
                    </Typography>
                  </label>
                  <Controller
                    name="timeTrackingSpent"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        type="text"
                        id="timeTrackingSpent"
                        variant="outlined"
                        fullWidth
                        placeholder="0"
                        value={field.value}
                        onInput={(e) => {
                          const newValue = e.target.value;

                          // Xóa các ký tự "e", "+", và "-" khỏi giá trị mới
                          const sanitizedValue = newValue.replace(
                            /[e+-]/gi,
                            ""
                          );

                          // Kiểm tra giá trị mới sau khi xóa ký tự không hợp lệ
                          if (/^[0-9]*$/.test(sanitizedValue)) {
                            // Nếu giá trị hợp lệ (chỉ chứa các chữ số), thì cập nhật giá trị
                            field.onChange(sanitizedValue);
                            setValueTimeSpent(Number(sanitizedValue));
                          }
                          // Nếu giá trị không hợp lệ, không thực hiện thay đổi
                        }}
                      />
                    )}
                  />
                </Box>
                {/* Time Remaining */}
                <Box width={"100%"}>
                  <label htmlFor="timeTrackingRemaining">
                    <Typography
                      variant="p"
                      color={"rgb(32, 73, 138)"}
                      fontWeight={"bold"}
                    >
                      Time Remaining
                    </Typography>
                  </label>
                  <Controller
                    name="timeTrackingRemaining"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        type="text"
                        id="timeTrackingRemaining"
                        variant="outlined"
                        fullWidth
                        placeholder="0"
                        value={field.value}
                        onInput={(e) => {
                          const newValue = e.target.value;

                          // Xóa các ký tự "e", "+", và "-" khỏi giá trị mới
                          const sanitizedValue = newValue.replace(
                            /[e+-]/gi,
                            ""
                          );

                          // Kiểm tra giá trị mới sau khi xóa ký tự không hợp lệ
                          if (/^[0-9]*$/.test(sanitizedValue)) {
                            // Nếu giá trị hợp lệ (chỉ chứa các chữ số), thì cập nhật giá trị
                            field.onChange(sanitizedValue);
                            setValueTimeRemaining(Number(sanitizedValue));
                          }
                          // Nếu giá trị không hợp lệ, không thực hiện thay đổi
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>

            {/* Desc */}
            <label htmlFor="desc">
              <Typography
                variant="p"
                color={"rgb(32, 73, 138)"}
                fontWeight={"bold"}
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
            <Box textAlign={"right"}>
              <Button autoFocus onClick={handleClose} color="inherit">
                Cancel
              </Button>
              <Button
                type="submit"
                color="warning"
                variant="contained"
                sx={{ ml: 1 }}
              >
                Create Task
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>

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
            Create task successfully
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
    </Box>
  );
}
