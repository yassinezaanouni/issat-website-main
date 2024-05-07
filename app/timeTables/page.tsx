"use client";
import Spinner from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatCamelCase } from "@/lib/format";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal/Modal";
import UseGetMe from "../hooks/UseGetMe";

const WEEK_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const HOURS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

function page() {
  const { user } = UseGetMe();
  const groups = useQuery(api.groups.getGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<
    Id<"groups"> | undefined
  >();
  const getMyGroup = useQuery(api.groups.getMyGroup);
  useEffect(() => {
    if (user?.type === "student") {
      setSelectedGroupId(getMyGroup?._id);
    }
  }, [user]);

  if (groups == undefined) return <Spinner />;

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emplois du temps</h1>

        {(user?.type == "admin" ||
          user?.type == "prof" ||
          user?.type == "chefProf") && (
          <span>
            <Select
              value={selectedGroupId || undefined}
              onValueChange={(value: any) => setSelectedGroupId(value)}
            >
              <SelectTrigger className="">
                <SelectValue placeholder={"Selectionner le groupe"} />
              </SelectTrigger>
              <SelectContent>
                {groups.map((item, index) => (
                  <SelectItem key={index} value={item._id}>
                    {formatCamelCase(item.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </span>
        )}
      </div>

      {selectedGroupId && (
        <TimeTable
          selectedGroupId={selectedGroupId}
          isStudent={user?.type === "student"}
        />
      )}
    </div>
  );
}

export default page;

function TimeTable({
  selectedGroupId,
  isStudent,
}: {
  selectedGroupId: Id<"groups">;
  isStudent: boolean;
}) {
  const getCreateTimeTable = useMutation(api.timetables.getGroupTimeTable);
  const [timeTable, setTimeTable] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTimeTable = async () => {
      const _timeTable = await getCreateTimeTable({ groupId: selectedGroupId });
      setTimeTable(_timeTable);
    };

    fetchTimeTable();
  }, [selectedGroupId, isModalOpen]);
  if (!timeTable) return <Spinner />;

  return (
    <div>
      {/* loop through the days in the columns and the hours in the days and add button for each row column */}
      <Table>
        <TableCaption>Emploi du temps du groupe</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Heures</TableHead>
            {WEEK_DAYS.map((day) => (
              <TableHead key={day}>{day}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {HOURS.map((hour, i) => (
            <TableRow key={hour}>
              <TableCell>{hour}</TableCell>
              {WEEK_DAYS.map((day, j) => {
                const number = j * HOURS.length + i;
                return (
                  <TableCell key={day}>
                    <AddTimeTableItem
                      item={timeTable}
                      number={number}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      isStudent={isStudent}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AddTimeTableItem({
  item,
  number,
  isModalOpen,
  setIsModalOpen,
  isStudent,
}: {
  item: any;
  number: number;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  isStudent: boolean;
}) {
  const courses = useQuery(api.courses.getCoursesPopulate);
  const addTimeTableItem = useMutation(api.timetables.addTimeTableItem);
  const [timeTableItem, setTimeTableItem] = useState<any>();

  const onSave = () => {
    addTimeTableItem({
      timeTableId: item._id,
      item: timeTableItem,
    });
    setIsModalOpen(false);
  };
  return (
    <div>
      <div>
        <Button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="w-full p-12"
          variant={item?.courses?.[number] || isStudent ? "outline" : "default"}
        >
          {item?.courses?.[number]?.name ? (
            <div className="flex  flex-col items-center gap-2 ">
              <p>{item?.courses?.[number]?.name}</p>
              <p className="">Salle {item?.courses?.[number]?.room.name}</p>
              <p className="mt-2 font-semibold">Yassine Zaanouni</p>
            </div>
          ) : !isStudent ? (
            <p>+</p>
          ) : null}
        </Button>
      </div>

      {isModalOpen && (
        <Modal
          title="Ajouter un cours"
          setIsModalOpen={setIsModalOpen}
          onSave={onSave}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium capitalize text-gray-500 dark:text-gray-400">
              Cours:
            </span>
            <span className="text-sm">
              <Select
                // value={matiereId ? matiereId : undefined}
                onValueChange={(value) => setTimeTableItem(value)}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder={"Selectionner un matiere"} />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map?.((item, index) => (
                    <SelectItem key={index} value={item}>
                      {formatCamelCase(item.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
}
