"use client";
import StudentsTable from "@/components/students/StudentsTable";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

function page() {
  const students = useQuery(api.users.getAllStudents);

  return (
    <div>
      <StudentsTable students={students} />
    </div>
  );
}

export default page;
