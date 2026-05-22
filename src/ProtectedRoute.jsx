import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("userToken");

  if (!token) {
    // إذا لا يوجد توكن، اذهب لصفحة اللوجن
    return <Navigate to="/login" />;
  }

  try {
    // فك التشفير للتأكد أن التوكن سليم وليس نصاً عشوائياً
    jwtDecode(token); 
    return children;
  } catch (error) {
    // إذا التوكن تالف، امسحه وحول للمستخدم للوجن
    localStorage.removeItem("userToken");
    return <Navigate to="/login" />;
  }
}