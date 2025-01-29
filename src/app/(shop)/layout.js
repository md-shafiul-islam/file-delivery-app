"use client";
import { useState } from "react";
import ShopNavbar from "../../components/Shop/Layout/ShopNavbar";
const RootLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <ShopNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className={`grid gap-3`}>{children}</main>
    </>
  );
};

export default RootLayout;
