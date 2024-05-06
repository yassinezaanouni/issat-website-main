"use client";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import CoursesTable from "./compoments/CoursesTable";
import UseGetMe from "../hooks/UseGetMe";
import Spinner from "@/components/ui/Spinner";

function page() {
  const { user } = UseGetMe();
  const courses = useQuery(api.courses.getCourses);

  return (
    <div>
      <CoursesTable items={courses} />
    </div>
  );
}

export default page;
