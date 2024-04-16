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
import { UserButton } from "@clerk/nextjs";

function page() {
  // const createStudent = useMutation(api.users.createStudent);

  const [birthDate, setBirthDate] = React.useState<Date>();
  const [gender, setGender] = React.useState<string>("");
  const [profilePhoto, setProfilePhoto] = React.useState<Blob | MediaSource>();
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   createStudent({
  //     email,
  //     password,
  //     firstName,
  //     lastName,
  //   });
  // };

  return (
    <section className="container">
      <div className="h-screen">
        <UserButton />
      </div>
      <form
        // onSubmit={onSubmit}
        className="mx-auto flex flex-col items-center justify-center overflow-hidden py-40"
      >
        <div className="relative size-20 rounded-full border-2 border-input">
          {profilePhoto ? (
            <Image
              src={URL.createObjectURL(profilePhoto)}
              alt="profile photo"
              className="rounded-full"
              fill
            />
          ) : (
            <Input
              id="picture"
              type="file"
              className="h-full w-full rounded-full opacity-0"
              accept="image/*"
              onChange={(e) => {
                setProfilePhoto(e?.target?.files?.[0]);
              }}
            />
          )}
        </div>
        <p className="mt-2 h-2 text-sm text-primary">
          {firstName + " " + lastName}
        </p>
        <div className="mt-8 flex max-w-[40rem] flex-wrap items-center justify-center gap-8 ">
          <InputFloatingLabel
            name="last-name"
            label="Nom"
            className="w-full max-w-[260px]"
            onChange={(e) => setLastName(e.target.value)}
          />
          <InputFloatingLabel
            name="first-name"
            label="Prenom"
            className="w-full max-w-[260px]"
            onChange={(e) => setFirstName(e.target.value)}
          />

          <Select onValueChange={(value) => setGender(value)}>
            <SelectTrigger className="w-full max-w-[260px]">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Mr</SelectItem>
              <SelectItem value="female">Mme</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-full max-w-[260px] ">
            <DatePicker
              date={birthDate}
              setDate={(date) => date < new Date() && setBirthDate(date)}
              label="Date de naissance"
            />
          </div>
          <InputFloatingLabel
            name="email"
            label="Email"
            className="w-full max-w-[260px]"
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputFloatingLabel
            name="password"
            label="Mot de passe"
            type="password"
            className="w-full max-w-[260px]"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="mt-4 rounded-md bg-primary px-10 py-2 text-background">
            S'inscrire
          </Button>
        </div>
      </form>
    </section>
  );
}

export default page;
