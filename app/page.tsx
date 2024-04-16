"use client";
import Image from "next/image";
import useStoreUserEffect from "./hooks/UseStoreUser";
import { useConvexAuth, useQuery } from "convex/react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import ContinueSignUp from "@/components/auth/ContinueSignUp";
import { api } from "@/convex/_generated/api";
import Spinner from "@/components/ui/Spinner";
import UseGetMe from "./hooks/UseGetMe";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { Facebook, Phone, Twitter } from "lucide-react";

export default function Home() {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <section className="container relative flex min-h-[70%] items-center gap-10">
          <div className="flex flex-1 flex-col">
            <Image
              src="/logos/issat-logo.png"
              width={400}
              height={400}
              alt="issat"
            />
            <h1 className=" s text-2xl font-bold">
              Bienvenue sur la plateforme de l'ISSAT
            </h1>
            <h2 className="mt-2 opacity-90">
              L'Institut Supérieur des Sciences Appliquées et de Technologie est
              un établissement d'enseignement supérieur public à Soisse,
              Tunisie.
              <br />
              Connectez-vous pour accéder à votre espace personnel.
            </h2>

            <Button size="lg" className=" mt-8 self-start">
              <SignInButton mode="modal">CONNECTER</SignInButton>
            </Button>
          </div>
          <div className=" relative hidden flex-1 justify-end md:flex">
            <Image
              src="/imgs/issat-sign-in.png"
              width={500}
              height={500}
              alt="issat"
            />
            <div className=" absolute -bottom-40 right-0 hidden gap-4 md:flex">
              <Facebook stroke="#056AB1" className="fill-primary" />
              <Twitter stroke="#056AB1" className="fill-primary" />
              <Phone stroke="#056AB1" className="fill-primary" />
            </div>
          </div>
        </section>
      </SignedOut>
    </>
  );
}

function Dashboard() {
  const userId = useStoreUserEffect();
  const { user } = UseGetMe();
  return (
    <section className="container flex min-h-[80vh] items-center justify-center">
      {!user ? (
        <Spinner />
      ) : user?.type ? (
        <div>Dashboard</div>
      ) : (
        <ContinueSignUp />
      )}
    </section>
  );
}
