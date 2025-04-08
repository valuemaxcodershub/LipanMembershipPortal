import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FileDropzone } from "../../components/UI/FiledropZone";
import {
  contactAdminSchema,
  ContactAdminSchemaType,
  contactAttachmentformats,
} from "../../schemas/mainauth";
import { useAuth } from "../../hooks/auth";
import { useState } from "react";

export default function ContactAdminsPage() {
  const { user } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
    clearErrors,
  } = useForm({
    resolver: yupResolver(contactAdminSchema),
    defaultValues: {
      email: user?.email || "fffffffff@hhh.com",
    },
  });

  const onSubmit = (data: ContactAdminSchemaType) => {
    console.log("Form Submitted:", data);
    alert("Form submitted successfully!");
    reset();
  };

  const [previewFiles, setPreviewFiles] = useState<any[]>([]);

  const saveDraft = () => {
    alert("Draft saved locally (simulate save draft)");
  };
  const files = watch("attachment") as FileList;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Forms & Actions</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 bg-white dark:bg-gray-800 shadow p-6 rounded-lg"
      >
        <div>
          <Label htmlFor="subject">Subject</Label>
          <TextInput
            id="subject"
            {...register("subject")}
            placeholder="Enter the subject"
            color={errors.subject ? "failure" : undefined}
            helperText={errors.subject?.message}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <TextInput
            id="email"
            type="email"
            {...register("email")}
            placeholder="Your email address"
            color={errors.email ? "failure" : undefined}
            helperText={errors.email?.message}
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            rows={10}
            {...register("message")}
            placeholder="Write your message..."
            color={errors.message ? "failure" : undefined}
            helperText={errors.message?.message}
          />
        </div>

        <div>
          <FileDropzone
            label="Attach a File"
            subtext={
              //     errors.attachment?.message ||
              "Max size: 2MB, formats: jpg, png, pdf, docx"
            }
            //   className={errors.attachment ? "!border-red-500 !bg-red-400" : ""}
            onFilesSelected={(files) => {
              (async () => {
                clearErrors(["attachment"]);
                setValue("attachment", files as FileList);
                const isValid = await trigger(["attachment"]);
                const items = Array.from(files as File[]).map((file) => ({
                  name: file.name,
                  size: file.size,
                  ok: isValid,
                }));
                console.log(items);
                setPreviewFiles((prev) => [
                  //    ...prev,
                  ...items,
                ]);
                if (!isValid) {
                  setValue("attachment", undefined);
                }
              })();
            }}
            accept={contactAttachmentformats.join(", ")}
          />
          {previewFiles && (
            <ul className="space-y-5">
              {Array.from(previewFiles).map((file, index) => (
                <li
                  key={index}
                  className={`flex items-center relative justify-between border-2 ${file.ok ? "bg-emerald-500/60 border-emerald-600" : "bg-[#ff0000]/40 border-[#ff0000]"} p-2 rounded-md mt-2`}
                >
                  <span className="text-sm text-gray-800 dark:text-white">
                    {file.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {file.size < 1_000_000
                      ? `${Math.floor(file.size / 1_000)} KB`
                      : `${(file.size / 1_000_000).toFixed(2)} MB`}
                  </span>
                  <button
                    type="button"
                    className="absolute -right-1.5 -top-4 text-lg text-gray-900 dark:hover:text-white"
                    onClick={() => {
                      setValue("attachment", undefined);
                      setPreviewFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" color="blue" fullSized>
            Submit
          </Button>
          {/* <Button type="button" color="gray" onClick={saveDraft}>
            Save Draft
          </Button> */}
        </div>
      </form>
    </div>
  );
}
