import { Navigate, Outlet, useLocation } from "react-router";

// Protects routes that require authentication
// If user not logged in, redirects to login page
// Outlet: renders child routes if user is authenticated
const ProtectedRoute = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        // Redirect to login, saving where they wanted to go
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // User is logged in, show the protected page
    return <Outlet />;
};

export default ProtectedRoute;
