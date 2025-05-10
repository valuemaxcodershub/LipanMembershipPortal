import React from "react";

type SelectableItem = {
  id: string  | boolean;
  label: string;
  icon?: React.ReactNode;
};

interface SelectableSectionProps {
  options: SelectableItem[];
  multiple?: boolean;
  value: string[] | string | boolean| null;
  renderItem?: (item: SelectableItem, isSelected: boolean) => React.ReactNode;
  onChange: (val: string[] | string | boolean | null) => void;
  allowBooleanToggle?: boolean;
};

const SelectableSection = ({
  options,
  multiple = false,
  value,
  renderItem,
  onChange,
  allowBooleanToggle = false,
}: SelectableSectionProps) => {
     // console.log(value)
  const handleClick = (id: SelectableItem["id"]) => {
    if (allowBooleanToggle && options.length === 2) {
      onChange(id as boolean);
    } else if (multiple) {
      const current = (value as string[]) || [];
      if (current.includes(id as string)) {
        onChange(current.filter((item) => item !== id));
      } else {
        onChange([...current, (id as string)]);
      }
    } else {
      onChange(value === id ? null : id);
    }
  };

  const isSelected = (id: SelectableItem["id"]) => {
    if (allowBooleanToggle && options.length === 2) {
      return id === value;
    }
    return multiple ? (value as string[])?.includes(id as string) : value === id;
  };

  return (
    <div className="flex items-center flex-wrap gap-4">
      {options.map((option, idx) => (
        <div onClick={() => handleClick(option.id)} key={idx}>
          {renderItem ? (
            renderItem(option, isSelected(option.id))
          ) : (
            <button
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                isSelected(option.id)
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              {option.icon && <span className="text-xl">{option.icon}</span>}
              <span>{option.label}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectableSection;
