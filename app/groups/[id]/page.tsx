"use client";
import Spinner from "@/components/ui/Spinner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Delete, Eye, Trash, Trash2, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { formatCamelCase } from "@/lib/format";
import { Id } from "@/convex/_generated/dataModel";
import StudentsTable from "@/components/students/StudentsTable";

export default function page({ params }: { params: { id: string } }) {
  const students = useQuery(api.users.getStudentsGroup, {
    groupId: params.id,
  });
  const deleteStudent = useMutation(api.users.deleteUser);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const onDeleteStudent = (idTable1: Id<"students">, idTable2: Id<"users">) => {
    let text = "Voulez-vous vraiment supprimer cet étudiant ?";
    if (confirm(text)) deleteStudent({ idTable1, idTable2 });
  };

  return (
    <div>
      <StudentsTable students={students} />
    </div>
  );
}

type ViewModalProps = {
  setIsViewModalOpen: (value: boolean) => void;
  selectedItem: any;
};

function ViewModal({ setIsViewModalOpen, selectedItem }: ViewModalProps) {
  const fieldsToNotShow = [
    "_id",
    "type",
    "pictureUrl",
    "tokenIdentifier",
    "user",
    "group",
  ];
  return (
    <Modal
      title="View Student"
      setIsModalOpen={setIsViewModalOpen}
      onSave={() => setIsViewModalOpen(false)}
    >
      {/* map through all the object */}
      {Object.entries(selectedItem).map(([key, value]) => {
        if (fieldsToNotShow.includes(key)) return null;
        return (
          <div className="flex items-center justify-between">
            <span className="font-medium capitalize text-gray-500 dark:text-gray-400">
              {formatCamelCase(key)}:
            </span>
            <span className="text-sm">
              {key == "_creationTime"
                ? typeof value === "string" || typeof value === "number"
                  ? new Date(value).toLocaleDateString()
                  : ""
                : String(value)}
            </span>
          </div>
        );
      })}
    </Modal>
  );
}
