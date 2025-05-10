import {
  Button,
  Card,
  Modal,
  Label,
  Table,
  TextInput,
  Tooltip,
  Badge,
  BadgeProps,
  Tabs,
  TabItem,
  Textarea,
  Progress,
} from "flowbite-react";
import { useState, useEffect } from "react";
import {
  BsCheckAll,
  BsDatabase,
  BsExclamationTriangle,
  BsHourglass,
} from "react-icons/bs";
import {
  FaBoxOpen,
  FaFileDownload,
  FaTrash,
  FaRedo,
  FaPlus,
} from "react-icons/fa";
import axios from "../../config/axios";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { AiFillDelete } from "react-icons/ai";
import { useDownloadFile } from "../../utils/api/download";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FileDropzone } from "../../components/UI/FiledropZone";
import { HiUpload } from "react-icons/hi";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/app/time";
import { UserType } from "../../contexts/createContexts/auth";
import MultiSelect from "../../components/UI/MultiSelect";
type JournalEntry = {
  id: number;
  title: string;
  description: string;
  owner: Omit<UserType, "phone"> & { id: number };
  created_at: string;
  filename: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
  slug: string;
};
const colorMapping: Record<string, BadgeProps["color"]> = {
  approved: "success",
  rejected: "failure",
  pending: "warning",
};

const statusMapping = {
  "0": "",
  "1": "pending",
  "2": "approved",
  "3": "rejected",
};

const newJournalschema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  owner_name: yup.string().default("Admin"),
  tags: yup
    .array()
    .of(yup.number().required("tag is required"))
    .min(1, "At least one tag is required"),
  file: yup.mixed().required("File is required"),
});

const mockData = [
  {
    id: 1,
    title: "My First Journal",
    description: "This is my first journal entry.",
    owner_name: "John Doe",
    created_at: "2025-04-10",
    filename: "sample.pdf",
    status: "pending",
    slug: "file1",
  },
  {
    id: 1,
    title: "My  Journal",
    description: "This is my  journal entry.",
    owner_name: "John Doe",
    created_at: "2025-04-10",
    filename: "image.jpg",
    status: "approved",
    slug: "file2",
  },
  {
    id: 2,
    title: "My Second Journal",
    description: "This is my second journal entry.",
    owner_name: "Jane Smith",
    created_at: "2025-04-09",
    filename: "sample.pdf",
    status: "rejected",
    rejection_reason: "Content not appropriate",
    slug: "file1",
  },
];

export default function ManageJournalsPage() {
  const { downloadFile, progress } = useDownloadFile();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    register,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(newJournalschema),
    defaultValues: {
      file: undefined,
    },
  });

  const uploadedFile = watch("file") as FileList;
  const [journals, setJournals] = useState<JournalEntry[]>([]);

  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(
    null
  );
  const [confirmAction, setConfirmAction] = useState<null | {
    type: "delete" | "approve" | "reject" | "download";
    journal: JournalEntry;
  }>(null);
  const [activeTab, setActiveTab] = useState<keyof typeof statusMapping>("0");
  const [error, setError] = useState("0");
  const [isActionLoading, setActionLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [interests, setInterests] = useState<any[]>([]);

  const fetchJournals = async () => {
    setIsFetching(true);
    setError("");
    try {
      const { data: interestsData } = await axios.get(`/interests/`);
      const response = await axios.get("/admin/resources/", {
        params: { search: "", status: statusMapping[activeTab] },
      });
      console.log(response.data.results);
      setJournals(response.data.results);
      setInterests(
        interestsData.map((int: any) => ({ label: int.name, value: int.id }))
      );
    } catch (error: any) {
      setError(
        `Failed to fetch journals. ${error?.response?.data?.detail || error.message}.`
      );
      console.error("Error fetching journals:", error);
    } finally {
      setIsFetching(false);
    }
  };
  useEffect(() => {
    fetchJournals();
  }, [activeTab]);

  const initializeAction = async (
    type: "delete" | "approve" | "reject" | "download",
    journal: JournalEntry
  ) => {
    setConfirmAction({ type, journal });
    if (type === "reject") {
      setOpenRejectModal(true);
      setRejectionReason("");
    } else if (type === "download") {
      await downloadFile(journal.id, journal.filename.split("/")[3]);
      setTimeout(() => setConfirmAction(null), 7000);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      let response;
      const { id } = confirmAction?.journal;
      if (["approve", "reject"].includes(confirmAction?.type as string)) {
        response = await axios.patch(
          `/journals/${id}/status`,
          { rejection_reason: rejectionReason },
          { params: { action: confirmAction?.type } }
        );
      } else if (confirmAction?.type === "delete") {
        response = await axios.delete(`/admin/resources/${id}/`);
      }
      //refresh page
      setRejectionReason("");
      setConfirmAction(null);
      setOpenRejectModal(false);
      toast.success(response?.data.detail || "Action completed successfully!");
      fetchJournals();
    } catch (err: any) {
      toast.error(err.response.data.detail || "Action failed!");
      console.error("Error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFiles = (files: File[] | FileList | null) => {
    if (files && files.length > 0) {
      setValue("file", files);
    }
  };

  const handleUpload = async (data: any) => {
    const { file, tags, ...otherData } = data;
    const formData = new FormData();
    if (file) {
      formData.append("file", data.file[0]);
    }
    tags.forEach((tag: any) => {
      formData.append("tags", tag);
    });
    Object.entries(otherData).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    try {
      await axios.post("/admin/resources/", formData);
      setUploadModalOpen(false);
      toast.success("Journal uploaded successfully!");
      reset();
      fetchJournals();
    } catch (error: any) {
      console.error(error);
      toast.error(
        `Failed to upload journal. ${error.response.data.detail || error.message} `
      );
    }
  };

  return (
    <div className="mx-auto p-4 text-gray-800 dark:text-gray-100">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
        <h1 className="mb-6 text-3xl font-bold">Approve Member Journals</h1>
        <div className="flex items-center gap-3">
          <Tooltip content="Refresh" placement="right">
            <Button
              color="gray"
              pill
              className="!w-fit"
              onClick={fetchJournals}
            >
              <FaRedo className="text-blue-600" />
            </Button>
          </Tooltip>
          <Button color="blue" onClick={() => setUploadModalOpen(true)}>
            <FaPlus className="mr-2 h-6" /> Upload New Journal
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Tabs
          aria-label="Full width tabs"
          style="fullWidth"
          onActiveTabChange={(tab) =>
            setActiveTab(String(tab) as keyof typeof statusMapping)
          }
        >
          <TabItem active title="All" icon={BsDatabase}></TabItem>
          <TabItem title="Pending" icon={BsHourglass}></TabItem>
          <TabItem title="Approved" icon={BsCheckAll}></TabItem>
          <TabItem title="Rejected" icon={BsExclamationTriangle}></TabItem>
        </Tabs>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <Table hoverable>
          <Table.Head className="bg-gray-100 dark:bg-gray-700">
            <Table.HeadCell>Member Name</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Upload Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            {(statusMapping[activeTab] === "" ||
              statusMapping[activeTab] === "rejected") && (
              <Table.HeadCell>Rejection Reason</Table.HeadCell>
            )}
            <Table.HeadCell className="text-center">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white dark:bg-gray-800">
            {isFetching ? (
              <Table.Row>
                <Table.Cell
                  colSpan={
                    statusMapping[activeTab] === "" ||
                    statusMapping[activeTab] === "rejected"
                      ? 6
                      : 5
                  }
                  className="bg-white text-center dark:bg-gray-800 border-b dark:border-gray-700 py-6"
                >
                  <div className="flex justify-center">
                    <div className="animate-spin size-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Loading journals...
                  </p>
                </Table.Cell>
              </Table.Row>
            ) : error ? (
              <Table.Row>
                <Table.Cell
                  colSpan={
                    statusMapping[activeTab] === "" ||
                    statusMapping[activeTab] === "rejected"
                      ? 6
                      : 5
                  }
                  className="bg-white text-center dark:bg-gray-800 border-b dark:border-gray-700 text-red-500 py-6"
                >
                  {error}
                </Table.Cell>
              </Table.Row>
            ) : journals.length ? (
              journals.map((journal) => (
                <Table.Row key={journal.id}>
                  <Table.Cell>{journal.owner.full_name}</Table.Cell>
                  <Table.Cell>{journal.title}</Table.Cell>
                  <Table.Cell>{formatDate(journal.created_at)}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={colorMapping[journal.status]}
                      className="capitalize w-fit"
                    >
                      {journal.status}
                    </Badge>
                  </Table.Cell>
                  {(statusMapping[activeTab] === "" ||
                    statusMapping[activeTab] === "rejected") && (
                    <Table.Cell>
                      {journal.status === "rejected" &&
                      journal.rejection_reason ? (
                        <Tooltip
                          content={
                            <p className=" max-w-[300px]">
                              {journal.rejection_reason}
                            </p>
                          }
                        >
                          <p className="truncate hover:underline max-w-[170px]">
                            {journal.rejection_reason}
                          </p>
                        </Tooltip>
                      ) : (
                        "-"
                      )}
                    </Table.Cell>
                  )}
                  <Table.Cell className="flex gap-2 justify-center">
                    {journal.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          className="!bg-green-500 !w-fit"
                          onClick={() => initializeAction("approve", journal)}
                        >
                          <BsCheckAll />
                        </Button>
                        <Button
                          size="sm"
                          color="warning"
                          className="!w-fit"
                          onClick={() => initializeAction("reject", journal)}
                        >
                          <BsExclamationTriangle />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="!bg-[#ff0000] !text-white !w-fit"
                        onClick={() => initializeAction("delete", journal)}
                      >
                        <FaTrash />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      color="blue"
                      className="!text-white !w-fit"
                      onClick={() => initializeAction("download", journal)}
                    >
                      <FaFileDownload />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                {" "}
                <Table.Cell
                  colSpan={
                    statusMapping[activeTab] === "" ||
                    statusMapping[activeTab] === "rejected"
                      ? 6
                      : 5
                  }
                  className="text-center text-gray-500 dark:text-gray-400 w-full"
                >
                  <FaBoxOpen className="text-5xl block m-[10px_auto]" />
                  No{" "}
                  {statusMapping[activeTab] === "" ? (
                    "Journals"
                  ) : (
                    <span className="capitalize">
                      {statusMapping[activeTab]} journals
                    </span>
                  )}{" "}
                  found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      <Modal
        show={uploadModalOpen}
        onClose={() => !isSubmitting && setUploadModalOpen(false)}
        size="2xl"
        position="center"
      >
        <Modal.Header>Upload New Journal</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleUpload)} className="space-y-5">
            <div>
              <Label htmlFor="title" value="Journal Title" />
              <TextInput
                disabled={isSubmitting}
                id="title"
                placeholder="Enter title"
                {...register("title")}
                color={errors.title ? "failure" : undefined}
                helperText={errors.title?.message}
              />
            </div>
            <div>
              <Label htmlFor="description" value="Journal Description" />
              <Textarea
                disabled={isSubmitting}
                id="description"
                placeholder="Provide a brief Description / Explanatory of the journal"
                {...register("description")}
                rows={6}
                color={errors.description ? "failure" : undefined}
                helperText={errors.description?.message}
              />
            </div>
            <div>
              <Label value="Add Interest / Category tags to upload" />
              <MultiSelect<any>
                labelKey="label"
                valueKey="value"
                options={interests}
                onChange={(selected) => {
                  const selectedValues = selected.map((item: any) =>
                    Number(item.value)
                  );
                  setValue("tags", selectedValues);
                }}
              />
              {errors.tags && (
                <p className="text-sm text-red-500">{errors.tags.message}</p>
              )}
            </div>
            <FileDropzone label="Select Upload" onFilesSelected={handleFiles} />
            {uploadedFile && Array.from(uploadedFile).length > 0 && (
              <ul className="space-y-2">
                {Array.from(uploadedFile).map((file) => (
                  <li
                    key={file.name}
                    className="flex flex-wrap items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md"
                  >
                    <div className="flex items-center">
                      <HiUpload className="mr-2 text-blue-600" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {file.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 md:mt-0 md:ml-2">
                      {file.size < 1_000_000
                        ? `${Math.floor(file.size / 1_000)} KB`
                        : `${(file.size / 1_000_000).toFixed(2)} MB`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Button
              disabled={isSubmitting}
              isProcessing={isSubmitting}
              fullSized
              type="submit"
              color="blue"
              className="w-full"
            >
              Upload Journal
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <ConfirmationModal
        onClose={() => !isActionLoading && setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        open={
          !!confirmAction &&
          ["approve", "download", "delete"].includes(confirmAction.type)
        }
        title={
          confirmAction?.type === "approve"
            ? "Approve Journal Upload"
            : confirmAction?.type === "download"
              ? " Downloading Journal Upload"
              : "Delete Journal Upload"
        }
        message={
          ["approve", "delete"].includes(confirmAction?.type as string) ? (
            ` Are you sure you want to ${confirmAction?.type}: "${confirmAction?.journal.title}"? This action cannot be undone.`
          ) : (
            <div className="mt-4">
              <p className="!text-left text-sm text-gray-700 dark:text-gray-400">
                Downloading <b>{confirmAction?.journal.title}...</b>
              </p>
              <Progress
                progress={progress}
                progressLabelPosition="inside"
                size="lg"
                labelProgress
              />
            </div>
          )
        }
        icon={
          confirmAction?.type === "approve"
            ? BsCheckAll
            : confirmAction?.type === "download"
              ? BsDatabase
              : BsExclamationTriangle
        }
        theme={
          confirmAction?.type === "approve"
            ? "success"
            : confirmAction?.type === "download"
              ? "info"
              : "failure"
        }
        confirmText={
          confirmAction?.type === "approve" ? "Yes, Approve" : "Yes, Delete"
        }
        showButtons={confirmAction?.type !== "download"}
        loading={isActionLoading}
      />

      <Modal
        show={openRejectModal}
        onClose={() => !isActionLoading && setOpenRejectModal(false)}
      >
        <Modal.Header>Reject Journal Upload</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <Label htmlFor="rejection_reason" value="Reason for rejection" />
            <Textarea
              id="rejectionReason"
              rows={5}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason here..."
              helperText={"Provide a minimum of 20 characters"}
              disabled={isActionLoading}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end items-center">
          <Button
            color="gray"
            disabled={isActionLoading}
            onClick={() => setOpenRejectModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            color="warning"
            isProcessing={isActionLoading}
            disabled={
              !rejectionReason || rejectionReason.length < 20 || isActionLoading
            }
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
