import { LayoutDashboard, FileStack, UsersRound } from "lucide-react";

export const getNavItems = () => [
  { name: "Dashboard", path: "/administrator", icon: <LayoutDashboard /> },
  { name: "Files", path: "/administrator/files", icon: <FileStack /> },
  { name: "Users", path: "/administrator/users", icon: <UsersRound /> },
];
