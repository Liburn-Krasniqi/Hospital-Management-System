import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../providers";

const PrivateRoute = () => {
  // Use for routes only accesible for logged in users
  const user = useAuth();
  if (!user.token) return <Navigate to="/login" />; // In case user is not logged in
  return <Outlet />; // If user is logged in display contents
};

export default PrivateRoute;
