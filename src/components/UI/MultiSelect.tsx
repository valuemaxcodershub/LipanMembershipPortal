import React, { useState } from "react";

type MultiSelectProps<T> = {
  options: T[];
  onChange: (selected: T[]) => void;
  labelKey: keyof T;
  valueKey: keyof T;
};

function MultiSelect<T>({
  options,
  onChange,
  labelKey,
  valueKey,
}: MultiSelectProps<T>) {
  const [selected, setSelected] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: T) => {
    const updated = [...selected, item];
    setSelected(updated);
    onChange(updated);
    setIsOpen(false);
  };

  const handleRemove = (item: T) => {
    const updated = selected.filter(
      (i) => i[valueKey] !== item[valueKey]
    );
    setSelected(updated);
    onChange(updated);
  };

  const availableOptions = options.filter(
    (opt) => !selected.some((sel) => sel[valueKey] === opt[valueKey])
  );

  return (
    <div className="relative w-full max-w-md">
      <div
        className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 shadow-sm cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 ? (
          <span className="text-gray-500 dark:text-gray-400">Select options...</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((item, index) => (
              <span
                key={String(item[valueKey]) + index}
                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded flex items-center gap-1"
              >
                {String(item[labelKey])}
                <button
                  type="button"
                  className="text-xs text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-white dark:bg-gray-800 border rounded shadow z-10 max-h-60 overflow-y-auto">
          {availableOptions.length > 0 ? (
            availableOptions.map((item, index) => (
              <li
                key={String(item[valueKey]) + index}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                {String(item[labelKey])}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400">No more options</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default MultiSelect;
