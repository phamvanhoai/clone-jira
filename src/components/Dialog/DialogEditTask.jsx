import {
  Avatar,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskDetail, removeTask, updateTask } from "../../apis/projectAPI";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { getTaskType } from "../../apis/taskTypeAPI";
import { getPriority } from "../../apis/priorityAPI";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useUserContext } from "../../contexts/UserContext/UserContext";
import { Textarea } from "../baseComponent/styledTextareaAutoSize";
import { getStatus } from "../../apis/statusAPI";
import {
  deleteComment,
  getComment,
  insertComment,
} from "../../apis/commentAPI";
import ClearIcon from "@mui/icons-material/Clear";
import debounce from "lodash/debounce";
import LoadingCircular from "../Loading/LoadingCircular";
import PopoverDeleteTask from "../Popover/PopoverDelete/PopoverDeleteTask";
import { AlertJiraFilled } from "../styled/styledAlert";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DialogEditTask(props) {
  const { open, handleClose, taskId, projectDetail } = props;

  const { currentUser } = useUserContext();
  const queryClient = useQueryClient();
  const [isDesc, setIsDesc] = useState(true);
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  // PopoverDeleteTask

  const [anchorElDeleteTask, setAnchorElDeleteTask] = React.useState(null);

  const handleClickDeleteTask = (event) => {
    setAnchorElDeleteTask(event.currentTarget);
  };

  const handleCloseDeleteTask = () => {
    setAnchorElDeleteTask(null);
  };

  const handleCloseAlertDeleteTask = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
    setOpenSuccess(false);
  };

  const EditTaskSchema = object({
    taskName: string().required("TaskName must not be empty"),
  });

  const { data: taskDetail = [], isLoading } = useQuery({
    queryKey: ["getTaskDetail", taskId],
    queryFn: () => getTaskDetail(taskId),
    enabled: !!taskId,
  });

  const { data: taskType = [] } = useQuery({
    queryKey: ["getTaskTypeEdit"],
    queryFn: getTaskType,
    enabled: !!taskId,
  });

  const { data: priority = [] } = useQuery({
    queryKey: ["getPriorityAllEdit"],
    queryFn: getPriority,
    enabled: !!taskId,
  });

  const { data: status = [] } = useQuery({
    queryKey: ["getStatusAllEdit"],
    queryFn: getStatus,
    enabled: !!taskId,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["getComment", taskId],
    queryFn: () => getComment(taskId),
    enabled: !!taskId,
  });

  const { mutate: handleUpdateTask } = useMutation({
    mutationFn: (payload) => updateTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries("getProjectDetail");
    },
  });

  const { mutate: handleInsertComment } = useMutation({
    mutationFn: (payload) => insertComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries("getComment");
    },
  });

  const { mutate: handleRemoveComment } = useMutation({
    mutationFn: (idComment) => deleteComment(idComment),
    onSuccess: () => {
      queryClient.invalidateQueries("getComment");
    },
  });

  const { mutate: handleDeleteTask, error } = useMutation({
    mutationFn: (taskId) => removeTask(taskId),
    onSuccess: () => {
      setOpenSuccess(true);
      queryClient.invalidateQueries("getProjectDetail");

      setTimeout(() => {
        handleClose();
      }, 2000);
    },
    onError: () => {
      setOpenError(true);
    },
  });

  const [initialAssignees, setInitialAssignees] = useState(
    taskDetail.assigness?.map((user) => user.id)
  );

  const {
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      taskName: taskDetail.taskName,
      projectId: taskDetail.projectId,
      lstComment: taskDetail.lstComment,
      statusId: Number(taskDetail.statusId),
      priorityId: Number(taskDetail.priorityId),
      typeId: Number(taskDetail.taskTypeDetail?.id),
      listUserAsign: taskDetail.assigness?.map((user) => user.id),
      originalEstimate: Number(taskDetail.originalEstimate),
      timeTrackingSpent: Number(taskDetail.timeTrackingSpent),
      timeTrackingRemaining: Number(taskDetail.timeTrackingRemaining),
      description: taskDetail.description,
    },
    resolver: yupResolver(EditTaskSchema),
    mode: "onTouched",
  });

  // Hàm tự định nghĩa để lấy tên của thành viên dựa trên ID
  function getMemberNameById(memberId) {
    const member = projectDetail.members.find(
      (member) => member.userId === memberId
    );
    return member ? member.name : member?.userId;
  }

  // Time Tracking

  const [valueTimeSpent, setValueTimeSpent] = useState(
    Number(taskDetail.timeTrackingSpent) || 0
  );
  const [valueTimeRemaining, setValueTimeRemaining] = useState(
    Number(taskDetail.timeTrackingRemaining) || 0
  );
  const [valueOriginalEstimate, setValueOriginalEstimate] = useState(
    Number(taskDetail.originalEstimate) || 0
  );

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

  // Hàm debounce update
  const debouncedUpdateTask = debounce((updateData) => {
    handleUpdateTask({
      ...taskDetail,
      ...updateData,
      listUserAsign: initialAssignees,
    });
  }, 1000);

  useEffect(() => {
    const assignees = taskDetail.assigness?.map((user) => user.id);
    console.log(assignees);

    if (taskDetail) {
      setValue("typeId", taskDetail.taskTypeDetail?.id);
      setValue("taskName", taskDetail.taskName);
      setValue("description", taskDetail.description);
      setValue("statusId", taskDetail.statusId);
      setValue("listUserAsign", assignees);
      setValue("priorityId", taskDetail.priorityId);
      setValue("originalEstimate", Number(taskDetail.originalEstimate));
      setValue("timeTrackingSpent", Number(taskDetail.timeTrackingSpent));
      setValue(
        "timeTrackingRemaining",
        Number(taskDetail.timeTrackingRemaining)
      );
      setValueOriginalEstimate(taskDetail.originalEstimate);
      setValueTimeRemaining(taskDetail.timeTrackingRemaining);
      setValueTimeSpent(taskDetail.timeTrackingSpent);
      setInitialAssignees(assignees);
    }
  }, [taskDetail, setValue, handleClose]);

  if (isLoading) {
    return <LoadingCircular />;
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="lg"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {/* Task Type */}
          <FormControl size="small" sx={{ marginLeft: "8px" }}>
            <InputLabel id="type-Id">Task Type</InputLabel>
            <Controller
              name="typeId"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="type-Id"
                  id="typeId"
                  label="Task Type"
                  variant="outlined"
                  sx={{ width: "175px" }}
                  {...field}
                  onChange={async (e) => {
                    const newValue = e.target.value;
                    field.onChange(e);
                    try {
                      const response = await handleUpdateTask({
                        ...taskDetail,
                        typeId: newValue,
                        listUserAsign: initialAssignees,
                      });
                      return response;
                    } catch (error) {
                      console.log(error);
                    }
                  }}
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
                        {`${type.taskType} - ${taskId}`}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            />
          </FormControl>
        </DialogTitle>
        <Box>
          <Button variant="text" color="inherit">
            <SendOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> Give Feedback
          </Button>
          <Button
            variant="text"
            color="inherit"
            onClick={() => {
              // Lấy liên kết hiện tại
              const linkToCopy = window.location.href;

              // Sử dụng API Clipboard để sao chép liên kết
              navigator.clipboard
                .writeText(linkToCopy)
                .then(() => {
                  alert("Sao chép liên kết thành công");
                })
                .catch((error) => {
                  console.error("Lỗi khi sao chép liên kết: ", error);
                });
            }}
          >
            <LinkOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> Copy Link
          </Button>
          <IconButton
            aria-label="delete"
            onClick={(e) => {
              handleClickDeleteTask(e);
            }}
          >
            <DeleteForeverOutlinedIcon />
          </IconButton>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <DialogContent dividers>
        <Box
          display={"flex"}
          component="form"
          sx={{
            "& > :not(style)": { m: 1, mb: 2, width: "98%" },
          }}
          noValidate
          autoComplete="off"
        >
          <Box width={"100%"}>
            {/* Task Name */}
            <label htmlFor="taskName">
              <Typography
                variant="p"
                color={"rgb(32, 73, 138)"}
                fontWeight={"bold"}
                sx={{ padding: 1 }}
              >
                Task Name
              </Typography>
            </label>
            <FormControl size="small" fullWidth sx={{ mt: 1, mb: 1 }}>
              <Controller
                name="taskName"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="text"
                    id="taskName"
                    variant="outlined"
                    fullWidth
                    error={!!errors.taskName}
                    helperText={errors.taskName?.message}
                    size="small"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const newValue = e.target.value;
                      debouncedUpdateTask({
                        taskName: newValue,
                      });
                    }}
                  />
                )}
              />
            </FormControl>
            {/* Description */}
            {isDesc ? (
              <Box
                sx={{
                  padding: "8px 0 25px 8px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label htmlFor="desc">
                  <Typography
                    variant="p"
                    color={"rgb(32, 73, 138)"}
                    fontWeight={"bold"}
                  >
                    Description
                  </Typography>
                </label>
                <Box
                  onClick={() => {
                    setIsDesc(false);
                  }}
                  sx={{
                    cursor: "pointer",
                    display: "inline-block",
                    marginTop: "8px",
                    transition: "all 0.5s",

                    ":hover": {
                      color: "#b12121",
                      fontSize: "20px",
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: taskDetail.description }}
                />
              </Box>
            ) : (
              <Box>
                <label htmlFor="desc">
                  <Typography
                    variant="p"
                    color={"rgb(32, 73, 138)"}
                    fontWeight={"bold"}
                    sx={{ padding: 1 }}
                  >
                    Description
                  </Typography>
                </label>
                <Box sx={{ mt: 1 }}>
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
                </Box>

                <Box textAlign={"end"} mt={1}>
                  <Button
                    color="inherit"
                    onClick={() => {
                      setIsDesc(true);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ marginLeft: 1 }}
                    onClick={async () => {
                      const descriptionValue = watch("description");

                      handleUpdateTask({
                        ...taskDetail,
                        description: descriptionValue,
                        listUserAsign: initialAssignees,
                      });
                      setIsDesc(true);
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            )}

            {/* Comment */}
            <Box>
              <label htmlFor="desc">
                <Typography
                  variant="p"
                  color={"rgb(32, 73, 138)"}
                  fontWeight={"bold"}
                  sx={{ padding: 1 }}
                >
                  Comment
                </Typography>
              </label>
              {comments.map((comment) => {
                return (
                  <Box
                    display={"flex"}
                    key={comment.id}
                    sx={{ marginTop: "10px" }}
                  >
                    <Avatar alt={comment.user.name} src={comment.user.avatar} />

                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      sx={{
                        width: "100%",
                        border: "1px solid #DAE2ED",
                        borderRadius: "5px",
                        marginLeft: "8px",
                        marginTop: "5px",
                        padding: "5px 10px",
                      }}
                    >
                      <Box
                        dangerouslySetInnerHTML={{
                          __html: comment.contentComment,
                        }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => {
                          handleRemoveComment(comment.id);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}

              <Box display={"flex"} sx={{ marginTop: "10px" }}>
                <Avatar alt={currentUser.name} src={currentUser.avatar} />
                <FormControl
                  size="small"
                  fullWidth
                  sx={{ ml: 1, marginTop: "5px" }}
                >
                  <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        minRows={3}
                        maxRows={6}
                        aria-label="textarea"
                        placeholder="Comment..."
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            // Prevent the default "Enter" behavior
                            handleInsertComment({
                              taskId: taskId,
                              contentComment: `<p>${e.target.value}</p>`,
                            });
                            // Clear the textarea using react-hook-form's setValue
                            field.onChange(""); // Clear the comment field
                          }
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Box>
            </Box>
          </Box>
          <Box width={"100%"}>
            {/* Status Type */}
            <Box width={"100%"}>
              <label htmlFor="statusId">
                <Typography
                  variant="p"
                  color={"rgb(32, 73, 138)"}
                  fontWeight={"bold"}
                  sx={{ padding: 1 }}
                >
                  Status Type
                </Typography>
              </label>
              <FormControl fullWidth size="small" sx={{ mt: 1, mb: 1 }}>
                <Controller
                  name="statusId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="statusId"
                      id="statusId"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const newValue = e.target.value;

                        handleUpdateTask({
                          ...taskDetail,
                          statusId: newValue,
                          listUserAsign: initialAssignees,
                        });
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200, // Đặt chiều cao tối đa của menu danh sách
                          },
                        },
                      }}
                    >
                      {status.map((status) => {
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
            {/* Assignees */}
            <Box sx={{ width: "100%" }}>
              <label htmlFor="listUserAsign">
                <Typography
                  variant="p"
                  color={"rgb(32, 73, 138)"}
                  fontWeight={"bold"}
                  sx={{ padding: 1 }}
                >
                  Assignees
                </Typography>
              </label>
              <FormControl fullWidth size="small" sx={{ mt: 1, mb: 1 }}>
                <Controller
                  name="listUserAsign"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="listUserAsign-label"
                      id="listUserAsign"
                      multiple
                      {...field}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200, // Đặt chiều cao tối đa của menu danh sách
                          },
                        },
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        const newValue = e.target.value;
                        console.log("newValue", newValue);
                        console.log("taskDetail", taskDetail);
                        handleUpdateTask({
                          ...taskDetail,
                          listUserAsign: [...newValue],
                        });
                      }}
                      renderValue={(selected) => {
                        return (
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
                        );
                      }}
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
            {/* Priority */}
            <Box sx={{ width: "100%" }}>
              <label htmlFor="priorityId">
                <Typography
                  variant="p"
                  color={"rgb(32, 73, 138)"}
                  fontWeight={"bold"}
                  sx={{ padding: 1 }}
                >
                  Priority
                </Typography>
              </label>
              <FormControl fullWidth size="small" sx={{ mt: 1, mb: 1 }}>
                <Controller
                  name="priorityId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="priorityId"
                      id="priorityId"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);

                        const newValue = e.target.value;
                        handleUpdateTask({
                          ...taskDetail,
                          priorityId: newValue,
                          listUserAsign: initialAssignees,
                        });
                      }}
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
            {/* Original Estimate */}
            <Box width={"100%"}>
              <label htmlFor="originalEstimate">
                <Typography
                  variant="p"
                  color={"rgb(32, 73, 138)"}
                  fontWeight={"bold"}
                  sx={{ padding: 1 }}
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
                    sx={{ mt: 1, mb: 1 }}
                    value={Number(field.value)}
                    onInput={(e) => {
                      const newValue = e.target.value;

                      // Xóa các ký tự "e", "+", và "-" khỏi giá trị mới
                      const sanitizedValue = newValue.replace(/[e+-]/gi, "");

                      // Kiểm tra giá trị mới sau khi xóa ký tự không hợp lệ
                      if (/^[0-9]*$/.test(sanitizedValue)) {
                        // Nếu giá trị hợp lệ (chỉ chứa các chữ số), thì cập nhật giá trị
                        field.onChange(Number(sanitizedValue));
                        setValueOriginalEstimate(Number(sanitizedValue));

                        debouncedUpdateTask({
                          originalEstimate: Number(sanitizedValue),
                        });
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
                    sx={{ padding: 1 }}
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
                      sx={{ mt: 1, mb: 1 }}
                      value={Number(field.value)}
                      onInput={(e) => {
                        const newValue = e.target.value;

                        // Xóa các ký tự "e", "+", và "-" khỏi giá trị mới
                        const sanitizedValue = newValue.replace(/[e+-]/gi, "");

                        // Kiểm tra giá trị mới sau khi xóa ký tự không hợp lệ
                        if (/^[0-9]*$/.test(sanitizedValue)) {
                          // Nếu giá trị hợp lệ (chỉ chứa các chữ số), thì cập nhật giá trị
                          field.onChange(Number(sanitizedValue));
                          setValueTimeSpent(Number(sanitizedValue));
                          debouncedUpdateTask({
                            timeTrackingSpent: Number(sanitizedValue),
                          });
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
                    sx={{ padding: 1 }}
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
                      sx={{ mt: 1, mb: 1 }}
                      value={Number(field.value)}
                      onInput={(e) => {
                        const newValue = e.target.value;

                        // Xóa các ký tự "e", "+", và "-" khỏi giá trị mới
                        const sanitizedValue = newValue.replace(/[e+-]/gi, "");

                        // Kiểm tra giá trị mới sau khi xóa ký tự không hợp lệ
                        if (/^[0-9]*$/.test(sanitizedValue)) {
                          // Nếu giá trị hợp lệ (chỉ chứa các chữ số), thì cập nhật giá trị
                          field.onChange(Number(sanitizedValue));
                          setValueTimeRemaining(Number(sanitizedValue));
                          debouncedUpdateTask({
                            timeTrackingRemaining: Number(sanitizedValue),
                          });
                        }
                        // Nếu giá trị không hợp lệ, không thực hiện thay đổi
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
            {/* Time Tracking */}
            <Box sx={{ width: "100%" }}>
              <label htmlFor="timeTracking">
                <Typography
                  variant="p"
                  color={"rgb(32, 73, 138)"}
                  fontWeight={"bold"}
                  sx={{ padding: 1 }}
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
                    isNaN(valueTimeRemaining) || isNaN(valueOriginalEstimate)
                      ? 0
                      : valueTimeRemaining || valueOriginalEstimate
                  }
                  value={isNaN(valueTimeSpent) ? 0 : valueTimeSpent}
                  onChange={(event, newValue) => {
                    // Cập nhật giá trị của valueTimeSpent khi Slider thay đổi
                    setValueTimeSpent(Number(newValue));
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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

          {/* PopoverDeleteTask */}
          <PopoverDeleteTask
            anchorEl={anchorElDeleteTask}
            handleClose={handleCloseDeleteTask}
            taskId={taskDetail.taskId}
            handleDeleteTask={handleDeleteTask}
            taskName={taskDetail.taskName}
          />
        </Box>
        {/* Alert thông báo lỗi và thành công */}
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={openSuccess}
            autoHideDuration={2000}
            onClose={handleCloseAlertDeleteTask}
          >
            <AlertJiraFilled
              onClose={handleCloseAlertDeleteTask}
              severity="success"
              sx={{ width: "100%" }}
            >
              Xóa task thành công
            </AlertJiraFilled>
          </Snackbar>
          <Snackbar
            open={openError}
            autoHideDuration={2000}
            onClose={handleCloseAlertDeleteTask}
          >
            <AlertJiraFilled
              onClose={handleCloseAlertDeleteTask}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </AlertJiraFilled>
          </Snackbar>
        </Stack>
      </DialogContent>
    </BootstrapDialog>
  );
}
