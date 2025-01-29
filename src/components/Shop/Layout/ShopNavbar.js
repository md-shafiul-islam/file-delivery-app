"use client";
import ToggleThem from "@/components/theme/ToggleThem";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const ShopNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="shadow-lg px-4 py-1 flex flex-row items-center justify-between">
      {/* Desktop Logo / Title */}
      <div className="w-full md:w-11/12 flex flex-row items-center gap-6">
        <div className="md:hidden p-2">
          <div className="flex md:hidden">
            <DropdownMenu open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <i className="text-gray-700 fa-solid fa-bars"></i>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem onClick={() => setIsOpen(false)}>
                  <Link href="/" className="w-full  ">
                    Home
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setIsOpen(false)}>
                  <Link href="/registration" className="w-full">
                    Registration
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setIsOpen(false)}>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="w-7 h-7 lg:flex text-lg font-bold">EBS</div>

        <div className="hidden md:flex  p-4">
          <nav className="flex flex-row gap-2">
            <Link
              href="/"
              className="block text-gray-600 hover:text-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/registration"
              className="block text-gray-600 hover:text-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Registration
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Menu */}

      <ToggleThem />
    </header>
  );
};

export default ShopNavbar;
