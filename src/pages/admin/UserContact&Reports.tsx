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
} from "flowbite-react";
import { useState } from "react";
import { BsReply } from "react-icons/bs";
import { FiMail, FiDownload } from "react-icons/fi";
import { FileDropzone } from "../../components/UI/FiledropZone";

const sampleMessages = [
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

export default function AdminContactMessagesPage() {
  const [replyModal, setReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const openReplyModal = (message: any) => {
    setSelectedMessage(message);
    setReplyModal(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Contact Messages
      </h1>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {sampleMessages.map((msg) => (
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

            {msg.attachment && (
              <Button
                size="xs"
                color="gray"
                className="mb-2"
                pill
                onClick={() => alert("Downloading...")}
              >
                <FiDownload className="mr-2 h-4" /> Download Attachment
              </Button>
            )}

            <div className="text-right">
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

      <Modal show={replyModal} onClose={() => setReplyModal(false)}>
        <Modal.Header>Reply to: {selectedMessage?.email}</Modal.Header>
        <Modal.Body>
          <form className="space-y-4">
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
              />
            </div>
            <div>
             
              <FileDropzone label="Attachment (optional)" onFilesSelected={()=> {}} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setReplyModal(false)}>Send Reply</Button>
          <Button color="gray" onClick={() => setReplyModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
