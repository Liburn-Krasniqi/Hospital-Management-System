import { Route, Routes } from "react-router";

import { Layout } from "../../components/Layout";
import {
  Landing,
  Patients,
  SignUp,
  LogIn,
  Doctors,
  Appointments,
  BookAppointment,
  AppointmentRequestSuccess,
  DoctorAppointmentRequests,
  DoctorAppointments,
} from "../../features";
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
        <Route path="appointments" element={<Appointments />} />
        <Route path="appointments/book/:doctorId" element={<BookAppointment />} />
        <Route path="appointments/book/:doctorId/success" element={<AppointmentRequestSuccess />} />
        <Route path="doctor/requests" element={<DoctorAppointmentRequests />} />
        <Route path="doctor/appointments" element={<DoctorAppointments />} />
        <Route path="login" element={<LogIn />} />
      </Route>
    </Routes>
  );
}
