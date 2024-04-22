"use client";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import MatieresTable from "./compoments/MatieresTable";
import UseGetMe from "../hooks/UseGetMe";
import Spinner from "@/components/ui/Spinner";

function page() {
  const { user } = UseGetMe();
  const matieres = useQuery(api.matieres.getMatieres);

  // const profMatieres = useQuery(api.matieres.getProfMatieresWithUserId, {
  //   userId: user?._id,
  // });

  // if (profMatieres == undefined) return <Spinner />;

  return (
    <div>
      <MatieresTable items={matieres} />
      {/* <MatieresTable items={user?.type == "admin" ? matieres : profMatieres} /> */}
    </div>
  );
}

export default page;
