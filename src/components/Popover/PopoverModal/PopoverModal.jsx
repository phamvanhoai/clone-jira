import { Box, Chip, Popover } from "@mui/material";
import React from "react";

import ProjectMember from "../../../modules/ProjectManagement/ProjectManagementDesktop/ProjectMember";
import ProjectAddMember from "../../../modules/ProjectManagement/ProjectManagementDesktop/ProjectAddMember";

export default function PopoverModal(props) {
  const {
    anchorEl,
    handleClose,
    isMember,
    isAddMember,
    members,
    projectIdDeleteMember,
    projectIdAddMember,
  } = props;

  const open = Boolean(anchorEl);

  const commonPaperProps = {
    sx: {
      borderRadius: 3,
      boxShadow: "0 20px 30px rgb(0 0 0 / 0.15), 0 0 0 1px rgb(0 0 0 / 0.05)",
      bgcolor: "#fff",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      p: 2,
      minWidth: 280,
      maxHeight: "60vh",
      overflowY: "auto",
    },
  };

  if (isMember) {
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={commonPaperProps}
      >
        <Box display={"flex"} flexDirection={"column"} gap={1}>
          <Chip
            sx={{
              p: 1.5,
              mb: 1,
              fontWeight: 600,
              fontSize: 14,
              color: "#1c1c1e",
              bgcolor: "#f5f5f7",
              borderRadius: 2,
            }}
            label="All Members"
            variant="filled"
            color="warning"
            size="medium"
          />
          {members.map((member) => {
            return (
              <ProjectMember
                key={member.userId}
                member={member}
                projectIdDeleteMember={projectIdDeleteMember}
                handleCloseMember={handleClose}
              />
            );
          })}
        </Box>
      </Popover>
    );
  } else if (isAddMember) {
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        PaperProps={commonPaperProps}
      >
        <Box display={"flex"} flexDirection={"column"}>
          <ProjectAddMember projectIdAddMember={projectIdAddMember} />
        </Box>
      </Popover>
    );
  }
}
