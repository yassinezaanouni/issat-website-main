"use client";
import React from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import MatieresTable from "./compoments/MatieresTable";
import UseGetMe from "../hooks/UseGetMe";

function page() {
  const { user } = UseGetMe();
  const matieres = useQuery(api.matieres.getMatieres);

  return (
    <div>
      <MatieresTable items={matieres} />
    </div>
  );
}

export default page;
