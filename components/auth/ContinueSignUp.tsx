import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { BookOpenText, User } from "lucide-react";

function ContinueSignUp() {
  return (
    <section className=" flex flex-col items-center justify-center gap-12">
      <h1 className="text-2xl font-bold">
        To continue please select your role
      </h1>
      <div className="flex items-center justify-center gap-8">
        <Link
          className="flex size-40 flex-col items-center justify-center gap-4 rounded-lg border-2 border-input transition-all duration-300 hover:bg-primary hover:text-background"
          href="/sign-up/student"
        >
          <BookOpenText size={48} />
          <span className="text-xl font-semibold">Student</span>
        </Link>
        <Link
          className="flex size-40 flex-col items-center justify-center gap-4 rounded-lg border-2 border-input transition-all duration-300 hover:bg-primary hover:text-background"
          href="/sign-up/teacher"
        >
          <User size={48} />
          <span className="text-xl font-semibold">Teacher</span>
        </Link>
      </div>
    </section>
  );
}

export default ContinueSignUp;
