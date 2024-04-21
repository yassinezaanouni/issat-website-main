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
import { v } from "convex/values";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  students: any[] | undefined;
};
export default function StudentsTable({ students }: Props) {
  const deleteStudent = useMutation(api.users.deleteUser);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const onDeleteStudent = (idTable1: Id<"students">, idTable2: Id<"users">) => {
    let text = "Voulez-vous vraiment supprimer cet étudiant ?";
    if (confirm(text)) deleteStudent({ idTable1, idTable2 });
  };

  return (
    <div>
      {students == undefined ? (
        <Spinner />
      ) : students.length > 0 ? (
        <Table>
          <TableCaption>A list of students.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ordre</TableHead>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Nom Complet</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={student._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{student._id}</TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell className="flex items-center">
                  <Button
                    className=""
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <Eye size={20} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteStudent(student._id, student.user)}
                  >
                    <Trash2 className="text-destructive" size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <span>Pas d'étudiants</span>
      )}

      {isViewModalOpen && (
        <ViewModal
          setIsViewModalOpen={setIsViewModalOpen}
          selectedItem={selectedStudent}
        />
      )}
    </div>
  );
}

type ViewModalProps = {
  setIsViewModalOpen: (value: boolean) => void;
  selectedItem: any;
};

function ViewModal({ setIsViewModalOpen, selectedItem }: ViewModalProps) {
  const filliereGroups = useQuery(api.groups.getFilliereGroups, {
    filliereId: selectedItem.filliereId,
  });

  const updateStudentGroup = useMutation(api.groups.updateStudentGroup);
  const group = useQuery(api.groups.getGroup, {
    groupId: selectedItem?.groupId,
  });

  const [selectedGroupId, setSelectedGroup] = useState<Id<"groups"> | null>(
    group?._id || null,
  );
  const fieldsToNotShow = [
    "_id",
    "type",
    "pictureUrl",
    "tokenIdentifier",
    "user",
    "group",
  ];

  const onSave = () => {
    if (selectedGroupId && selectedItem._id) {
      updateStudentGroup({
        studentId: selectedItem._id,
        groupId: selectedGroupId,
      });
    }
    setIsViewModalOpen(false);
  };
  return (
    <Modal
      title="View Student"
      setIsModalOpen={setIsViewModalOpen}
      onSave={onSave}
    >
      {/* map through all the object */}
      {Object.entries(selectedItem).map(([key, value]) => {
        if (fieldsToNotShow.includes(key)) return null;
        return (
          <div className="flex items-center justify-between" key={key}>
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
      {filliereGroups && filliereGroups?.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="font-medium capitalize text-gray-500 dark:text-gray-400">
            Groupes:
          </span>
          <span className="text-sm">
            <Select
              onValueChange={(value: Id<"groups">) => setSelectedGroup(value)}
            >
              <SelectTrigger className="">
                <SelectValue placeholder={group?.name || "Groupes"} />
              </SelectTrigger>
              <SelectContent>
                {filliereGroups.map((group) => (
                  <SelectItem key={group._id} value={group._id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </span>
        </div>
      )}
    </Modal>
  );
}
