import React from "react";
import MuiAlert from "@mui/material/Alert";

export const AlertJira = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

export const AlertJiraFilled = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AlertJiraOutlined = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="outlined" {...props} />;
});
