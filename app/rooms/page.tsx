"use client";
import StudentsTable from "@/components/students/StudentsTable";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import RoomsTable from "./compoments/RoomsTable";

function page() {
  const rooms = useQuery(api.rooms.getRooms);

  return (
    <div>
      <RoomsTable rooms={rooms} />
    </div>
  );
}

export default page;
