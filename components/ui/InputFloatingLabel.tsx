import { cn } from "@/lib/utils";
import React, { useId } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  As?: "input" | "textarea";
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number";
  className?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}
const InputFloatingLabel = ({
  As = "input",
  label,
  name,
  type = "text",
  className,
  onChange,
  ...props
}: Props) => {
  const id = useId();

  return (
    <div className={cn("relative", className)}>
      <input
        name={name}
        type={type}
        id={id}
        className="focus:border-bg-400 peer block w-full resize-none appearance-none border-0 border-b-2 border-input bg-transparent px-0 py-2 font-medium focus:outline-none focus:ring-0"
        placeholder=""
        onChange={onChange}
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute top-3 -z-10 origin-[0] -translate-y-5 scale-75 transform text-sm text-slate-700 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:opacity-50"
      >
        {label}
      </label>

      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          transition: background-color 5000000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default InputFloatingLabel;
