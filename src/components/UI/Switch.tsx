import React, { useState, useEffect, useId } from "react";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
  name?: string;
  color?: "blue" | "green" | "red" | "indigo" | "purple";
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-600 peer-checked:bg-blue-600",
  green: "bg-green-600 peer-checked:bg-green-600",
  red: "bg-red-600 peer-checked:bg-red-600",
  indigo: "bg-indigo-600 peer-checked:bg-indigo-600",
  purple: "bg-purple-600 peer-checked:bg-purple-600",
};


const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  id,
  className = "",
  name,
  color = "blue",
}) => {
  const generatedId = useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = typeof checked === "boolean";
  const isChecked = isControlled ? checked : internalChecked;

  useEffect(() => {
    if (isControlled && typeof checked === "boolean") {
      setInternalChecked(checked);
    }
  }, [checked]);

  const toggle = () => {
    if (disabled) return;
    const newChecked = !isChecked;
    if (!isControlled) setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  const baseId = id || generatedId;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={toggle}
        name={name}
        id={baseId}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out 
          ${disabled ? "bg-gray-300/30" : !isChecked ? "bg-gray-300 dark:bg-gray-500" : colorMap[color]}
        `}
      >
        <span
          className={`absolute top-0.5 left-0.5 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
            isChecked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      {label && (
        <label
          htmlFor={baseId}
          className={`text-sm font-medium ${
            disabled
              ? "text-gray-400 dark:text-gray-500"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};


export default Switch;