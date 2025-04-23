import { useState, DragEvent, ChangeEvent } from "react";
import { HiUpload } from "react-icons/hi";
import { Label, FileInput } from "flowbite-react";

interface FileDropzoneProps {
  label?: string;
  dropzoneMessage?: string;
  subtext?: string;
  multiple?: boolean;
  onFilesSelected: (files: FileList | File[] | null) => void;
  className?: string;
   accept?: string;
};

export const FileDropzone = ({
  label,
  dropzoneMessage = "Click to upload or drag and drop",
  subtext = "SVG, PNG, JPG or GIF (MAX. 800x400px)",
  multiple = false,
  onFilesSelected,
  className = "",
  accept = "*/*",
}: FileDropzoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(multiple ? e.dataTransfer.files : [e.dataTransfer.files[0]]);
      e.dataTransfer.clearData(); // Clear the drag data after drop
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFilesSelected(e.target.files);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <Label value={label}/>
      )}
      <div className="flex w-full items-center justify-center">
        <Label
          htmlFor="dropzone-file"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed 
            ${dragActive ? "border-blue-400 bg-blue-50 dark:bg-gray-600" : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700"} 
            hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${className}`}
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <HiUpload className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">
              <span className="font-semibold">
                {dropzoneMessage.split(" ")[0]}
              </span>{" "}
              {dropzoneMessage.split(" ").slice(1).join(" ")}
            </p>
            {subtext && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtext}
              </p>
            )}
          </div>
          <FileInput
            id="dropzone-file"
            multiple={multiple}
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
          />
        </Label>
      </div>
    </div>
  );
};
