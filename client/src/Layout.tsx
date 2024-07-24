import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function Layout() {
    return (
        <div className="w-full min-h-screen overflow-x-hidden overflow-y-auto font-rubik">
            <Header />
            <Outlet />
        </div>
    );
}

export default Layout;
