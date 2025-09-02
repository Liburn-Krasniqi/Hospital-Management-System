import { Route, Routes } from "react-router";
import Layout from "../../components/Layout/Layout";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> </Route>
    </Routes>
  );
}
