"use client";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import ProfsTable from "./compoments/ProfsTable";

function page() {
  const profs = useQuery(api.profs.getProfs);

  return (
    <div>
      <ProfsTable profs={profs} />
    </div>
  );
}

export default page;
