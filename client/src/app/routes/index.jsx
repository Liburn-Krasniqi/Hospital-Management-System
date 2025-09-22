import { Route, Routes } from "react-router";

import { Layout } from "../../components/Layout";
import { Landing } from "../../features";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Landing/>} />
      </Route>
    </Routes>
  );
}
