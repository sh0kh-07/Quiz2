import { Home, FileQuestion, BadgeDollarSign, Rss } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const navItems = [
        {
            path: "/topic-modules",
            icon: FileQuestion,
            label: "Quiz"
        },
        {
            path: "/payment",
            icon: BadgeDollarSign,
            label: "Arxiv"
        },
        {
            path: "/reklama",
            icon: Rss,
            label: "Reklama"
        }
    ];

    return (
        <div className="
            fixed bottom-4 left-1/2 -translate-x-1/2 z-30
            px-6 py-2 rounded-2xl
            backdrop-blur-xl bg-white/90
            border border-white/30 shadow-2xl
            transition-all duration-300
        ">
            <div className="flex justify-center items-center gap-5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex flex-col items-center justify-center
                            px-2 py-2 rounded-xl
                            transition-all duration-300
                            min-w-[60px]
                            ${isActive
                                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg "
                                : "text-gray-600 hover:bg-gray-100 hover:text-blue-500"
                            }
                        `}
                    >
                        <item.icon className="w-6 h-6 mb-1" />

                    </NavLink>
                ))}
            </div>
        </div>
    );
}