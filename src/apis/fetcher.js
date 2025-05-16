import axios from "axios";

const fetcher = axios.create({
  baseURL: "https://jiranew.cybersoft.edu.vn/api",
  headers: {
    TokenCybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OSIsIkhldEhhblN0cmluZyI6IjAzLzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1Njg1NzYwMDAwMCIsIm5iZiI6MTcyOTcwMjgwMCwiZXhwIjoxNzU3MDA1MjAwfQ.nPo29RkxTkE_C16RhJnxw90M3v3cu3Ur91a47F5epxA",
  },
});

fetcher.interceptors.request.use((request) => {
  //Kiểm tra user đã đăng nhập hay chưa để thêm token của user vào headers
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (user) {
    request.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return request;
});

//response interceptors
fetcher.interceptors.response.use(
  (response) => {
    // có thể thay đổi response trước khi trả về
    return response;
  },
  (error) => {
    // kiểm tra nếu lỗi là 401 => token không hợp lệ => đăng xuất
    if (error.response.status === 401) {
      localStorage.removeItem("currentUser");
      window.location.replace("/sign-in");
    }
    return Promise.reject(error);
  }
);

export default fetcher;
