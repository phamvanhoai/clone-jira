import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Transition } from "./TransitionDialog";
import FaceIcon from "@mui/icons-material/Face";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import DialogAddMember from "./DialogAddMember";
import PopperModal from "../Popper/PopperModal";
import { AlertJiraFilled } from "../styled/styledAlert";
import { deleteProject, removeUserFromProject } from "../../apis/projectAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditProject from "../../modules/ProjectManagement/EditProject";

export default function DialogModal(props) {
  const {
    open,
    handleClose,
    project,
    projectManagement,
    setProjectSetting,
    isOpenEdit,
  } = props;

  // Add Member
  const [openMember, setOpenMember] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);

  // Delete Member
  const [anchorElDeleteMember, setAnchorElDeleteMember] = React.useState(null);
  const [isDeleteMember, setIsDeleteMember] = React.useState(false);
  const [openErrorDeleteMember, setOpenErrorDeleteMember] =
    React.useState(false);
  const [openSuccessDeleteMember, setOpenSuccessDeleteMember] =
    React.useState(false);
  const [member, setMember] = useState([]);

  // Project information
  const [openInfo, setOpenInfo] = useState(false);

  // Delete Project
  const [openError, setOpenError] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [anchorElDelete, setAnchorElDelete] = React.useState(null);
  const [isDelete, setIsDelete] = React.useState(false);
  const [projectIdDelete, setProjectIdDelete] = React.useState("");
  const [projectNameDelete, setProjectNameDelete] = React.useState("");

  const queryClient = useQueryClient();

  const { mutate: handleRemoveUserFromProject, error } = useMutation({
    mutationFn: (project) => {
      return removeUserFromProject(project);
    },
    onError: () => {
      setOpenErrorDeleteMember(true);
      handleCloseMember();
    },
    onSuccess: () => {
      setOpenSuccessDeleteMember(true);
      handleCloseMember();
      queryClient.invalidateQueries("projectManaMobile");
    },
  });

  const { mutate: handleDeleteProject, error: errorDeleteProject } =
    useMutation({
      mutationFn: (projectId) => deleteProject(projectId),
      onError: () => {
        setOpenError(true);
        setIsDelete(false);
      },
      onSuccess: () => {
        setOpenSuccess(true);
        queryClient.invalidateQueries("projectCategoryCreate");
        setIsDelete(false);

        setTimeout(() => {
          handleClose();
        }, 1500);
      },
    });

  // Add Member
  const handleClickMember = () => {
    setOpenMember(!openMember);
  };

  const handleClickOpenAddMember = () => {
    setOpenAddMember(true);
  };

  const handleCloseAddMember = () => {
    setOpenAddMember(false);
  };

  // Delete Member

  const handleClickDeleteMember = (event) => {
    setAnchorElDeleteMember(anchorElDeleteMember ? null : event.currentTarget);
  };

  const handleCloseMember = () => {
    setAnchorElDeleteMember(null);
    setIsDeleteMember(false);
  };

  // Hàm đóng Alert thông báo Delete Member
  const handleCloseDeleteMember = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorDeleteMember(false);
    setOpenSuccessDeleteMember(false);
  };

  // Project information
  const handleClickInfo = () => {
    setOpenInfo(!openInfo);
  };

  /* Delete Project */
  // Hàm đóng Alert thông báo Delete Project
  const handleCloseDeleteProject = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
    setOpenSuccess(false);
  };

  // Hàm đóng mở PopperDelete

  const handleClickDelete = (event) => {
    setAnchorElDelete(event.currentTarget);
    setIsDelete(true);
  };

  const handleCloseDelete = () => {
    setAnchorElDelete(null);
    setIsDelete(false);
  };

  React.useEffect(() => {
    const selectedProject = projectManagement.find(
      (project1) => project1?.id === project?.id
    );

    if (selectedProject) {
      setProjectSetting(selectedProject);
    }
  }, [projectManagement, project, setProjectSetting]);

  if (!project) {
    return null;
  }

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            backgroundColor: "#F5F5F7", // nền trắng nhạt kiểu Apple
          },
        }}
      >
        <AppBar
          sx={{
            position: "relative",
            backgroundColor: "#F5F5F7",
            boxShadow: "none",
            borderBottom: "1px solid #D1D1D6",
          }}
        >
          <Toolbar sx={{ minHeight: 64, px: 3 }}>
            <Typography
              sx={{ flex: 1, fontWeight: 600, fontSize: 28, color: "#1D1D1F" }}
              component="div"
            >
              Project Setting
            </Typography>
            <IconButton
              edge="start"
              onClick={handleClose}
              aria-label="close"
              sx={{
                color: "#1D1D1F",
                borderRadius: "12px",
                "&:hover": { backgroundColor: "#E5E5EA" },
                transition: "background-color 0.3s ease",
              }}
            >
              <CloseIcon fontSize="medium" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Divider sx={{ borderColor: "#D1D1D6" }} />
        {project && (
          <List>
            <ListItem sx={{ padding: "16px 40px" }}>
              <ListItemText
                primary="Name"
                primaryTypographyProps={{
                  color: "#1D1D1F",
                  fontWeight: 600,
                  fontSize: 24,
                }}
              />
              <Typography
                sx={{
                  color: "#3C3C4399",
                  fontWeight: 400,
                  fontSize: 17,
                }}
              >
                {project.projectName}
              </Typography>
            </ListItem>
            <Divider sx={{ borderColor: "#D1D1D6" }} />
            <ListItem sx={{ padding: "16px 40px" }}>
              <ListItemText
                primary="Creator"
                primaryTypographyProps={{
                  color: "#1D1D1F",
                  fontWeight: 600,
                  fontSize: 24,
                }}
              />
              <Chip
                label={project.creator?.name}
                variant="outlined"
                color="success"
                icon={<FaceIcon />}
                sx={{
                  borderRadius: "12px",
                  fontWeight: 500,
                  fontSize: 16,
                  height: 32,
                  borderColor: "#34C759",
                  color: "#34C759",
                }}
              />
            </ListItem>
            <Divider sx={{ borderColor: "#D1D1D6" }} />

            {/* Member */}
            <ListItem sx={{ padding: "16px 40px" }}>
              <ListItemText
                primary="Member"
                primaryTypographyProps={{
                  color: "#1D1D1F",
                  fontWeight: 600,
                  fontSize: 24,
                }}
              />
              <Chip
                label="Add"
                variant="outlined"
                color="warning"
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: 16,
                  borderColor: "#FF9500",
                  color: "#FF9500",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#FFE5B4",
                  },
                }}
                onClick={handleClickOpenAddMember}
              />
            </ListItem>
            <ListItem
              sx={{
                flexDirection: "column",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderRadius: "16px",
                mx: 5,
                my: 2,
              }}
            >
              <ListItemButton
                onClick={handleClickMember}
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 30px",
                  borderRadius: "16px",
                  transition: "background-color 0.3s ease",
                  "&:hover": { backgroundColor: "#F0F0F5" },
                }}
              >
                <Box display={"flex"} gap={1} alignItems={"center"}>
                  <Typography
                    fontWeight={600}
                    fontSize={22}
                    color="#1D1D1F"
                    component="span"
                  >
                    Member
                  </Typography>
                  <Chip
                    label={project.members?.length}
                    sx={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1D1D1F",
                      borderColor: "#1D1D1F",
                    }}
                    variant="outlined"
                  />
                </Box>
                <ExpandMoreIcon
                  sx={{
                    fontSize: 28,
                    color: openMember ? "#007AFF" : "#8E8E93",
                    transform: openMember ? "rotate(180deg)" : "none",
                    transition: "transform 0.3s ease, color 0.3s ease",
                  }}
                />
              </ListItemButton>
              <Collapse in={openMember} timeout="auto" unmountOnExit>
                <List sx={{ paddingLeft: 3, paddingRight: 3 }}>
                  {project?.members?.map((member) => (
                    <ListItem
                      key={member.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(event) => {
                            handleClickDeleteMember(event);
                            setMember(member);
                          }}
                          sx={{
                            color: "#FF3B30",
                            "&:hover": { backgroundColor: "#FEEDEE" },
                            borderRadius: "12px",
                            transition: "background-color 0.3s ease",
                          }}
                        >
                          <HighlightOffOutlinedIcon />
                        </IconButton>
                      }
                      sx={{
                        padding: "10px 12px",
                        borderRadius: "12px",
                        mb: 1,
                        backgroundColor: "#FAFAFA",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        transition: "background-color 0.3s ease",
                        "&:hover": { backgroundColor: "#F0F0F5" },
                      }}
                    >
                      <Avatar
                        alt={member.name}
                        src={member.avatar}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "12px",
                          mr: 2,
                        }}
                      />
                      <ListItemText
                        primary={member.name}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: 17,
                          color: "#1D1D1F",
                        }}
                      />
                      <ChevronRightIcon
                        sx={{ color: "#8E8E93", fontSize: 24 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </ListItem>
            <Divider sx={{ borderColor: "#D1D1D6" }} />
            <ListItem
              sx={{
                backgroundColor: "#fff",
                padding: "20px 40px",
                borderRadius: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                my: 3,
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#FF3B30",
                  borderRadius: "12px",
                  width: "100%",
                  padding: "14px 0",
                  fontWeight: 600,
                  fontSize: 17,
                  color: "#fff",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#FF453A",
                    boxShadow: "0 4px 14px rgba(255, 59, 48, 0.4)",
                  },
                  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={(event) => {
                  handleClickDelete(event);
                  setProjectIdDelete(project.id);
                  setProjectNameDelete(project.projectName);
                }}
              >
                Delete Project
              </Button>
            </ListItem>
          </List>
        )}
      </Dialog>

      {/* Dialog add member */}
      <DialogAddMember
        openAddMember={openAddMember}
        handleCloseAddMember={handleCloseAddMember}
        project={project}
        projectManagement={projectManagement}
      />

      {/* Popper Delete Member */}
      <PopperModal
        open={Boolean(anchorElDeleteMember)}
        anchorEl={anchorElDeleteMember}
        handleClose={handleCloseMember}
        isDelete={isDeleteMember}
        setIsDelete={setIsDeleteMember}
        title="Are you sure to delete this member?"
        description="You will remove this member out of project."
        mutate={handleRemoveUserFromProject}
        data={member}
      />

      {/* Popper Delete Project */}
      <PopperModal
        open={Boolean(anchorElDelete)}
        anchorEl={anchorElDelete}
        handleClose={handleCloseDelete}
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        title="Are you sure to delete this project?"
        description={`You will delete this project "${projectNameDelete}" permanently.`}
        mutate={handleDeleteProject}
        data={projectIdDelete}
      />

      {/* Alert Delete Member */}
      <Snackbar
        open={openErrorDeleteMember}
        autoHideDuration={6000}
        onClose={handleCloseDeleteMember}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <AlertJiraFilled
          onClose={handleCloseDeleteMember}
          severity="error"
          sx={{ width: "100%" }}
        >
          Delete member failed!
        </AlertJiraFilled>
      </Snackbar>

      <Snackbar
        open={openSuccessDeleteMember}
        autoHideDuration={6000}
        onClose={handleCloseDeleteMember}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <AlertJiraFilled
          onClose={handleCloseDeleteMember}
          severity="success"
          sx={{ width: "100%" }}
        >
          Delete member successfully!
        </AlertJiraFilled>
      </Snackbar>

      {/* Alert Delete Project */}
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseDeleteProject}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <AlertJiraFilled
          onClose={handleCloseDeleteProject}
          severity="error"
          sx={{ width: "100%" }}
        >
          Delete project failed!
        </AlertJiraFilled>
      </Snackbar>

      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleCloseDeleteProject}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <AlertJiraFilled
          onClose={handleCloseDeleteProject}
          severity="success"
          sx={{ width: "100%" }}
        >
          Delete project successfully!
        </AlertJiraFilled>
      </Snackbar>
    </>
  );
}
