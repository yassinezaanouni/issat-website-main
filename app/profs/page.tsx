"use client";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import ProfsTable from "./compoments/ProfsTable";

function page() {
  const profs = useQuery(api.profs.getProfs);
  const users = useQuery(api.users.getUsers);

  const profsUsers = profs?.map((prof) => {
    const user = users?.find((user) => user._id === prof.user);

    return {
      ...prof,
      email: user?.email,
      fullName: user?.fullName,
    };
  });

  return (
    <div>
      <ProfsTable profs={profsUsers} />
    </div>
  );
}

export default page;
