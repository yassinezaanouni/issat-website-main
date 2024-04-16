"use client";
import React, { useState } from "react";
import { Group, Plus } from "lucide-react";
import { AddGroupModal } from "@/components/Modal/AddGroupModal";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
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
function page() {
  const groups = useQuery(api.groups.getGroups);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  return (
    <section className="h-full">
      {isAddGroupModalOpen && (
        <AddGroupModal
          title="Ajouter un groupe"
          setIsAddGroupModalOpen={setIsAddGroupModalOpen}
        />
      )}
      <h1 className=" text-lg font-semibold uppercase">Listes des groupes:</h1>
      <div className="mt-4 flex flex-wrap gap-x-10 gap-y-6">
        {groups == undefined ? (
          <Spinner />
        ) : groups.length > 0 ? (
          groups?.map((group) => (
            <Link href={`/groups/${group._id}`}>
              <Card className="w-60 cursor-pointer transition-all hover:scale-[1.02]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">{group.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {group.description}
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
            </Link>
          ))
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
