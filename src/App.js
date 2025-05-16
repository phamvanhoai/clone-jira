import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import ProjectManagement from "./modules/ProjectManagement";
import Signup from "./modules/Auth/pages/Signup";
import Signin from "./modules/Auth/pages/Signin";
import UserProvider from "./contexts/UserContext/UserContext";
import ProtectedRoute from "./routers/ProtectedRoute";
import NotFound from "./components/NotFound";
import CreateProject from "./modules/ProjectManagement/CreateProject";
import ProjectDetail from "./modules/ProjectManagement/ProjectDetail";
import Profile from "./modules/Profile";
import UserManagement from "./modules/UserManagement/UserManagement";


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<ProjectManagement />} />
              <Route path="/createProject" element={<CreateProject />} />
              <Route
                path="/projectDetail/:projectId"
                element={<ProjectDetail />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user" element={<UserManagement />} />
            </Route>
          </Route>

          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
