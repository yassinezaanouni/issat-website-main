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
import { Delete, Eye, Plus, Trash, Trash2, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import UseGetMe from "@/app/hooks/UseGetMe";

type Props = {
  items: any[] | undefined;
};
export default function MatieresTable({ items }: Props) {
  const { user } = UseGetMe();
  const deleteMatiere = useMutation(api.matieres.deleteMatiere);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const onDeleteMatiere = (matiereId: Id<"matieres">, userId: Id<"users">) => {
    let text = "Voulez-vous vraiment supprimer cet matiere ?";
    if (confirm(text)) deleteMatiere({ id: matiereId });
  };

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des matieres</h1>
        {user?.type == "admin" && (
          <Button
            onClick={() => setIsViewModalOpen(true)}
            className="  flex items-center gap-2 rounded-md px-6 py-3"
          >
            <Plus />
            <span>Ajouter un matiere</span>
          </Button>
        )}
      </div>
      {items == undefined ? (
        <Spinner />
      ) : items.length > 0 ? (
        <Table>
          <TableCaption>La liste des matieres.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ordre</TableHead>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Nom </TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{item._id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                {user?.type == "admin" && (
                  <TableCell className="flex items-center">
                    <Button
                      className=""
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <Eye size={20} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteMatiere(item._id, item.user)}
                    >
                      <Trash2 className="text-destructive" size={20} />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <span>Pas de matieres</span>
      )}

      {isViewModalOpen && (
        <ViewModal
          setIsViewModalOpen={setIsViewModalOpen}
          selectedItem={selectedItem}
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
  const profs = useQuery(api.profs.getProfs);
  const addMatiere = useMutation(api.matieres.addMatiere);
  const updateMatiere = useMutation(api.matieres.updateMatiere);
  const [name, setName] = useState(selectedItem?.name);
  const [description, setDescription] = useState(selectedItem?.description);
  const [profId, setProfId] = useState(selectedItem?.profId);

  const onSave = () => {
    if (!name || !description || !profId)
      return alert("Veuillez remplir tous les champs");
    const data = {
      name,
      description,
      profId,
    };
    if (selectedItem)
      updateMatiere({
        id: selectedItem._id,
        ...data,
      });
    else addMatiere(data);

    setIsViewModalOpen(false);
  };
  return (
    <Modal
      title="Ajouter un matiere"
      setIsModalOpen={setIsViewModalOpen}
      onSave={onSave}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium capitalize text-gray-500 dark:text-gray-400">
          Name:
        </span>
        <span className="text-sm">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-medium capitalize text-gray-500 dark:text-gray-400">
          Description:
        </span>
        <span className="text-sm">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-medium capitalize text-gray-500 dark:text-gray-400">
          Prof:
        </span>
        <span className="text-sm">
          <Select
            value={profId ? profId : undefined}
            onValueChange={(value) => setProfId(value)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder={"Selectionner le prof"} />
            </SelectTrigger>
            <SelectContent>
              {profs?.map((item, index) => (
                <SelectItem key={index} value={item._id}>
                  {formatCamelCase(item.fullName)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </div>
    </Modal>
  );
}
