import React from "react";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import {
  Avatar,
  Box,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import PopperModal from "../../../../components/Popper/PopperModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeUserFromProject } from "../../../../apis/projectAPI";
import { AlertJiraFilled } from "../../../../components/styled/styledAlert";

export default function ProjectMember({
  member,
  projectIdDeleteMember,
  handleCloseMember,
}) {
  const [anchorElDeleteMember, setAnchorElDeleteMember] = React.useState(null);
  const [isDeleteMember, setIsDeleteMember] = React.useState(false);
  const [openErrorDeleteMember, setOpenErrorDeleteMember] =
    React.useState(false);
  const [openSuccessDeleteMember, setOpenSuccessDeleteMember] =
    React.useState(false);

  const queryClient = useQueryClient();

  const { mutate: handleRemoveUserFromProject, error } = useMutation({
    mutationFn: (project) => {
      return removeUserFromProject(project);
    },
    onError: () => {
      setOpenErrorDeleteMember(true);
      handleClose();
    },
    onSuccess: () => {
      setOpenSuccessDeleteMember(true);
      handleClose();
      queryClient.invalidateQueries("projectManaDesktop");

      setTimeout(() => {
        handleCloseMember();
      }, 1500);
    },
  });

  const handleClick = (event) => {
    setAnchorElDeleteMember(anchorElDeleteMember ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElDeleteMember(null);
    setIsDeleteMember(false);
  };

  // Hàm đóng Alert thông báo
  const handleCloseDeleteMember = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorDeleteMember(false);
    setOpenSuccessDeleteMember(false);
  };

  return (
    <>
      <Box
        sx={{
          padding: "8px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar alt={member.name} src={member.avatar} />
          <Typography sx={{ marginLeft: "5px" }}>{member.name}</Typography>
        </Box>
        <Box>
          <IconButton
            color="error"
            onClick={(event) => {
              handleClick(event);
              setIsDeleteMember(true);
            }}
          >
            <HighlightOffOutlinedIcon color="error" />
          </IconButton>
        </Box>
      </Box>
      {/* Modal nhắc nhở có nên xóa member */}
      <PopperModal
        anchorEl={anchorElDeleteMember}
        handleClose={handleClose}
        handleRemoveUserFromProject={handleRemoveUserFromProject}
        member={member}
        isDeleteMember={isDeleteMember}
        projectIdDeleteMember={projectIdDeleteMember}
      />

      {/* Alert thông báo lỗi và thành công */}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccessDeleteMember}
          autoHideDuration={2000}
          onClose={handleCloseDeleteMember}
        >
          <AlertJiraFilled
            onClose={handleCloseDeleteMember}
            severity="success"
            sx={{ width: "100%" }}
          >
            Xóa member thành công
          </AlertJiraFilled>
        </Snackbar>
        <Snackbar
          open={openErrorDeleteMember}
          autoHideDuration={2000}
          onClose={handleCloseDeleteMember}
        >
          <AlertJiraFilled
            onClose={handleCloseDeleteMember}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </AlertJiraFilled>
        </Snackbar>
      </Stack>
    </>
  );
}
