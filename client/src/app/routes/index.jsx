import { Route, Routes } from "react-router";

import { Layout } from "../../components/Layout";
import { Landing, Patients, SignUp, LogIn, Doctors } from "../../features";
import PrivateRoute from "./PrivateRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route element={<PrivateRoute />}>
          <Route path="patients" element={<Patients />} />
          <Route path="doctors" element={<Doctors />} />
        </Route>
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<LogIn />} />
      </Route>
    </Routes>
  );
}
