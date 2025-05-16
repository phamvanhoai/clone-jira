import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { deleteProject, getProject } from "../../../apis/projectAPI";
import Loading from "../../../components/Loading";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Fab,
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
  Tooltip,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../components/styled/styledTable";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditProject from "../EditProject";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { TablePaginationActions } from "../../../components/TablePaginationActions/TablePaginationActions";
import { AlertJiraFilled } from "../../../components/styled/styledAlert";
import { useNavigate } from "react-router-dom";

import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import PopperModal from "../../../components/Popper/PopperModal";
import PopoverModal from "../../../components/Popover/PopoverModal";
// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";

export default function ProjectManagementDesktop() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isOpenEdit, setIsOpenEdit] = React.useState(false);
  const [projectId, setProjectId] = React.useState("");
  const [projectIdDelete, setProjectIdDelete] = React.useState("");
  const [projectNameDelete, setProjectNameDelete] = React.useState("");
  const [openError, setOpenError] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [anchorElDelete, setAnchorElDelete] = React.useState(null);
  const [isDelete, setIsDelete] = React.useState(false);
  const [anchorElMember, setAnchorElMember] = React.useState(null);
  const [isMember, setIsMember] = React.useState(false);
  const [anchorElAddMember, setAnchorElAddMember] = React.useState(null);
  const [isAddMember, setIsAddMember] = React.useState(false);
  const [members, setMembers] = React.useState([]);
  const [projectIdDeleteMember, setProjectIdDeleteMember] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("none");
  const [sortedData, setSortedData] = React.useState([]);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: projectManagement = [], isLoading } = useQuery({
    queryKey: ["projectManaDesktop", searchValue],
    queryFn: () => {
      if (searchValue) {
        const result = getProject(searchValue);
        return result;
      }
      return getProject();
    },
  });

  const { mutate: handleDeleteProject, error } = useMutation({
    mutationFn: (projectId) => deleteProject(projectId),
    onError: () => {
      setOpenError(true);
      setIsDelete(false);
    },
    onSuccess: () => {
      setOpenSuccess(true);
      queryClient.invalidateQueries("projectCategoryCreate");
      setIsDelete(false);
    },
  });

  // Biến kiểm tra xem sortedData có rỗng thì sẽ render ra projectManagement
  const displayData = sortedData.length ? sortedData : projectManagement;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - projectManagement.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleDrawerEditOpen = (id) => {
    setIsOpenEdit(true);
    setProjectId(id);
  };

  const toggleDrawerEditClose = () => {
    setIsOpenEdit(false);
  };

  // Hàm đóng Alert thông báo
  const handleClose = (event, reason) => {
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

  // Hàm đóng mở PopoverMember

  const handleClickMember = (event) => {
    setAnchorElMember(event.currentTarget);
  };

  const handleCloseMember = () => {
    setAnchorElMember(null);
    setIsAddMember(false);
    setIsMember(false);
  };

  // Hàm đóng mở PopoverAddMember

  const handleClickAddMember = (event) => {
    setAnchorElAddMember(event.currentTarget);
  };

  const handleCloseAddMember = () => {
    setAnchorElAddMember(null);
    setIsAddMember(false);
    setIsMember(false);
  };

  const handleChangeValue = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchValue(searchQuery);
    sortData(sortOrder);
    setPage(0);
  };

  const sortData = (order) => {
    if (order === "none") {
      setSortedData([]);
      setSortOrder(order);
    } else {
      const sorted = [...projectManagement].filter((project) =>
        project.alias.toLowerCase().includes(searchValue.toLowerCase())
      );

      if (order === "asc") {
        sorted.sort((a, b) => a.alias.localeCompare(b.alias));
        setSortedData(sorted);
        setSortOrder(order);
      } else if (order === "desc") {
        sorted.sort((a, b) => b.alias.localeCompare(a.alias));
        setSortedData(sorted);
        setSortOrder(order);
      }
      setSortedData(sorted);
      setSortedData(sorted);
    }
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
          PROJECT MANAGEMENT
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
              sx={{ height: "100%", ml: 1 }}
            >
              <SearchIcon />
            </Button>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              navigate("/createProject");
            }}
          >
            Create Project
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row" sx={{ width: "10%" }}>
                Id
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
                onClick={() => {
                  if (sortOrder === "none") {
                    sortData("asc"); // Khi nhấn lần đầu, sắp xếp tăng dần
                  } else if (sortOrder === "asc") {
                    sortData("desc"); // Khi nhấn lần 2, sắp xếp giảm dần
                  } else {
                    sortData("none"); // Khi nhấn lần 3, trở về trạng thái không sắp xếp
                  }
                }}
              >
                <Box display={"flex"} alignItems={"center"}>
                  Name
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
              <StyledTableCell component="th" scope="row" sx={{ width: "20%" }}>
                Category
              </StyledTableCell>
              <StyledTableCell component="th" scope="row" sx={{ width: "10%" }}>
                Creator
              </StyledTableCell>
              <StyledTableCell component="th" scope="row" sx={{ width: "20%" }}>
                Members
              </StyledTableCell>
              <StyledTableCell component="th" scope="row" sx={{ width: "20%" }}>
                Chức năng
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? displayData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : displayData
            ).map((project) => (
              <StyledTableRow
                key={project.id}
                sx={{
                  transition: "all 0.5s",
                }}
              >
                <StyledTableCell>{project.id}</StyledTableCell>
                <StyledTableCell>{project.alias}</StyledTableCell>
                <StyledTableCell>{project.categoryName}</StyledTableCell>
                <StyledTableCell>
                  <Chip
                    label={project.creator?.name}
                    color="success"
                    variant="outlined"
                    sx={{ color: "#0bb613" }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      onClick={(event) => {
                        handleClickMember(event);
                        setIsMember(true);
                        setIsAddMember(false);
                        setMembers(project.members);
                        setProjectIdDeleteMember(project.id);
                      }}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {project.members.slice(0, 2).map((member) => {
                        return (
                          <Box
                            key={member.name}
                            sx={{
                              display: "inline-block",
                              paddingRight: "3px",
                            }}
                          >
                            <Avatar alt={member.name} src={member.avatar} />
                          </Box>
                        );
                      })}
                      {project.members.length > 2 && (
                        <Fab
                          size="small"
                          color="warning"
                          aria-label="add"
                          sx={{ boxShadow: "none", marginRight: "3px" }}
                        >
                          +{project.members.length - 2}
                        </Fab>
                      )}
                    </Box>
                    <Fab
                      size="small"
                      color="secondary"
                      aria-label="add"
                      sx={{ boxShadow: "none" }}
                      onClick={(event) => {
                        handleClickAddMember(event);
                        setIsAddMember(true);
                        setIsMember(false);
                        setProjectIdDeleteMember(project.id);
                      }}
                    >
                      <AddIcon />
                    </Fab>
                  </Box>
                </StyledTableCell>

                <StyledTableCell>
                  <Box display={"flex"}>
                    <Tooltip title="Detail">
                      <Fab
                        color="warning"
                        aria-label="details"
                        size="small"
                        sx={{ marginRight: "5px" }}
                        onClick={() => {
                          navigate(`/projectDetail/${project.id}`);
                        }}
                      >
                        <ArticleOutlinedIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <Fab
                        color="primary"
                        aria-label="edit"
                        size="small"
                        onClick={() => {
                          toggleDrawerEditOpen(project.id);
                        }}
                        sx={{ marginRight: "5px" }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Fab
                        color="error"
                        aria-label="delete"
                        size="small"
                        onClick={(event) => {
                          handleClickDelete(event);
                          setProjectIdDelete(project.id);
                          setProjectNameDelete(project.projectName);
                        }}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
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
                rowsPerPageOptions={[10, 20, 50, { label: "All", value: -1 }]}
                colSpan={6}
                count={projectManagement.length}
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

      {/* Edit project */}
      <Drawer
        open={isOpenEdit}
        onClose={toggleDrawerEditClose}
        direction="right"
        // className="bla bla bla"
        zIndex={1060}
        style={{ width: "100%", maxWidth: "736px" }}
      >
        <EditProject projectId={projectId} isOpenEdit={isOpenEdit} />
      </Drawer>
      {/* Alert thông báo lỗi và thành công */}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={openSuccess}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <AlertJiraFilled
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Xóa project thành công
          </AlertJiraFilled>
        </Snackbar>
        <Snackbar
          open={openError}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <AlertJiraFilled
            onClose={handleClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </AlertJiraFilled>
        </Snackbar>
      </Stack>

      {/* Modal nhắc nhở có nên xóa project */}
      <PopperModal
        anchorEl={anchorElDelete}
        handleClose={handleCloseDelete}
        handleDeleteProject={handleDeleteProject}
        projectId={projectIdDelete}
        name={projectNameDelete}
        isDeleteProject={isDelete}
      />

      {/* Modal hiển thị danh sách member */}

      <PopoverModal
        handleClose={handleCloseMember}
        anchorEl={anchorElMember}
        isMember={isMember}
        members={members}
        projectIdDeleteMember={projectIdDeleteMember}
      />

      {/* Modal hiển thị add member */}
      <PopoverModal
        handleClose={handleCloseAddMember}
        anchorEl={anchorElAddMember}
        isAddMember={isAddMember}
        projectIdAddMember={projectIdDeleteMember}
      />
    </>
  );
}
