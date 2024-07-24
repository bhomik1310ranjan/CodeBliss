import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/app/hooks";

function PublicRoute() {
    const location = useLocation();

    const isAuthenticated = useAppSelector(
        (state) => state.auth.isAuthenticated
    );

    const from = location.state?.from?.pathname || "/projects";

    return isAuthenticated ? <Navigate to={from} replace /> : <Outlet />;
}

export default PublicRoute;
