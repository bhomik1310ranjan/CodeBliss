import { useAppSelector } from "../redux/app/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
    const location = useLocation();

    const isAuthenticated = useAppSelector(
        (state) => state.auth.isAuthenticated
    );

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/signin" state={{ from: location }} replace />
    );
}

export default ProtectedRoute;
