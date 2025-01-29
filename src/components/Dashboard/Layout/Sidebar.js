"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavItems } from "@/utils/navigation-item";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-72 shadow-xl transform transition-transform lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <span className="text-lg font-bold">Admin Panel</span>
        <button
          className="lg:hidden p-2 w-4 h-4"
          onClick={toggleSidebar}
          aria-label="Close Sidebar"
        >
          <i className=" fa-solid fa-bars"></i>
        </button>
      </div>
      <nav className="mt-4 space-y-2 px-4">
        {getNavItems().map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex flex-row gap-3 px-4 py-2 rounded-lg ${
              pathname === item.path
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={toggleSidebar} // Close sidebar after selecting (mobile)
          >
            {item?.icon} {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
