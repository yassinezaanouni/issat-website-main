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
  setIsAddGroupModalOpen: (value: boolean) => void;
  selectedGroup?: any;
};
export function AddGroupModal({
  title,
  setIsAddGroupModalOpen,
  selectedGroup,
}: ModalProps) {
  const createGroup = useMutation(api.groups.createGroup);
  const updateGroup = useMutation(api.groups.updateGroup);
  const departments = useQuery(api.groups.getDepartments);
  const fillieres = useQuery(api.groups.getfillieres);

  const [name, setName] = useState(selectedGroup?.name);
  const [description, setDescription] = useState(selectedGroup?.description);
  const [level, setLevel] = useState(selectedGroup?.level);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    fillieres?.find((q) => q._id == selectedGroup?.filliereId)?.department,
  );
  const [selectedfilliereId, setSelectedfilliereId] = useState(
    selectedGroup?.filliereId,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedDepartmentId(
      fillieres?.find((q) => q._id == selectedGroup?.filliereId)?.department,
    );
  }, [fillieres]);

  const onSave = async () => {
    if (!name) return setError("Nom du groupe est requis");
    if (!description) return setError("Description du groupe est requis");
    if (!level) return setError("Niveau du groupe est requis");
    if (!selectedDepartmentId) return setError("Department est requis");
    if (!selectedfilliereId) return setError("filliere est requis");
    setIsLoading(true);
    try {
      if (selectedGroup)
        updateGroup({
          id: selectedGroup._id,
          name,
          description,
          level,
          filliereId: selectedfilliereId,
        });
      else
        await createGroup({
          name,
          description,
          level,
          filliereId: selectedfilliereId,
        });
      setError("");
      toast({
        title: "Groupe ajouté",
        description: "Le groupe a été ajouté avec succès",
        variant: "success",
      });
      setIsAddGroupModalOpen(false);
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
      setIsModalOpen={setIsAddGroupModalOpen}
      onSave={onSave}
      isLoading={isLoading}
    >
      <Input
        value={name}
        placeholder="Nom du groupe"
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        value={description}
        placeholder="Description du groupe"
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        value={level}
        type="number"
        placeholder="Niveau"
        onChange={(e) => setLevel(parseInt(e.target.value))}
        max={9}
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

      {/* filliere */}
      {selectedDepartmentId && (
        <Select
          value={selectedfilliereId}
          onValueChange={(value) => setSelectedfilliereId(value)}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="fillieres" />
          </SelectTrigger>
          <SelectContent>
            {fillieres
              ?.filter((q) => q.department === selectedDepartmentId)
              .map((filliere) => (
                <SelectItem key={filliere._id} value={filliere._id}>
                  {filliere.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}

      {error && <p className="-mt-2 text-sm text-destructive">{error}</p>}
    </Modal>
  );
}
