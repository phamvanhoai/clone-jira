import { Avatar, Box, Popover, Typography } from "@mui/material";
import React from "react";

export default function PopoverListMember(props) {
  const { anchorEl, handleClose, projectDetail } = props;
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 30px rgb(0 0 0 / 0.15), 0 0 0 1px rgb(0 0 0 / 0.05)",
          bgcolor: "#fff",
          minWidth: 260,
          maxHeight: "50vh",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          p: 1,
        },
      }}
    >
      <Box>
        <Typography
          sx={{
            p: 2,
            fontWeight: 600,
            fontSize: 16,
            color: "#1c1c1e",
            borderBottom: "1px solid #e0e0e0",
            userSelect: "none",
          }}
        >
          Members
        </Typography>

        {projectDetail.members.map((member) => (
          <Box
            key={member.userId}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 2,
              py: 1,
              cursor: "default",
              borderRadius: 2,
              transition: "background-color 0.15s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.05)",
              },
            }}
          >
            <Avatar
              alt={member.name}
              src={member.avatar}
              sx={{
                width: 36,
                height: 36,
                boxShadow: "0 1px 4px rgb(0 0 0 / 0.1)",
              }}
            />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: 15,
                color: "#1c1c1e",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {member.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Popover>
  );
}
