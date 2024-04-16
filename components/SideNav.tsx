"use client";
import React, { useState } from "react";
import { Lock, Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/consts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { icons } from "lucide-react";
import UseGetMe from "@/app/hooks/UseGetMe";

function SideNav() {
  const [isOpen, setIsOpen] = useState(true);
  let pathname = usePathname();
  pathname = "/" + pathname.split("/")[1];

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const { user } = UseGetMe();

  return (
    <div className="relative min-w-10 overflow-hidden">
      {isOpen && (
        <div
          className={`relative flex h-full w-44 flex-col gap-8 bg-gray-200 px-6 py-20 font-medium shadow-xl  lg:w-60 lg:text-lg`}
        >
          {!user?.type && (
            <>
              <div className=" absolute inset-0 bg-slate-700/50 blur-3xl"></div>

              <div className="absolute inset-0 flex items-center justify-center gap-2 text-background">
                <Lock size={32} />
              </div>
            </>
          )}
          {NAV_ITEMS.map((item) => {
            const LucideIcon = icons[item.icon as keyof typeof icons];
            if (!item?.access?.includes(user?.type)) return null;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 ${pathname === item.href ? "text-primary" : ""}`}
              >
                <LucideIcon size={24} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      )}

      <button onClick={toggleNav} className="absolute left-6 top-4">
        {isOpen ? <X /> : <Menu />}
      </button>
    </div>
  );
}

export default SideNav;
