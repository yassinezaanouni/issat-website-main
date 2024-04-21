"use client";

import InputFloatingLabel from "@/components/ui/InputFloatingLabel";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Datepicker from "react-tailwindcss-datepicker";
import UseGetMe from "@/app/hooks/UseGetMe";

function page() {
  const createStudent = useMutation(api.users.createStudent);
  const departments = useQuery(api.groups.getDepartments);
  const fillieres = useQuery(api.groups.getfillieres);
  // const groups = useQuery(api.groups.getGroups);
  const { user } = UseGetMe();

  const router = useRouter();
  const { toast } = useToast();
  const [birthDate, setBirthDate] = React.useState<Date>();
  const [gender, setGender] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [selectedDepartmentId, setSelectedDepartmentId] =
    React.useState<string>("");
  const [selectedfilliereId, setSelectedfilliereId] =
    React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!city) return setError("Veuillez entrer votre ville");
    if (!address) return setError("Veuillez entrer votre adresse");
    if (!phone || phone.length != 8)
      return setError("Veuillez entrer un numéro de téléphone valide");
    if (!gender) return setError("Veuillez entrer votre genre");
    if (!birthDate) return setError("Veuillez entrer votre date de naissance");
    if (!selectedDepartmentId) return setError("Veuillez choisir un groupe");
    setError("");
    try {
      await createStudent({
        address,
        phone,
        gender,
        birthDate: birthDate.toISOString(),
        city,
        departmentId: selectedDepartmentId,
        filliereId: selectedfilliereId,
      });
      toast({
        title: "Succès",
        description: "Votre compte a été créé avec succès",
        variant: "success",
      });
      router.push("/");
    } catch (e) {
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de la création de votre compte",
        variant: "destructive",
      });
    }
  };

  if (user?.type) {
    router.push("/");
    return null;
  }

  return (
    <section className="container flex min-h-[80vh] items-center justify-center">
      {!user ? (
        <Spinner />
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center justify-center overflow-hidden py-40"
        >
          <div className="relative size-20 rounded-full">
            <Image
              src={user?.pictureUrl}
              alt="profile photo"
              className="rounded-full"
              fill
            />
          </div>
          <p className="mt-2 h-2 text-sm text-primary">{user.fullName}</p>
          <div className="mt-8 flex max-w-[40rem] flex-wrap items-center justify-center gap-6 ">
            <Input
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ville"
              name="ville"
              required
              className="w-full min-w-[10rem] max-w-[45%]"
            />
            <Input
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Adresse"
              name="address"
              required
              className="w-full min-w-[10rem] max-w-[45%]"
            />
            <Input
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              placeholder="Téléphone"
              name="phone"
              type="number"
              required
              className="w-full min-w-[10rem] max-w-[45%]"
            />
            <div className="w-full min-w-[10rem] max-w-[45%]">
              <Select required onValueChange={(value) => setGender(value)}>
                <SelectTrigger className=" w-full">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Mr</SelectItem>
                  <SelectItem value="female">Mme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              type="date"
              placeholder="Enter BirthDate"
              onChange={(e) =>
                e.target.value && setBirthDate(new Date(e.target.value))
              }
              name="birthdate"
              max={new Date().toISOString().split("T")[0]}
              className="w-full min-w-[10rem] max-w-[45%]  "
            />

            <div className="w-full min-w-[10rem] max-w-[45%]">
              <Select onValueChange={(value) => setSelectedDepartmentId(value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Departements" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((department) => (
                    <SelectItem key={department._id} value={department._id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full min-w-[10rem] max-w-[45%]">
              {/* filliere */}
              {selectedDepartmentId && (
                <Select onValueChange={(value) => setSelectedfilliereId(value)}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Fillieres" />
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
            </div>
          </div>
          <div className=" flex flex-1 flex-col items-center justify-center gap-6 ">
            {<p className="text-sm text-red-500">{error}</p>}
            <Button className="w-40 max-w-full rounded-md bg-primary py-4 text-background">
              S'inscrire
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

export default page;
