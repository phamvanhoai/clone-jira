import { Box, Divider, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getProject } from "../../../apis/projectAPI";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Loading from "../../../components/Loading";
import DialogModal from "../../../components/Dialog/DialogModal";
import { useNavigate } from "react-router-dom";

export default function ProjectManagementMobile() {
  const [searchText, setSearchText] = useState(""); // State để lưu giá trị từ ô tìm kiếm
  const [openProjectSetting, setOpenProjectSetting] = useState(false);
  const [projectSetting, setProjectSetting] = useState(null);
  const [isOpenEdit, setIsOpenEdit] = React.useState(false);

  const navigate = useNavigate();

  const { data: projectManagement = [], isLoading } = useQuery({
    queryKey: ["projectManaMobile"],
    queryFn: getProject,
  });

  // Hàm tìm kiếm dựa trên giá trị từ ô tìm kiếm
  const filteredProjects = projectManagement.filter((project) => {
    return project.projectName.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleClickOpenProjectSetting = () => {
    setOpenProjectSetting(true);
  };

  const handleCloseProjectSetting = () => {
    setOpenProjectSetting(false);
    setIsOpenEdit(false);
  };

  React.useEffect(() => {
    // Tìm dự án cụ thể dựa trên ID trong projectManagement
    const selectedProject = projectManagement.find(
      (project) => project.id === projectSetting
    );

    if (selectedProject) {
      // Nếu tìm thấy, cập nhật projectSetting với dự án cụ thể
      setProjectSetting(selectedProject);
    } else {
      // Nếu không tìm thấy, có thể đặt projectSetting thành một giá trị mặc định hoặc thực hiện xử lý khác
    }
  }, [projectManagement, projectSetting]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Box height={10} />
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
      <Box>
        <TextField
          fullWidth
          label="Search Project"
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
        {filteredProjects.map((project) => {
          return (
            <Box
              key={project.id}
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
                  navigate(`/projectDetail/${project.id}`);
                }}
              >
                {project.projectName}
              </Typography>

              <Box
                sx={{
                  borderLeft: "1px solid rgb(209 213 219)",
                  padding: "15px",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => {
                  setProjectSetting(project.id);
                  handleClickOpenProjectSetting();
                  setIsOpenEdit(true);
                }}
              >
                <SettingsOutlinedIcon />
              </Box>
            </Box>
          );
        })}
      </Box>

      <Divider />
      {/* Mở project setting */}
      <DialogModal
        open={openProjectSetting}
        handleClose={handleCloseProjectSetting}
        project={projectSetting}
        setProjectSetting={setProjectSetting}
        projectManagement={projectManagement}
        isOpenEdit={isOpenEdit}
      />
    </>
  );
}
