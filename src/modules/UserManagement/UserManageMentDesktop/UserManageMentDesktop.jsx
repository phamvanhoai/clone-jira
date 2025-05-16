import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { deleteUser, getUser } from "../../../apis/userAPI";
import Loading from "../../../components/Loading";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/styled/styledTable";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { TablePaginationActions } from "../../../components/TablePaginationActions/TablePaginationActions";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useState } from "react";
import CreateUser from "../CreateUser";
import EditUser from "../EditUser/EditUser";
import { AlertJiraFilled } from "../../../components/styled/styledAlert";
import PopperModal from "../../../components/Popper/PopperModal";

export default function UserManageMentDesktop() {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  // Sắp xếp theo tên
  const [sortOrder, setSortOrder] = React.useState("none");
  // Search Name
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchUserName, setSearchUserName] = React.useState("");

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

  const [openErrorDeleteUser, setOpenErrorDeleteUser] = React.useState(false);
  const [openSuccessDeleteUser, setOpenSuccessDeleteUser] =
    React.useState(false);
  const [isDeleteUser, setIsDeleteUser] = React.useState(false);
  const [anchorElDeleteUser, setAnchorElDeleteUser] = React.useState(null);
  const [userId, setUserId] = React.useState(0);
  const [userName, setUserName] = React.useState("");

  // Hàm đóng mở PopperDelete

  const handleClickDeleteUser = (event) => {
    setAnchorElDeleteUser(event.currentTarget);
    setIsDeleteUser(true);
  };

  const handleCloseDeleteUser = () => {
    setAnchorElDeleteUser(null);
    setIsDeleteUser(false);
  };

  // Hàm đóng Alert thông báo delete user
  const handleCloseAlertDeleteUser = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorDeleteUser(false);
    setOpenSuccessDeleteUser(false);
  };

  // Dialog CreateUser and EditUser
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [userAccount, setUserAccount] = useState("");

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sắp xếp theo tên
  const handleSort = React.useCallback(() => {
    if (sortOrder === "none") {
      // Lần đầu tiên nhấn: sắp xếp tăng dần
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      // Lần thứ hai nhấn: sắp xếp giảm dần
      setSortOrder("desc");
    } else {
      // Lần thứ ba nhấn: trở về trạng thái không sắp xếp
      setSortOrder("none");
    }
  }, [sortOrder]);

  const sortedUsers = React.useMemo(() => {
    if (sortOrder === "asc") {
      return [...users].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      return [...users].sort((a, b) => b.name.localeCompare(a.name));
    }
    return users;
  }, [users, sortOrder]);

  // Search Name
  const handleChangeValue = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchUserName(searchQuery);

    setPage(0);
  };

  const filteredUsers = React.useMemo(() => {
    return sortedUsers.filter((user) =>
      user.name.toLowerCase().includes(searchUserName.toLowerCase())
    );
  }, [sortedUsers, searchUserName]);

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
        <Box display={"flex"} justifyContent={"right"} mb={2}>
          <Box
            sx={{
              width: 500,
              maxWidth: "100%",
              marginRight: "16px",
              display: "flex",
              justifyContent: "end",
            }}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              label="Search Name"
              color="secondary"
              value={searchQuery}
              onChange={handleChangeValue}
            />
            <Button
              variant="contained"
              color="info"
              type="submit"
              size="small"
              sx={{ ml: 1 }}
            >
              <SearchIcon />
            </Button>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpenCreateUser}
            size="small"
          >
            Create User
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row" sx={{ width: "15%" }}>
                User Id
              </StyledTableCell>
              <StyledTableCell
                component="th"
                scope="row"
                sx={{
                  width: "20%",
                  cursor: "pointer",
                  transition: "all 0.5s",
                  "&:hover": { backgroundColor: "#000000c0 !important" },
                }}
                onClick={handleSort}
              >
                <Box display={"flex"} alignItems={"center"}>
                  User Name
                  {sortOrder === "desc" && <KeyboardArrowDownOutlinedIcon />}
                  {sortOrder === "asc" && <KeyboardArrowUpOutlinedIcon />}
                  {sortOrder === "none" && (
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      position={"relative"}
                    >
                      <KeyboardArrowUpOutlinedIcon
                        sx={{ position: "absolute", top: "-16px" }}
                      />
                      <KeyboardArrowDownOutlinedIcon
                        sx={{ position: "absolute", bottom: "-16px" }}
                      />
                    </Box>
                  )}
                </Box>
              </StyledTableCell>
              <StyledTableCell component="th" scope="row" sx={{ width: "25%" }}>
                Email
              </StyledTableCell>

              <StyledTableCell component="th" scope="row" sx={{ width: "20%" }}>
                Phone Number
              </StyledTableCell>
              <StyledTableCell component="th" scope="row" sx={{ width: "20%" }}>
                Action
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <StyledTableRow key={user.userId}>
                  <StyledTableCell>{user.userId}</StyledTableCell>
                  <StyledTableCell>{user.name}</StyledTableCell>
                  <StyledTableCell>{user.email}</StyledTableCell>
                  <StyledTableCell>{user.phoneNumber}</StyledTableCell>
                  <StyledTableCell>
                    <Box>
                      <IconButton
                        aria-label="update"
                        size="large"
                        onClick={() => {
                          handleClickOpenEditUser();
                          setUserAccount(user);
                        }}
                      >
                        <EditOutlinedIcon fontSize="inherit" color="primary" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={(e) => {
                          handleClickDeleteUser(e);
                          setUserId(user.userId);
                          setUserName(user.name);
                        }}
                      >
                        <DeleteOutlineOutlinedIcon
                          fontSize="inherit"
                          color="error"
                        />
                      </IconButton>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <StyledTableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={6}
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <CreateUser open={openCreateUser} handleClose={handleCloseCreateUser} />
      <EditUser
        open={openEditUser}
        handleClose={handleCloseEditUser}
        userAccount={userAccount}
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
