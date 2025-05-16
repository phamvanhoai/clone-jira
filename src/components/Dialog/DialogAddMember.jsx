import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { getUser } from "../../apis/userAPI";
import { assignUserProject } from "../../apis/projectAPI";
import { AlertJiraFilled } from "../styled/styledAlert";
import PopperModal from "../Popper/PopperModal";

export default function DialogAddMember(props) {
  const {
    handleClose,
    open,
    projectIdAddMember,
    projectManagement,
    setProjectSetting,
  } = props;

  const [value, setValue] = useState("");
  const [anchorElAddMember, setAnchorElAddMember] = useState(null);
  const [isAddMember, setIsAddMember] = useState(false);
  const [user, setUser] = useState({});
  const [openErrorAddMember, setOpenErrorAddMember] = useState(false);
  const [openSuccessAddMember, setOpenSuccessAddMember] = useState(false);

  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["getUserMobile", value],
    queryFn: async () => {
      if (value) {
        const result = await getUser(value);
        return result;
      }
      return [];
    },
  });

  const { mutate: handleAddMember, error } = useMutation({
    mutationFn: (project) => assignUserProject(project),
    onError: () => {
      setOpenErrorAddMember(true);
      handleClosePopper();
    },
    onSuccess: () => {
      setOpenSuccessAddMember(true);
      handleClosePopper();
      queryClient.invalidateQueries("projectManaMobile");
    },
  });

  const handleClick = (event, selectedUser) => {
    setAnchorElAddMember(event.currentTarget);
    setIsAddMember(true);
    setUser(selectedUser);
  };

  const handleClosePopper = () => {
    setAnchorElAddMember(null);
    setIsAddMember(false);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleCloseAddMember = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenErrorAddMember(false);
    setOpenSuccessAddMember(false);
  };

  useEffect(() => {
    const selectedProject = projectManagement.find(
      (project) => project?.id === projectIdAddMember
    );
    if (selectedProject) {
      setProjectSetting(selectedProject);
    }
  }, [projectManagement, projectIdAddMember, setProjectSetting]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            px: 3,
            py: 3,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "22px",
            color: "#1c1c1e",
            mb: 2,
          }}
        >
          Add Member
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={value}
            onChange={handleChange}
            sx={{
              input: {
                fontSize: "16px",
                padding: "10px 0",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              },
              mb: 3,
            }}
          />
          <Box
            sx={{
              maxHeight: 200,
              overflowY: "auto",
              borderRadius: 2,
              border: "1px solid #d1d1d6",
              backgroundColor: "#f9f9f9",
              px: 1,
            }}
          >
            {users.length === 0 && value ? (
              <Typography
                sx={{ p: 2, color: "#8e8e93", textAlign: "center" }}
              >
                No users found.
              </Typography>
            ) : (
              users.map((user) => (
                <Box
                  key={user.userId}
                  onClick={(event) => handleClick(event, user)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    cursor: "pointer",
                    borderRadius: 2,
                    transition: "background-color 0.25s ease",
                    "&:hover": {
                      backgroundColor: "#e5e5ea",
                    },
                  }}
                >
                  <Avatar
                    alt={user.name}
                    src={user.avatar}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: "#1c1c1e",
                      fontSize: "16px",
                    }}
                  >
                    {user.name}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", pt: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 20,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "15px",
              color: "#007aff",
              borderColor: "#007aff",
              "&:hover": {
                borderColor: "#005fcc",
                backgroundColor: "#e5f0ff",
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <PopperModal
        anchorEl={anchorElAddMember}
        handleClose={handleClosePopper}
        isAddMember={isAddMember}
        projectIdAddMember={projectIdAddMember}
        user={user}
        handleAddMember={handleAddMember}
      />

      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccessAddMember}
          autoHideDuration={2000}
          onClose={handleCloseAddMember}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <AlertJiraFilled
            onClose={handleCloseAddMember}
            severity="success"
            sx={{
              bgcolor: "#34c759",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            Member added successfully
          </AlertJiraFilled>
        </Snackbar>
        <Snackbar
          open={openErrorAddMember}
          autoHideDuration={2000}
          onClose={handleCloseAddMember}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <AlertJiraFilled
            onClose={handleCloseAddMember}
            severity="error"
            sx={{
              bgcolor: "#ff3b30",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {error?.message || "Failed to add member"}
          </AlertJiraFilled>
        </Snackbar>
      </Stack>
    </>
  );
}
