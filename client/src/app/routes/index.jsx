import { Route, Routes } from "react-router";

import { Layout } from "../../components/Layout";
import { Landing, Patients } from "../../features";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="patients" element={<Patients />} />
      </Route>
    </Routes>
  );
}
