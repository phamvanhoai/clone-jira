import {
  Avatar,
  Box,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { getUser } from "../../../../apis/userAPI";
import PopperModal from "../../../../components/Popper/PopperModal";
import { assignUserProject } from "../../../../apis/projectAPI";
import { AlertJiraFilled } from "../../../../components/styled/styledAlert";

export default function ProjectAddMember({ projectIdAddMember }) {
  const [value, setValue] = useState("");
  const [anchorElAddMember, setAnchorEAddMember] = React.useState(null);
  const [isAddMember, setIsAddMember] = React.useState(false);
  const [user, setUser] = React.useState([]);
  const [openErrorAddMember, setOpenErrorAddMember] = React.useState(false);
  const [openSuccessAddMember, setOpenSuccessAddMember] = React.useState(false);

  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["getUser", value],
    queryFn: async () => {
      if (value) {
        // Gọi API để tìm kiếm người dùng dựa trên giá trị `value`
        const result = await getUser(value);
        return result;
      }
      return []; // Trả về một mảng trống nếu không có giá trị `value`
    },
  });

  const { mutate: handleAddMember, error } = useMutation({
    mutationFn: (project) => assignUserProject(project),
    onError: () => {
      setOpenErrorAddMember(true);
      handleClose();
    },
    onSuccess: () => {
      setOpenSuccessAddMember(true);
      handleClose();
      queryClient.invalidateQueries("projectManaDesktop");
    },
  });

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEAddMember(anchorElAddMember ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEAddMember(null);
    setIsAddMember(false);
  };

  // Hàm đóng Alert thông báo
  const handleCloseAddMember = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorAddMember(false);
    setOpenSuccessAddMember(false);
  };

  return (
    <Box sx={{ p: 2, maxHeight: "24rem" }}>
      <TextField
        id="outlined-basic"
        label="Search user"
        variant="standard"
        fullWidth
        color="secondary"
        onChange={handleChange}
        value={value}
      />
      {users.map((user) => {
        return (
          <Box
            key={user.userId}
            onClick={(event) => {
              handleClick(event);
              setIsAddMember(true);
              setUser(user);
            }}
            sx={{
              padding: "10px 5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px",
              cursor: "pointer",
              transition: "all 1s",

              "&:hover": {
                backgroundColor: "#ddddddeb",
              },
            }}
          >
            <Avatar alt={user.name} src={user.avatar} />
            <Typography>{user.name}</Typography>
          </Box>
        );
      })}

      {/* Modal nhắc nhở có thêm member */}
      <PopperModal
        anchorEl={anchorElAddMember}
        handleClose={handleClose}
        isAddMember={isAddMember}
        projectIdAddMember={projectIdAddMember}
        user={user}
        handleAddMember={handleAddMember}
      />

      {/* Alert thông báo lỗi và thành công */}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccessAddMember}
          autoHideDuration={2000}
          onClose={handleCloseAddMember}
        >
          <AlertJiraFilled
            onClose={handleCloseAddMember}
            severity="success"
            sx={{ width: "100%" }}
          >
            Thêm member thành công
          </AlertJiraFilled>
        </Snackbar>
        <Snackbar
          open={openErrorAddMember}
          autoHideDuration={2000}
          onClose={handleCloseAddMember}
        >
          <AlertJiraFilled
            onClose={handleCloseAddMember}
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
