import {
  Button,
  Card,
  Modal,
  Label,
  Table,
  TextInput,
  Badge,
  BadgeProps,
  Tabs,
  TabItem,
} from "flowbite-react";
import { useState } from "react";
import { BsCheckAll, BsDatabase, BsExclamationTriangle, BsHourglass } from "react-icons/bs";
import { FaBoxOpen } from "react-icons/fa";

type JournalEntry = {
  id: number;
  memberName: string;
  uploadDate: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
};
const colorMapping: Record<string, BadgeProps["color"]> = {
  approved: "success",
  rejected: "failure",
  pending: "warning",
};

const statusMapping = {
  "0": "all",
  "1": "pending",
  "2": "approved",
  "3": "rejected",
};

export default function ManageJournalsPage() {
  const [journals, setJournals] = useState<JournalEntry[]>([
    {
      id: 1,
      memberName: "John Doe",
      uploadDate: "2025-04-10",
      fileUrl: "/journals/john-doe-journal.pdf",
      status: "pending",
    },
    {
      id: 2,
      memberName: "Jane Smith",
      uploadDate: "2025-04-09",
      fileUrl: "/journals/jane-smith-journal.pdf",
      status: "rejected",
      rejectionReason: "Content not appropriate",
    },
  ]);

  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<keyof typeof statusMapping>("0");
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (id: number) => {
    setJournals((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "approved" } : j))
    );
  };

  const handleRejectClick = (journal: JournalEntry) => {
    setSelectedJournal(journal);
    setOpenRejectModal(true);
    setRejectionReason("");
  };

  const handleRejectSubmit = () => {
    if (selectedJournal) {
      setJournals((prev) =>
        prev.map((j) =>
          j.id === selectedJournal.id
            ? { ...j, status: "rejected", rejectionReason }
            : j
        )
      );
      setOpenRejectModal(false);
      setSelectedJournal(null);
    }
  };
  const filteredJournals =
    statusMapping[activeTab] === "all"
      ? journals
      : journals.filter(
          (journal) => journal.status === statusMapping[activeTab]
        );

  return (
    <div className="mx-auto p-4 text-gray-800 dark:text-gray-100">
      <h1 className="mb-6 text-3xl font-bold">Approve Member Journals</h1>
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
      {/* <div className="grid gap-6 md:grid-cols-2">
        {journals.map((journal) => (
          <Card
            key={journal.id}
            className="bg-white dark:bg-gray-800 shadow-md"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                {journal.memberName}
              </h3>
              <Badge color={colorMapping[journal.status]} />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Uploaded: {journal.uploadDate}
            </p>

            <a
              href={journal.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 dark:text-blue-400 underline"
            >
              📄 View Journal
            </a>

            {journal.status === "rejected" && journal.rejectionReason && (
              <p className="mt-2 text-sm text-red-500">
                Reason: {journal.rejectionReason}
              </p>
            )}

            {journal.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => handleApprove(journal.id)}>
                  Approve
                </Button>
                <Button
                  size="sm"
                  color="failure"
                  onClick={() => handleRejectClick(journal)}
                >
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div> */}

      <div className="overflow-x-auto rounded-lg shadow-md">
        <Table hoverable>
          <Table.Head className="bg-gray-100 dark:bg-gray-700">
            <Table.HeadCell>Member Name</Table.HeadCell>
            <Table.HeadCell>Upload Date</Table.HeadCell>
            <Table.HeadCell>File</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            {(statusMapping[activeTab] === "all" ||
              statusMapping[activeTab] === "rejected") && (
              <Table.HeadCell>Rejection Reason</Table.HeadCell>
            )}
            <Table.HeadCell className="text-center">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-white dark:bg-gray-800">
            {filteredJournals.length ? (
              <>
                {filteredJournals.map((journal) => (
                  <Table.Row key={journal.id}>
                    <Table.Cell>{journal.memberName}</Table.Cell>
                    <Table.Cell>{journal.uploadDate}</Table.Cell>
                    <Table.Cell>
                      <a
                        href={journal.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        View File
                      </a>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={colorMapping[journal.status]}
                        className="capitalize"
                      >
                        {journal.status}
                      </Badge>
                    </Table.Cell>
                    {(statusMapping[activeTab] === "all" ||
                      statusMapping[activeTab] === "rejected") && (
                      <Table.Cell>
                        {journal.status === "rejected" &&
                        journal.rejectionReason
                          ? journal.rejectionReason
                          : "-"}
                      </Table.Cell>
                    )}
                    <Table.Cell className="flex gap-2 justify-center">
                      {journal.status === "pending" && (
                        <>
                          <Button
                            size="xs"
                            onClick={() => handleApprove(journal.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="xs"
                            color="failure"
                            onClick={() => handleRejectClick(journal)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </>
            ) : (
              <Table.Row>
                {" "}
                <Table.Cell
                  colSpan={
                    statusMapping[activeTab] === "all" ||
                    statusMapping[activeTab] === "rejected"
                      ? 6
                      : 5
                  }
                  className="text-center text-gray-500 dark:text-gray-400 w-full"
                >
                  <FaBoxOpen className="text-5xl block m-[10px_auto]" />
                  No{" "}
                  {statusMapping[activeTab] === "all" ? (
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

      <Modal show={openRejectModal} onClose={() => setOpenRejectModal(false)}>
        <Modal.Header>Reject Journal Upload</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <Label htmlFor="rejectionReason" value="Reason for rejection" />
            <TextInput
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason here..."
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleRejectSubmit} disabled={!rejectionReason}>
            Submit
          </Button>
          <Button color="gray" onClick={() => setOpenRejectModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
