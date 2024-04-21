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

type Props = {
  rooms: any[] | undefined;
};
export default function RoomsTable({ rooms }: Props) {
  const deleteRoom = useMutation(api.rooms.deleteRoom);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const onDeleteRoom = (roomId: Id<"rooms">) => {
    let text = "Voulez-vous vraiment supprimer cet étudiant ?";
    if (confirm(text)) deleteRoom({ id: roomId });
  };

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des salles</h1>
        <Button
          onClick={() => setIsViewModalOpen(true)}
          className="  flex items-center gap-2 rounded-md px-6 py-3"
        >
          <Plus />
          <span>Ajouter une salle</span>
        </Button>
      </div>
      {rooms == undefined ? (
        <Spinner />
      ) : rooms.length > 0 ? (
        <Table>
          <TableCaption>A list of rooms.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ordre</TableHead>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Nom </TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room, index) => (
              <TableRow key={room._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{room._id}</TableCell>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.description}</TableCell>
                <TableCell className="flex items-center">
                  <Button
                    className=""
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedRoom(room);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <Eye size={20} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteRoom(room._id)}
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
          selectedItem={selectedRoom}
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
  const createRoom = useMutation(api.rooms.createRoom);
  const updateRoom = useMutation(api.rooms.updateRoom);
  const [name, setName] = useState(selectedItem?.name);
  const [description, setDescription] = useState(selectedItem?.description);

  const onSave = () => {
    if (!selectedItem)
      createRoom({
        name: name,
        description: description,
      });
    else
      updateRoom({
        id: selectedItem._id,
        name: name,
        description: description,
      });
    setIsViewModalOpen(false);
  };
  return (
    <Modal
      title="View Room"
      setIsModalOpen={setIsViewModalOpen}
      onSave={onSave}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium capitalize text-gray-500 dark:text-gray-400">
          Nom:
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
    </Modal>
  );
}
