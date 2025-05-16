import { Box, Button, Popover, Typography } from "@mui/material";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

export default function PopoverDeleteTask(props) {
  const { anchorEl, handleClose, taskId, handleDeleteTask, taskName } = props;
  const open = Boolean(anchorEl);

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
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 3,
          maxWidth: 320,
          boxShadow:
            "0 20px 30px rgb(0 0 0 / 0.15), 0 0 0 1px rgb(0 0 0 / 0.05)",
          bgcolor: "#fff",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        },
      }}
    >
      <Box>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 600,
            fontSize: 16,
            color: "#1c1c1e",
            mb: 2,
          }}
        >
          <ReportGmailerrorredIcon
            fontSize="small"
            sx={{ color: "#ff3b30" }}
          />
          Are you sure you want to delete{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              color: "#1c1c1e",
              ml: 0.5,
              wordBreak: "break-word",
            }}
          >
            {taskName}
          </Box>
          ?
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="text"
            onClick={handleClose}
            sx={{
              textTransform: "none",
              color: "#6e6e73",
              fontWeight: 500,
              fontSize: 15,
              borderRadius: 10,
              paddingX: 2,
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.05)",
              },
            }}
          >
            No
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleDeleteTask(taskId);
              handleClose();
            }}
            sx={{
              textTransform: "none",
              bgcolor: "#0071e3",
              fontWeight: 600,
              fontSize: 15,
              borderRadius: 10,
              paddingX: 2.5,
              "&:hover": {
                bgcolor: "#005bb5",
              },
              boxShadow:
                "0 4px 14px 0 rgb(0 113 227 / 0.39)",
            }}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}
