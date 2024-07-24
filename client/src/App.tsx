import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "./components/Loader";
import { Toaster } from "@/components/ui/sonner";
import { useProfileQuery } from "./redux/api";
import { signin, signout } from "./redux/slices/authSlice";
import { useAppDispatch } from "./redux/app/hooks";

const Layout = lazy(() => import("./Layout"));
const Home = lazy(() => import("./pages/Home"));
const PublicRoute = lazy(() => import("./components/PublicRoute"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Projects = lazy(() => import("./pages/Projects"));
const Project = lazy(() => import("./pages/Project"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
    const dispatch = useAppDispatch();

    const { data, error, isLoading } = useProfileQuery();

    useEffect(() => {
        if (data) {
            dispatch(signin(data.user));
        } else if (error) {
            dispatch(signout());
        }
    }, [data, error]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route path="" element={<Home />} />
                                <Route element={<PublicRoute />}>
                                    <Route path="signin" element={<Signin />} />
                                    <Route path="signup" element={<Signup />} />
                                </Route>
                                <Route element={<ProtectedRoute />}>
                                    <Route
                                        path="projects"
                                        element={<Projects />}
                                    />
                                    <Route
                                        path="project/:projectId"
                                        element={<Project />}
                                    />
                                </Route>
                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Routes>
                    </Suspense>
                    <Toaster
                        position="bottom-right"
                        visibleToasts={1}
                        duration={4000}
                    />
                </>
            )}
        </>
    );
}

export default App;
