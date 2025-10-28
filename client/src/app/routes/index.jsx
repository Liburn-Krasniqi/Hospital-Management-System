import { Route, Routes } from "react-router";

import { Layout } from "../../components/Layout";
import { Landing, Patients, SignUp, LogIn } from "../../features";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="patients" element={<Patients />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<LogIn />} />
      </Route>
    </Routes>
  );
}
