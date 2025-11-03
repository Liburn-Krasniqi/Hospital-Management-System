import { AuthProvider } from "../providers";

export function AppProvider({ children }) {
  // Add any providers you need here (Theme, Auth, etc.)
  return <AuthProvider>{children}</AuthProvider>;
}
