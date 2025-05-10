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

const schema = yup.object().shape({
  reply: yup.string().required("Reply is required"),
});

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [tableLayout, setTableLayout] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 5;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const layout = localStorage.getItem("layout") || "table";
    setTableLayout(layout === "table");
  }, []);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const fetchedMessages = [
        {
          id: 1,
          subject: "Login Issue",
          email: "user@example.com",
          message: "I can't access my account.",
          attachment: "user_issue_screenshot.png",
          date: "2025-04-10",
          replied: false,
        },
        {
          id: 2,
          subject: "Bug Report",
          email: "jane.doe@gmail.com",
          message: "There's a problem with file upload.",
          attachment: null,
          date: "2025-04-09",
          replied: true,
        },
      ];
      setMessages(fetchedMessages);
      setFilteredMessages(fetchedMessages);
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const filtered = messages.filter(
      (msg) =>
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMessages(filtered);
    setCurrentPage(1);
  }, [searchQuery, messages]);

  const handleLayoutChange = (layout: string) => {
    setTableLayout(layout === "table");
    localStorage.setItem("layout", layout);
  };

  const openReplyModal = (message: any) => {
    setSelectedMessage(message);
    setReplyModal(true);
  };

  const openViewModal = (message: any) => {
    setSelectedMessage(message);
    setViewModal(true);
  };

  const onReplySubmit = (data: any) => {
    console.log("Reply Data:", data);
    setReplyModal(false);
    reset();
  };

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <Table.HeadCell className="text-center">Subject</Table.HeadCell>
            <Table.HeadCell className="text-center">Email</Table.HeadCell>
            <Table.HeadCell className="text-center">Status</Table.HeadCell>
            <Table.HeadCell className="text-center">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {paginatedMessages.map((msg) => (
              <Table.Row
                key={msg.id}
                className="bg-white text-center dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <Table.Cell>{msg.subject}</Table.Cell>
                <Table.Cell>{msg.email}</Table.Cell>
                <Table.Cell>
                  <Badge
                    className="w-fit m-auto"
                    color={msg.replied ? "success" : "warning"}
                  >
                    {msg.replied ? "Replied" : "Pending"}
                  </Badge>
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {msg.subject}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {msg.email}
                  </p>
                </div>
                <Badge color={msg.replied ? "success" : "warning"}>
                  {msg.replied ? "Replied" : "Pending"}
                </Badge>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {msg.message}
              </p>

              <div className="text-right">
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
                  <BsReply className="mr-2 h-6" /> Reply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredMessages.length / itemsPerPage)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <Modal show={viewModal} onClose={() => setViewModal(false)}>
        <Modal.Header>Message Details</Modal.Header>
        <Modal.Body>
          <p>
            <strong>Subject:</strong> {selectedMessage?.subject}
          </p>
          <p>
            <strong>Email:</strong> {selectedMessage?.email}
          </p>
          <p>
            <strong>Message:</strong> {selectedMessage?.message}
          </p>
          {selectedMessage?.attachment && (
            <Button
              size="xs"
              color="gray"
              onClick={() => alert("Downloading...")}
            >
              <FiDownload className="mr-2 h-4" /> Download Attachment
            </Button>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={replyModal} onClose={() => setReplyModal(false)}>
        <Modal.Header>Reply to: {selectedMessage?.email}</Modal.Header>
        <Modal.Body>
          <form className="space-y-4" onSubmit={handleSubmit(onReplySubmit)}>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <TextInput
                id="subject"
                value={selectedMessage?.subject || ""}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="reply">Reply</Label>
              <Textarea
                id="reply"
                rows={4}
                placeholder="Write your response here..."
                {...register("reply")}
              />
              {errors.reply && (
                <p className="text-red-500 text-sm">{errors.reply.message}</p>
              )}
            </div>
            <div>
              <FileDropzone
                label="Attachment (optional)"
                onFilesSelected={() => {}}
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                color="gray"
                type="button"
                onClick={() => setReplyModal(false)}
              >
                Cancel
              </Button>
              <Button color="blue" type="submit">
                Send Reply
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
