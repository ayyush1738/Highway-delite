// InputField.tsx
import type { ReactNode } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode; // for passing svg or icons
}

export default function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
}: InputFieldProps) {
  return (
    <div className="relative w-full mb-4">
      {/* Floating label */}
      <label
        htmlFor={id}
        className="absolute -top-2 left-3 bg-white text-gray-500 px-1 text-sm"
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="flex items-center border border-gray-400 rounded-md px-3 py-2">
        {icon && <span className="mr-2 text-gray-500">{icon}</span>}
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-gray-700"
        />
      </div>
    </div>
  );
}
