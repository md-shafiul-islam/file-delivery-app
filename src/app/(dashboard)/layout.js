"use client";
import { useState } from "react";
import Sidebar from "@/components/Dashboard/Layout/Sidebar";
import Navbar from "@/components/Dashboard/Layout/Navbar";
const RootLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-full flex flex-col">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden lg:flex w-72">
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          {/* Content Area */}
          <main className={`flex-1 overflow-y-auto p-6`}>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
