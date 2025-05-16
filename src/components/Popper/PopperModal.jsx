import React from "react";
import { Box, Button, Popper, Typography } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

export default function PopperModal(props) {
  const {
    anchorEl,
    isDeleteProject,
    name,
    handleDeleteProject,
    projectId,
    handleClose,
    isDeleteMember,
    handleRemoveUserFromProject,
    member,
    projectIdDeleteMember,
    isAddMember,
    projectIdAddMember,
    user,
    handleAddMember,
    isDeleteUser,
    handleDeleteUser,
    userId,
    userName,
  } = props;

  const open = Boolean(anchorEl);

  // Xác định loại action
  const actionType = isDeleteProject
    ? "deleteProject"
    : isDeleteMember
    ? "deleteMember"
    : isAddMember
    ? "addMember"
    : isDeleteUser
    ? "deleteUser"
    : null;

  if (!actionType) return null;

  const isDeleteAction = actionType !== "addMember";

  const entityName = isDeleteProject
    ? name
    : isDeleteMember
    ? member?.name
    : isAddMember
    ? user?.name
    : userName;

  const handleConfirm = () => {
    if (isDeleteProject) {
      handleDeleteProject(projectId);
    } else if (isDeleteMember) {
      handleRemoveUserFromProject({
        userId: member.userId,
        projectId: projectIdDeleteMember,
      });
    } else if (isAddMember) {
      handleAddMember({
        userId: user.userId,
        projectId: projectIdAddMember,
      });
    } else if (isDeleteUser) {
      handleDeleteUser(userId);
    }
    handleClose();
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="top"
      sx={{ zIndex: 11000, paddingBottom: "12px" }}
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
      ]}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          p: 3,
          minWidth: 320,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          color: "text.primary",
          userSelect: "none",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            width: 14,
            height: 14,
            bgcolor: "background.paper",
            top: -7,
            left: "calc(50% - 7px)",
            transform: "rotate(45deg)",
            boxShadow: "rgba(0, 0, 0, 0.05) -2px -2px 2px",
            borderRadius: 0.5,
            zIndex: -1,
            ...(isDeleteAction
              ? { bgcolor: "#ff3b30", boxShadow: "none" }
              : { bgcolor: "#34c759", boxShadow: "none" }),
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <HelpOutlineOutlinedIcon
            sx={{
              fontSize: 28,
              color: isDeleteAction ? "#ff3b30" : "#34c759",
              flexShrink: 0,
            }}
          />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Are you sure you want to {isDeleteAction ? "delete" : "add"}
            <Typography
              component="span"
              sx={{
                fontWeight: 600,
                ml: 0.5,
                color: isAddMember ? "#34c759" : "text.primary",
              }}
            >
              {entityName}
            </Typography>
            ?
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "#6e6e73",
              borderColor: "#d1d1d6",
              px: 3,
              "&:hover": {
                backgroundColor: "#f2f2f7",
                borderColor: "#a1a1a6",
              },
            }}
          >
            No
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              bgcolor: isDeleteAction ? "#ff3b30" : "#34c759",
              "&:hover": {
                bgcolor: isDeleteAction ? "#e02c20" : "#28a745",
              },
              boxShadow: "none",
            }}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Popper>
  );
}
