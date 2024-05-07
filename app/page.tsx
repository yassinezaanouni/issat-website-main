"use client";
import Image from "next/image";
import useStoreUserEffect from "./hooks/UseStoreUser";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
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
import { Facebook, Phone, Plus, Trash2, Twitter } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import Modal from "@/components/Modal/Modal";
import Link from "next/link";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
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
    <section className=" flex min-h-[80vh] ">
      {!user ? (
        <Spinner />
      ) : user?.type ? (
        <Actualites user={user} />
      ) : (
        <ContinueSignUp />
      )}
    </section>
  );
}

function Actualites({ user }) {
  const addActualite = useMutation(api.actualites.createActualite);
  const actualites = useQuery(api.actualites.getActualites);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editorRef = useRef(null);

  const deleteActualite = useMutation(api.actualites.deleteActualite);

  const onDeleteActualite = (id: Id<"actualites">) => {
    let text = "Voulez-vous vraiment supprimer cette actualite ?";
    if (confirm(text)) deleteActualite({ id });
  };

  return (
    <div className="w-full">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des Actualites </h1>

        {user?.type === "admin" && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="  flex items-center gap-2 rounded-md px-6 py-3"
          >
            <Plus />
            <span>Ajouter une Actualite</span>
          </Button>
        )}
      </div>

      <div>
        {actualites === undefined ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {actualites.map((actualite) => (
              <div
                key={actualite._id}
                className="relative rounded-md bg-background p-10 shadow-xl"
              >
                {user?.type === "admin" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteActualite(actualite._id)}
                    className="absolute right-10 top-10"
                  >
                    <Trash2 className="text-destructive" size={28} />
                  </Button>
                )}
                <div
                  className="text-lg font-semibold"
                  dangerouslySetInnerHTML={{ __html: actualite.content }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          title="Ajouter une Actualite"
          setIsModalOpen={setIsModalOpen}
          onSave={() => {
            addActualite({
              content: editorRef.current.getContent(),
            });
            setIsModalOpen(false);
          }}
          className="w-[min(90%,96rem)]"
        >
          <Editor
            onInit={(_evt, editor) => (editorRef.current = editor)}
            apiKey="13qkmwyi6q9udtnvw6s6jlnyf8rcp7xhjm4slo4af50w17ew"
            init={{
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
              tinycomments_mode: "embedded",
              tinycomments_author: "Author name",
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() =>
                  Promise.reject("See docs to implement AI Assistant"),
                ),
            }}
            initialValue="Welcome to TinyMCE!"
          />
        </Modal>
      )}
    </div>
  );
}
