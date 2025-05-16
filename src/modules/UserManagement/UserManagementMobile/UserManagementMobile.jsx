import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { deleteUser, getUser } from "../../../apis/userAPI";
import {
  Box,
  Button,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import unorm from "unorm";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Loading from "../../../components/Loading";
import CreateUser from "../CreateUser";
import EditUser from "../EditUser/EditUser";
import PopperModal from "../../../components/Popper/PopperModal";
import { AlertJiraFilled } from "../../../components/styled/styledAlert";
import DialogInfoUser from "../../../components/Dialog/DialogInfoUser";

export default function UserManagementMobile() {
  const [openErrorDeleteUser, setOpenErrorDeleteUser] = useState(false);
  const [openSuccessDeleteUser, setOpenSuccessDeleteUser] = useState(false);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [anchorElDeleteUser, setAnchorElDeleteUser] = useState(null);
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState("");
  const [searchText, setSearchText] = useState(""); // State để lưu giá trị từ ô tìm kiếm

  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["getUserManagement"],
    queryFn: getUser,
  });

  const { mutate: handleDeleteUser, error } = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      setOpenSuccessDeleteUser(true);
      handleCloseDeleteUser();
      setIsDeleteUser(false);
      queryClient.invalidateQueries("getUserManagement");
    },
    onError: () => {
      setOpenErrorDeleteUser(true);
      handleCloseDeleteUser();
      setIsDeleteUser(false);
    },
  });

  // Hàm đóng Alert thông báo delete user
  const handleCloseAlertDeleteUser = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorDeleteUser(false);
    setOpenSuccessDeleteUser(false);
  };

  // Dialog CreateUser, EditUser and InfoUser
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [userAccount, setUserAccount] = useState("");
  const [openInfoUser, setOpenInfoUser] = useState(false);
  const [userInfo, setUserInfo] = useState("");

  const handleClickOpenCreateUser = () => {
    setOpenCreateUser(true);
  };
  const handleCloseCreateUser = () => {
    setOpenCreateUser(false);
  };

  const handleClickOpenEditUser = () => {
    setOpenEditUser(true);
  };
  const handleCloseEditUser = () => {
    setOpenEditUser(false);
  };

  const handleClickOpenInfoUser = () => {
    setOpenInfoUser(true);
  };
  const handleCloseInfoUser = () => {
    setOpenInfoUser(false);
  };

  // Hàm tìm kiếm dựa trên giá trị từ ô tìm kiếm
  const filteredUser = users.filter((user) => {
    const normalizedSearchText = unorm.nfkd(searchText).toLowerCase();
    const normalizedUserName = unorm.nfkd(user.name).toLowerCase();
    return normalizedUserName.includes(normalizedSearchText);
  });

  // Hàm đóng mở PopperDelete

  const handleClickDeleteUser = (event) => {
    setAnchorElDeleteUser(event.currentTarget);
    setIsDeleteUser(true);
  };

  const handleCloseDeleteUser = () => {
    setAnchorElDeleteUser(null);
    setIsDeleteUser(false);
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Box height={10} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: "800",
            fontSize: "24px",
            color: "#172B4D",
            marginBottom: "16px",
          }}
        >
          USER MANAGEMENT
        </Typography>
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          color="warning"
          onClick={handleClickOpenCreateUser}
        >
          Create User
        </Button>
      </Box>
      <Box>
        <TextField
          fullWidth
          label="Search Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Box>

      <Box
        sx={{
          maxHeight: "70vh",
          overflow: "scroll",
          marginTop: "16px",
          borderTop: "1px solid #e6e7eb",
        }}
      >
        {filteredUser.map((user) => {
          return (
            <Box
              key={user.userId}
              sx={{
                border: "1px solid rgb(209 213 219)",

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  lineHeight: "1.75rem",
                  padding: "15px",
                  cursor: "pointer",
                  transition: "all 0.5s",

                  ":hover": {
                    color: "#e65353",
                  },
                }}
                onClick={() => {
                  setUserInfo(user);
                  handleClickOpenInfoUser();
                }}
              >
                {user.name}
              </Typography>

              <Box sx={{ display: "flex" }}>
                <Box
                  sx={{
                    borderLeft: "1px solid rgb(209 213 219)",
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <EditOutlinedIcon
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s",

                      ":hover": {
                        color: "#1976d2",
                      },
                    }}
                    onClick={() => {
                      handleClickOpenEditUser();
                      setUserAccount(user);
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    borderLeft: "1px solid rgb(209 213 219)",
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <DeleteOutlineOutlinedIcon
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s",

                      ":hover": {
                        color: "#e65353",
                      },
                    }}
                    onClick={(e) => {
                      handleClickDeleteUser(e);
                      setUserId(user.userId);
                      setUserName(user.name);
                    }}
                  />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Divider />
      <CreateUser open={openCreateUser} handleClose={handleCloseCreateUser} />

      <EditUser
        open={openEditUser}
        handleClose={handleCloseEditUser}
        userAccount={userAccount}
      />

      <DialogInfoUser
        open={openInfoUser}
        handleClose={handleCloseInfoUser}
        userInfo={userInfo}
      />

      {/* Modal nhắc nhở có nên xóa user */}
      <PopperModal
        anchorEl={anchorElDeleteUser}
        handleClose={handleCloseDeleteUser}
        handleDeleteUser={handleDeleteUser}
        isDeleteUser={isDeleteUser}
        userId={userId}
        userName={userName}
      />

      {/* Alert thông báo lỗi và thành công */}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccessDeleteUser}
          autoHideDuration={2000}
          onClose={handleCloseAlertDeleteUser}
        >
          <AlertJiraFilled
            onClose={handleCloseAlertDeleteUser}
            severity="success"
            sx={{ width: "100%" }}
          >
            Xóa user thành công
          </AlertJiraFilled>
        </Snackbar>
        <Snackbar
          open={openErrorDeleteUser}
          autoHideDuration={2000}
          onClose={handleCloseAlertDeleteUser}
        >
          <AlertJiraFilled
            onClose={handleCloseAlertDeleteUser}
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
