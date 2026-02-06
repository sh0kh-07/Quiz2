import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminHeader from "../Components/UI/Header/AdminHeader";
import Sidebar from "../Components/UI/Sidebar/Sidebar";

export default function AdminLayout() {
    const [active, setActive] = useState(true);

    return (
        <div className="flex w-full overflow-hidden bg-[#f2f2f2] relative">
            <Sidebar open={active} onClose={() => setActive(false)} />
            <div
                className={`mt-[80px] pb-[30px] px-[15px] min-h-screen transition-all duration-300`}
                style={{
                    marginLeft: !active ? "230px" : "110px",
                    width: !active ? "calc(100% - 230px)" : "100%",
                }}
            >
                <AdminHeader active={() => setActive(!active)} sidebarOpen={!active} />
                <Outlet />
            </div>
        </div>
    );
}
