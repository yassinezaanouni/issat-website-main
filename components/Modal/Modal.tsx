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

type ModalProps = {
  title: string;
  setIsModalOpen: (value: boolean) => void;
  children: React.ReactNode;
  onSave: () => void;
  isLoading?: boolean;
};
function Modal({
  title,
  setIsModalOpen,
  children,
  onSave,
  isLoading,
}: ModalProps) {
  return (
    <div className="absolute inset-0 isolate z-50 flex items-center justify-center">
      <div
        className="absolute -z-10 h-full w-full bg-foreground/50"
        onClick={() => setIsModalOpen(false)}
      />

      <Card className="w-[min(90%,36rem)]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">{children}</CardContent>

        <CardFooter className="gap-4">
          <Button
            disabled={isLoading}
            onClick={() => onSave()}
            className="uppercase"
          >
            Enregistrer
          </Button>
          <Button
            variant={"outline"}
            className="uppercase"
            onClick={() => setIsModalOpen(false)}
          >
            Annuler
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Modal;
