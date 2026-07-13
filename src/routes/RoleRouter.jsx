import { Navigate } from "react-router-dom";

export default function RoleRouter({ user, children, role }) {
  if (!user) return <Navigate to="/login" />;

  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
