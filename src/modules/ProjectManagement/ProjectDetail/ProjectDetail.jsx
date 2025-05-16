import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectDetail, updateStatus } from "../../../apis/projectAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import AddIcon from "@mui/icons-material/Add";
import {
  Avatar,
  Box,
  Button,
  Fab,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PopoverListMember from "../../../components/Popover/PopoverListMember";
import BugReportIcon from "@mui/icons-material/BugReport";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import EastIcon from "@mui/icons-material/East";
import SouthEastIcon from "@mui/icons-material/SouthEast";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect } from "react";
import DialogCreateTask from "../../../components/Dialog/DialogCreateTask";
import DialogEditTask from "../../../components/Dialog/DialogEditTask";

export default function ProjectDetail() {
  const { projectId } = useParams();

  const queryClient = useQueryClient();

  const [anchorElListMember, setAnchorElListMember] = useState(null);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openEditTask, setOpenEditTask] = useState(false);
  const [taskId, setTaskId] = useState("");

  const { data: projectDetail = [], isLoading } = useQuery({
    queryKey: ["getProjectDetail", projectId],
    queryFn: () => getProjectDetail(projectId),
    enabled: !!projectId,
  });

  const { mutate: handleUpdateStatus, error } = useMutation({
    mutationFn: (payload) =>
      updateStatus({
        taskId: payload[0],
        statusId: payload[1],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("getProjectDetail");
    },
    onError: () => {
      alert(error);
    },
  });

  const [items, setItems] = useState({});

  // console.log(Object.keys(items));
  const handleClickListMember = (event) => {
    setAnchorElListMember(event.currentTarget);
  };

  const handleCloseListMember = () => {
    setAnchorElListMember(null);
  };

  // Create Task

  const handleClickOpenCreateTask = () => {
    setOpenCreateTask(true);
  };
  const handleCloseCreateTask = () => {
    setOpenCreateTask(false);
  };

  // Edit Task

  const handleClickOpenEditTask = () => {
    setOpenEditTask(true);
  };
  const handleCloseEditTask = () => {
    setOpenEditTask(false);
  };
  // Quản lí task

  const onDragEnd = (result) => {
    const { source, destination, draggableId, taskId } = result;

    // Ngăn cản xảy ra lỗi khi không có điểm đến
    if (!destination) {
      return;
    }

    // Xác định trạng thái mới và trạng thái cũ
    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    // Trích xuất taskName từ draggableId
    const taskName = draggableId;

    // Tìm item có taskName tương ứng trong danh sách items
    const draggedItem = Object.values(items).find((status) =>
      status.find((item) => item.taskName === taskName)
    );
    const findTaskId = draggedItem.find(
      (item) => item.taskName === draggableId
    );
    if (sourceStatus !== destinationStatus) {
      console.log("taskId: ", taskId);
      console.log("destinationStatus: ", destinationStatus);
      // Nếu công việc đã bị kéo vào một nhóm khác, gọi API để cập nhật trạng thái
      handleUpdateStatus([findTaskId.taskId, destinationStatus]);
    }

    if (source.droppableId === destination.droppableId) {
      // Kéo mục trong cùng một nhóm
      const updatedItems = { ...items };
      const updatedGroup = [...updatedItems[source.droppableId]];

      updatedGroup.splice(source.index, 1);
      updatedGroup.splice(
        destination.index,
        0,
        items[source.droppableId][source.index]
      );

      updatedItems[source.droppableId] = updatedGroup;
      setItems(updatedItems);
    } else {
      // Kéo mục qua các nhóm khác nhau
      const sourceGroup = [...items[source.droppableId]];
      const destGroup = [...items[destination.droppableId]];
      const [draggedItem] = sourceGroup.splice(source.index, 1);

      destGroup.splice(destination.index, 0, draggedItem);

      const updatedItems = {
        ...items,
        [source.droppableId]: sourceGroup,
        [destination.droppableId]: destGroup,
      };

      setItems(updatedItems);
    }
  };

  function limitText(text, limit) {
    if (text.length > limit) {
      return text.slice(0, limit) + "...";
    }
    return text;
  }

  function PriorityArrow(priorityName) {
    if (priorityName === "High") {
      return (
        <NorthIcon
          sx={{
            fontSize: "14px",
            margin: "0 5px",
          }}
        />
      );
    } else if (priorityName === "Medium") {
      return (
        <EastIcon
          sx={{
            fontSize: "14px",
            margin: "0 5px",
          }}
        />
      );
    } else if (priorityName === "Low") {
      return (
        <SouthEastIcon
          sx={{
            fontSize: "14px",
            margin: "0 5px",
          }}
        />
      );
    } else {
      return (
        <SouthIcon
          sx={{
            fontSize: "14px",
            margin: "0 5px",
          }}
        />
      );
    }
  }

  useEffect(() => {
    if (projectDetail && projectDetail.lstTask) {
      const initialItems = {};
      projectDetail.lstTask.forEach((status) => {
        initialItems[status.statusId] = status.lstTaskDeTail || [];
      });
      setItems(initialItems);
    }
  }, [projectDetail]);

  // console.log(projectDetail);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Box>
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#172B4D",
              textTransform: "uppercase",
            }}
          >
            {projectDetail.projectName}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControl
              sx={{ m: "16px 16px 16px 0", width: "25ch" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-search">
                Search
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Box
              display={"flex"}
              onClick={(event) => {
                handleClickListMember(event);
              }}
            >
              {projectDetail.members.slice(0, 2).map((member) => {
                return (
                  <Avatar
                    alt={member.name}
                    src={member.avatar}
                    key={member.userId}
                  />
                );
              })}
              {projectDetail.members.length > 2 && (
                <Fab
                  size="small"
                  color="warning"
                  aria-label="add"
                  sx={{ boxShadow: "none", marginRight: "3px" }}
                >
                  +{projectDetail.members.length - 2}
                </Fab>
              )}
            </Box>
          </Box>

          <Box>
            <Button
              color="warning"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ marginLeft: "8px" }}
              onClick={() => {
                handleClickOpenCreateTask();
              }}
            >
              Task
            </Button>
          </Box>
        </Box>

        {/* Quản lí và hiển thị task */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.25rem",
          }}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.keys(items).map((statusId) => {
              const status = items[statusId];
              const statusData = projectDetail.lstTask.find(
                (task) => task.statusId === statusId
              );
              // Đếm số lượng ISSUES trong mỗi group
              const numberOfIssues = status.length;
              // console.log(status);
              // console.log(statusData);
              return (
                <Droppable key={statusId} droppableId={statusId}>
                  {(provided, snapshot) => {
                    return (
                      <Box
                        sx={{
                          padding: "0 8px",
                          backgroundColor: "#f4f5f7",
                          borderRadius: "5px",
                          boxShadow:
                            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;",
                        }}
                        ref={provided.innerRef}
                      >
                        <Box sx={{ padding: "0 8px" }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "12px 8px",
                            }}
                          >
                            <Typography
                              sx={{
                                textTransform: "uppercase",
                                fontWeight: "500",
                                color: " rgb(94 108 132)",
                                fontSize: "11px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                paddingRight: "8px",
                              }}
                            >
                              {limitText(statusData.statusName, 16)}
                            </Typography>
                            <Typography
                              sx={{
                                textTransform: "uppercase",
                                fontWeight: "500",
                                color: " rgb(94 108 132)",
                                fontSize: "10px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {numberOfIssues} ISSUES
                            </Typography>
                          </Box>
                          {status.map((item, index) => {
                            return (
                              <Draggable
                                key={item.taskName}
                                draggableId={item.taskName}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <Box
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => {
                                        handleClickOpenEditTask();
                                        setTaskId(item.taskId);
                                      }}
                                      sx={{
                                        userSelect: "none",
                                        padding: "12px",
                                        margin: "0 0 12px 0",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        background: snapshot.isDragging
                                          ? "#ffffffda"
                                          : "#fff",
                                        minHeight: "120px",
                                        ...provided.draggableProps.style,
                                        transition: "all 0.5s",

                                        ":hover": {
                                          backgroundColor: "#f4f5f7",
                                          boxShadow:
                                            "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                                        },
                                      }}
                                    >
                                      <Typography
                                        component={"h6"}
                                        sx={{
                                          color: "#000000d8",
                                          fontWeight: "600",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {item.taskName}
                                      </Typography>

                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Box
                                          display={"flex"}
                                          alignItems={"center"}
                                        >
                                          {item.taskTypeDetail.taskType ===
                                          "bug" ? (
                                            <BugReportIcon
                                              color="error"
                                              sx={{ fontSize: "17px" }}
                                            />
                                          ) : (
                                            <CheckBoxIcon
                                              color="success"
                                              sx={{ fontSize: "17px" }}
                                            />
                                          )}
                                          {PriorityArrow(
                                            item.priorityTask.priority
                                          )}

                                          <Typography sx={{ fontSize: "12px" }}>
                                            {item.priorityTask.priority}
                                          </Typography>
                                        </Box>

                                        <Box
                                          display={"flex"}
                                          alignItems={"center"}
                                        >
                                          {item.assigness
                                            .slice(0, 2)
                                            .map((member) => {
                                              return (
                                                <Avatar
                                                  alt={member.name}
                                                  src={member.avatar}
                                                  sx={{ width: 29, height: 29 }}
                                                  key={member.id}
                                                />
                                              );
                                            })}
                                          {item.assigness.length > 2 && (
                                            <Fab
                                              size="large"
                                              color="warning"
                                              aria-label="add"
                                              sx={{
                                                boxShadow: "none",
                                                // marginRight: "3px",
                                                width: 29,
                                                minHeight: 20,
                                                height: 29,
                                              }}
                                            >
                                              +{item.assigness.length - 2}
                                            </Fab>
                                          )}
                                        </Box>
                                      </Box>
                                    </Box>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}{" "}
                          {/* Đảm bảo thêm placeholder */}
                        </Box>
                      </Box>
                    );
                  }}
                </Droppable>
              );
            })}
          </DragDropContext>
        </Box>
      </Box>

      <PopoverListMember
        anchorEl={anchorElListMember}
        handleClose={handleCloseListMember}
        projectDetail={projectDetail}
      />

      {/* Create Task */}
      <DialogCreateTask
        open={openCreateTask}
        handleClose={handleCloseCreateTask}
        projectId={projectId}
        projectDetail={projectDetail}
      />

      {/* Edit Task */}
      <DialogEditTask
        open={openEditTask}
        handleClose={handleCloseEditTask}
        taskId={taskId}
        projectDetail={projectDetail}
      />
    </>
  );
}
