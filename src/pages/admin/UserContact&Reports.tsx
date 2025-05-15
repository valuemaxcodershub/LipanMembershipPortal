import {
  Card,
  Tabs,
  Badge,
  Button,
  FileInput,
  TextInput,
  Textarea,
  Label,
  Modal,
  Table,
  Tooltip,
  Pagination,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BsReply, BsTable, BsGrid3X3GapFill } from "react-icons/bs";
import { FiMail, FiDownload, FiSearch } from "react-icons/fi";
import { FileDropzone } from "../../components/UI/FiledropZone";
import { Skeleton } from "../../components/UI/Skeleton";
import axios from "../../config/axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/api/errors";

const schema = yup.object().shape({
  subject: yup.string().required("Subject is required"),
  reply: yup.string().required("Message is required"),
});

export default function AdminContactMessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [tableLayout, setTableLayout] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = Number(searchParams.get("itemsPerPage")) || 10;
  const page = Number(searchParams.get("page")) || 1;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const layout = localStorage.getItem("layout") || "table";
    setTableLayout(layout === "table");
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/contact-admin/");
      console.log("Fetched Messages:", data);
      setMessages(data.results);
      setTotalPages(data.total_pages);
      setFilteredMessages(data.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const filtered = messages.filter(
      (msg) =>
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

  const handleLayoutChange = (layout: string) => {
    setTableLayout(layout === "table");
    localStorage.setItem("layout", layout);
  };

  const openReplyModal = (msg: any) => {
    setSelectedMessage(msg);
    reset({
      subject: `Reply to: ${msg.subject}`,
      reply: ""
    });
    setReplyModal(true);
  };

  const openViewModal = (message: any) => {
    setSelectedMessage(message);
    setViewModal(true);
  };

  const onReplySubmit = async (formdata: any) => {
    console.log("Reply Data:", formdata);
    const toastId = toast.loading("Sending reply...", {
      position: "top-center"
    });
    try {
      const { data } = await axios.post(
        `/contact-admin/${selectedMessage.id}/reply/`,
        formdata
      );
      console.log("Reply Response:", data);
      toast.update(toastId, {
        render: data?.detail || "Reply sent successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setReplyModal(false);
    } catch (err: any) {
      console.error("Error sending reply:", err);
      const errorMsg = errorHandler(err);
      toast.update(toastId, {
        render: errorMsg || "Failed to send reply. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const paginatedMessages = filteredMessages.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const updateParams = (
    object: Record<string, string | number | boolean> = {}
  ) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(object).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value.toString());
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const onPageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Contact Messages
        </h1>
      </div>

      <div className="flex mb-6 items-center flex-col md:flex-row gap-3 w-full">
        <div className="w-6/12">
          <TextInput
            icon={FiSearch}
            placeholder="Search by subject or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex item-center justify-end space-x-4 w-6/12">
          <Tooltip content="Card Layout" placement="left">
            <button
              className={`p-2 rounded-md ${
                !tableLayout
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
              onClick={() => handleLayoutChange("card")}
            >
              <BsGrid3X3GapFill className="size-6" />
            </button>
          </Tooltip>
          <Tooltip content="Table Layout" placement="left">
            <button
              className={`p-2 rounded-md ${
                tableLayout
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
              onClick={() => handleLayoutChange("table")}
            >
              <BsTable className="size-6" />
            </button>
          </Tooltip>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="bg-white dark:bg-gray-800 dark:text-white shadow-sm animate-pulse"
            >
              <Skeleton className="h-4 rounded w-full mb-2" />
              <Skeleton className="h-4 rounded w-10/12 mb-2" />
              <Skeleton className="h-4 rounded w-9/12 mb-2" />
            </Card>
          ))}
        </div>
      ) : tableLayout ? (
        <Table>
          <Table.Head>
            <Table.HeadCell className="text-center">Email</Table.HeadCell>
            <Table.HeadCell className="text-center">Subject</Table.HeadCell>
            <Table.HeadCell className="text-center">Message</Table.HeadCell>
            <Table.HeadCell className="text-center">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {paginatedMessages.map((msg) => (
              <Table.Row
                key={msg.id}
                className="bg-white text-center dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <Table.Cell>
                  <div className="flex flex-col items-center">
                    {msg.email}
                    {msg.attachment && (
                      <Badge color="warning" className="mt-1">
                        Attachment
                      </Badge>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col items-center">
                    {msg.subject}
                    {msg.attachment && (
                      <span className="inline-block md:hidden mt-1">
                        <Badge color="warning">Attachment</Badge>
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <p className="truncate max-w-[150px] text-center">
                    {msg.message}
                  </p>
                </Table.Cell>
                <Table.Cell className="flex justify-center items-center gap-2">
                  <Button
                    size="xs"
                    color="blue"
                    onClick={() => openViewModal(msg)}
                  >
                    View
                  </Button>
                  <Button
                    size="xs"
                    color="blue"
                    onClick={() => openReplyModal(msg)}
                  >
                    <BsReply className="mr-2 h-4" /> Reply
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {paginatedMessages.map((msg) => (
            <Card
              key={msg.id}
              className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {msg.subject}
                    {msg.attachment && (
                      <Badge color="warning" className="ml-2">
                        Attachment
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {msg.email}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                {msg.message}
              </p>

              <div className="text-right flex gap-3">
                <Button
                  size="xs"
                  color="blue"
                  onClick={() => openViewModal(msg)}
                >
                  View
                </Button>
                <Button
                  size="xs"
                  color="blue"
                  onClick={() => openReplyModal(msg)}
                >
                  <BsReply className="mr-2 h-4" /> Reply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      <Modal show={viewModal} onClose={() => setViewModal(false)} size="xl">
        <Modal.Header>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Message Details
          </h2>
        </Modal.Header>
        <Modal.Body>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Subject
              </p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {selectedMessage?.subject}
              </p>
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {selectedMessage?.email}
              </p>
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Message
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedMessage?.message}
              </p>
            </div>
            {selectedMessage?.attachment && (
              <>
                <hr className="border-gray-200 dark:border-gray-700" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Attachment
                  </p>
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => alert("Downloading...")}
                    className="mt-2"
                  >
                    <FiDownload className="mr-2 h-4" /> Download Attachment
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={replyModal} onClose={() => setReplyModal(false)}>
        <Modal.Header>
          Replying to: {selectedMessage?.email} message
        </Modal.Header>
        <Modal.Body>
          <form className="space-y-4" onSubmit={handleSubmit(onReplySubmit)}>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <TextInput id="subject" {...register("subject")} readOnly />
            </div>
            <div>
              <Label htmlFor="reply">Reply</Label>
              <Textarea
                id="reply"
                rows={4}
                placeholder="Write your response here..."
                {...register("reply")}
                color={errors.reply ? "failure" : undefined}
                helperText={errors.reply?.message} 
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                color="gray"
                type="button"
                onClick={() => setReplyModal(false)} 
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button color="blue" type="submit" 
              disabled={isSubmitting}>
                Send Reply
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
