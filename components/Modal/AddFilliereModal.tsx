"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Modal from "./Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "../ui/use-toast";

type ModalProps = {
  title: string;
  setIsAddFilliereModalOpen: (value: boolean) => void;
  selectedFilliere?: any;
};
export function AddFilliereModal({
  title,
  setIsAddFilliereModalOpen,
  selectedFilliere,
}: ModalProps) {
  const createFilliere = useMutation(api.groups.createFilliere);
  const updateFilliere = useMutation(api.groups.updateFilliere);
  const departments = useQuery(api.groups.getDepartments);

  const [name, setName] = useState(selectedFilliere?.name);
  const [description, setDescription] = useState(selectedFilliere?.description);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    selectedFilliere?.department,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSave = async () => {
    if (!name) return setError("Nom du fillieree est requis");
    if (!description) return setError("Description du fillieree est requis");
    if (!selectedDepartmentId) return setError("Department est requis");
    setIsLoading(true);

    try {
      if (selectedFilliere)
        updateFilliere({
          id: selectedFilliere._id,
          name,
          description,
          department: selectedDepartmentId,
        });
      else
        await createFilliere({
          name,
          description,
          department: selectedDepartmentId,
        });
      setError("");
      toast({
        title: "Fillieree ajouté",
        description: "Le fillieree a été ajouté avec succès",
        variant: "success",
      });
      setIsAddFilliereModalOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <Modal
      title={title}
      setIsModalOpen={setIsAddFilliereModalOpen}
      onSave={onSave}
      isLoading={isLoading}
    >
      <Input
        value={name}
        placeholder="Nom du fillieree"
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        value={description}
        placeholder="Description du fillieree"
        onChange={(e) => setDescription(e.target.value)}
      />

      <Select
        value={selectedDepartmentId}
        onValueChange={(value) => setSelectedDepartmentId(value)}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Departments" />
        </SelectTrigger>
        <SelectContent>
          {departments?.map((department) => (
            <SelectItem key={department._id} value={department._id}>
              {department.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="-mt-2 text-sm text-destructive">{error}</p>}
    </Modal>
  );
}
