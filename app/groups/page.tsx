"use client";
import React, { useState } from "react";
import { Eye, Group, Pen, Plus, Trash2 } from "lucide-react";
import { AddGroupModal } from "@/components/Modal/AddGroupModal";
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
function page() {
  const groups = useQuery(api.groups.getGroups);
  console.log(groups);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  return (
    <section className="h-full">
      {isAddGroupModalOpen && (
        <AddGroupModal
          title="Ajouter un groupe"
          setIsAddGroupModalOpen={setIsAddGroupModalOpen}
        />
      )}
      <h1 className="mb-10 text-2xl font-bold ">Liste des groupes </h1>
      <div className="mt-4 flex flex-wrap gap-x-10 gap-y-6">
        {groups == undefined ? (
          <Spinner />
        ) : groups.length > 0 ? (
          groups?.map((group) => <GroupCard group={group} key={group._id} />)
        ) : (
          <span>Pas de groupes</span>
        )}
      </div>
      {/* button with + icon */}
      <Button
        onClick={() => setIsAddGroupModalOpen(true)}
        className=" mt-10 flex items-center gap-2 rounded-md px-6 py-3"
      >
        <Plus />
        <span>Ajouter un groupe</span>
      </Button>
    </section>
  );
}

export default page;

type Props = {
  group: {
    _id: Id<"groups">;
    name: string;
    description: string;
    level: number;
  };
};

function GroupCard({ group }: Props) {
  const filliere = useQuery(api.groups.getFilliereByGroup, {
    groupId: group._id,
  });
  const onDeleteGroupMutation = useMutation(api.groups.deleteGroup);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDeleteGroup = (id: Id<"groups">) => {
    let text = "Voulez-vous vraiment supprimer ce groupe ?";
    if (confirm(text)) onDeleteGroupMutation({ id });
  };
  return (
    <>
      {isModalOpen && (
        <AddGroupModal
          selectedGroup={group}
          setIsAddGroupModalOpen={setIsModalOpen}
          title="Modifier Groupe"
        />
      )}
      <Card className="w-[18rem] ">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-base">
            <div>{group.name}</div>
            <div className="flex items-center">
              <Button size="sm" variant="ghost">
                <Link href={`/groups/${group._id}`} key={group._id}>
                  <Eye size={14} />
                </Link>
              </Button>

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
                onClick={() => onDeleteGroup(group._id)}
              >
                <Trash2 className="text-destructive" size={14} />
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="text-xs capitalize">
            {filliere?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Group className="h-4 w-4 opacity-70" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Niveau {group.level}
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
