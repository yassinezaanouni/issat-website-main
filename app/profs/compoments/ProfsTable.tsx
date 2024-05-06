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
import { PROF_TYPES } from "@/lib/consts";

type Props = {
  profs: any[] | undefined;
};
export default function ProfsTable({ profs }: Props) {
  const deleteProf = useMutation(api.users.deleteUser);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const onDeleteProf = (profId: Id<"profs">, userId: Id<"users">) => {
    let text = "Voulez-vous vraiment supprimer cet prof ?";
    if (confirm(text)) deleteProf({ idTable1: profId, idTable2: userId });
  };

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des profs</h1>
        <Button
          onClick={() => setIsViewModalOpen(true)}
          className="  flex items-center gap-2 rounded-md px-6 py-3"
        >
          <Plus />
          <span>Ajouter un prof</span>
        </Button>
      </div>
      {profs == undefined ? (
        <Spinner />
      ) : profs.length > 0 ? (
        <Table>
          <TableCaption>La liste des profs.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ordre</TableHead>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Nom </TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profs.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{item._id}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.email}</TableCell>
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
                    onClick={() => onDeleteProf(item._id, item.user)}
                  >
                    <Trash2 className="text-destructive" size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <span>Pas de profs</span>
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
  const addProf = useMutation(api.profs.addProf);
  const updateProf = useMutation(api.profs.updateProf);
  const [email, setEmail] = useState(selectedItem?.email);
  const [name, setName] = useState(selectedItem?.fullName);
  const [type, setType] = useState(selectedItem?.type);

  const onSave = () => {
    if (!email || !type) return alert("Veuillez remplir tous les champs");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return alert("Email non valide");
    if (selectedItem)
      updateProf({
        id: selectedItem._id,
        email,
        type,
      });
    else
      addProf({
        email,
        type,
      });

    setIsViewModalOpen(false);
  };
  return (
    <Modal
      title="Ajouter un prof"
      setIsModalOpen={setIsViewModalOpen}
      onSave={onSave}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium capitalize text-gray-500 dark:text-gray-400">
          Email:
        </span>
        <span className="text-sm">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-medium capitalize text-gray-500 dark:text-gray-400">
          Type:
        </span>
        <span className="text-sm">
          <Select
            value={type ? type : undefined}
            onValueChange={(value) => setType(value)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder={"Selectionner le type"} />
            </SelectTrigger>
            <SelectContent>
              {PROF_TYPES.map((profType, index) => (
                <SelectItem key={index} value={profType}>
                  {formatCamelCase(profType)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </div>
    </Modal>
  );
}
