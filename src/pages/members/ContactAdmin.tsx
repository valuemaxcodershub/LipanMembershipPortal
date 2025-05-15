import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FileDropzone } from "../../components/UI/FiledropZone";
import {
  contactAdminSchema,
  ContactAdminSchemaType,
  contactAttachmentformats,
} from "../../schemas/mainauth";
import { useState } from "react";
import { PageMeta } from "../../utils/app/pageMetaValues";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/api/errors";

export default function ContactAdminsPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    trigger,
    clearErrors,
  } = useForm({
    resolver: yupResolver(contactAdminSchema),
  });

  const onSubmit = async (formdata: ContactAdminSchemaType) => {
    console.log("Form Submitted:", formdata);
    const toastUpdateOptions = {
      isLoading: false,
      autoClose: 5000,
    };
    const toastId = toast.loading("Sending Message....", {
      position: "top-center",
    });
    const formData = new FormData();
    Object.entries(formdata).forEach(([key, value]) => {
      if (key === "attachment" && value) {
        console.log(value);
        formData.append(key, value[0]);
      } else {
        formData.append(key, value as string);
      }
    });
    try {
      const { data } = await axios.post("/contact-admin/", formData);
      console.log("Response:", data);
      reset();
      setPreviewFiles([]);
      toast.update(toastId, {
        ...toastUpdateOptions,
        render: data?.detail || "Message sent successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Error:", err);
      const message = errorHandler(err);
      const errorMessage = message || "An unexpected error occurred";
      toast.update(toastId, {
        ...toastUpdateOptions,
        render: errorMessage,
        type: "error",
      });
    }
  };

  const [previewFiles, setPreviewFiles] = useState<any[]>([]);

  return (
    <>
      <PageMeta>
        <title>Contact Admin | LIPAN</title>
        <meta
          name="description"
          content="Reach out to the admin team for support or inquiries."
        />
      </PageMeta>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Contact Admin for Support</h1>

        {/* Guidance Section */}
        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-white">
            How to Structure Your Message
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            To ensure your message is effective, please include the following
            details:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-2">
            <li>
              A clear and concise subject line summarizing your issue or
              inquiry.
            </li>
            <li>
              A detailed description of your request, including any relevant
              context or examples.
            </li>
            <li>
              If applicable, include steps to reproduce the issue or screenshots
              for clarity.
            </li>
          </ul>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
            <strong>Note:</strong> If you wish to send multiple files, please
            compress them into a single zipped file before attaching.
          </p>
        </div>

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
                "Max size: 10MB, formats: jpg, png, pdf, zip, docx"
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
                  console.log(files);
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
            {errors.attachment && (
              <p className="text-sm text-red-500 my-2">
                {errors.attachment?.message}
              </p>
            )}
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
          </div>
        </form>
      </div>
    </>
  );
}
