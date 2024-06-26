"use client";
import React, { useEffect, useState } from "react";
import { Eye, Group, Pen, Plus, Trash2 } from "lucide-react";
import { AddFilliereModal } from "@/components/Modal/AddFilliereModal";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
function page() {
  const fillieres = useQuery(api.groups.getfillieres);
  const departments = useQuery(api.groups.getDepartments);
  const [isAddFilliereModalOpen, setIsAddFilliereModalOpen] = useState(false);
  const [filtredItems, setFiltredItems] = useState(fillieres);

  useEffect(() => {
    setFiltredItems(fillieres);
  }, [fillieres]);
  return (
    <section className="h-full">
      {isAddFilliereModalOpen && (
        <AddFilliereModal
          title="Ajouter un filliere"
          setIsAddFilliereModalOpen={setIsAddFilliereModalOpen}
        />
      )}
      <h1 className="mb-10 text-2xl font-bold ">Liste des Fillieres </h1>

      <div className="mb-6 flex items-center gap-6">
        <span className="w-40">
          <Select
            onValueChange={(value) => {
              if (value === "all") setFiltredItems(fillieres);
              else
                setFiltredItems(
                  fillieres?.filter((item) => item.department == value),
                );
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"> Department</SelectItem>
              {departments?.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-10 gap-y-6">
        {filtredItems == undefined ? (
          <Spinner />
        ) : filtredItems.length > 0 ? (
          filtredItems?.map((filliere) => (
            <FilliereCard filliere={filliere} key={filliere._id} />
          ))
        ) : (
          <span>Pas de fillieres</span>
        )}
      </div>
      {/* button with + icon */}
      <Button
        onClick={() => setIsAddFilliereModalOpen(true)}
        className=" mt-10 flex items-center gap-2 rounded-md px-6 py-3"
      >
        <Plus />
        <span>Ajouter un filliere</span>
      </Button>
    </section>
  );
}

export default page;

type Props = {
  filliere: {
    _id: Id<"fillieres">;
    name: string;
    description: string;
    department: Id<"departments">;
  };
};

function FilliereCard({ filliere }: Props) {
  // const filliere = useQuery(api.groups.getFilliereByFilliere, {
  //   filliereId: filliere._id,
  // });
  const onDeleteFilliereMutation = useMutation(api.groups.deleteFilliere);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDeleteFilliere = (id: Id<"fillieres">) => {
    let text = "Voulez-vous vraiment supprimer ce filliere ?";
    if (confirm(text)) onDeleteFilliereMutation({ id });
  };
  return (
    <>
      {isModalOpen && (
        <AddFilliereModal
          selectedFilliere={filliere}
          setIsAddFilliereModalOpen={setIsModalOpen}
          title="Modifier filliere"
        />
      )}
      <Card className="w-[18rem] ">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-base capitalize">
            <div>{filliere.name}</div>
            <div className="flex items-center">
              {/* <Button size="sm" variant="ghost">
                <Link href={`/fillieres/${filliere._id}`} key={filliere._id}>
                  <Eye size={14} />
                </Link>
              </Button> */}

              <Button size="sm" variant="ghost">
                <Pen
                  size={14}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteFilliere(filliere._id)}
              >
                <Trash2 className="text-destructive" size={14} />
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="text-xs capitalize">
            {filliere?.description}
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </>
  );
}
