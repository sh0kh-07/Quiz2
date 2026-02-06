import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import AdminLayout from "./layouts/AdminLayout";
import { AdminRoutes } from "./Routes/AdminRoutes";
import Login from "./Components/Login";
import MainLayout from "./layouts/MainLayout";
import { Rout } from "./Routes/Routes";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route element={<AdminLayout />}>
            {AdminRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          </Route>
          <Route element={<MainLayout />}>
            {Rout.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          </Route>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
