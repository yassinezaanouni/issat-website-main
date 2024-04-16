"use client";
import React from "react";
import Logo from "./ui/Logo";
import { UserButton } from "@clerk/nextjs";
import UseGetMe from "@/app/hooks/UseGetMe";

function Header() {
  const { user } = UseGetMe();
  return (
    <div className="bg-primary">
      <header className=" flex items-center justify-between p-6 text-background">
        <Logo />
        <div className="flex flex-col items-center uppercase">
          <p className="font-bold">{user?.fullName}</p>
          <p>{user?.type}</p>
        </div>
        <UserButton />
      </header>
    </div>
  );
}

export default Header;
