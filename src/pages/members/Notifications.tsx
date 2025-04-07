import { useState } from "react";
import { Button, Card, Dropdown, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { HiBell, HiCheck, HiClock, HiDocumentDownload, HiSearch } from "react-icons/hi";
import { FaFileCsv, FaFilePdf } from "react-icons/fa";

type Notification = {
  id: number;
  type: "Info" | "Warning" | "Success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "Info",
    title: "Event Reminder",
    message: "You have a leadership seminar on April 10th at 10:00 AM.",
    timestamp: "2025-04-01T09:30:00Z",
    read: false,
  },
  {
    id: 2,
    type: "Success",
    title: "Invoice Paid",
    message: "Invoice #INV-02342 has been successfully paid.",
    timestamp: "2025-03-28T14:45:00Z",
    read: true,
  },
  {
    id: 3,
    type: "Warning",
    title: "Membership Expiring Soon",
    message: "Your annual membership will expire in 5 days.",
    timestamp: "2025-03-27T11:15:00Z",
    read: false,
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [search, setSearch] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleSearch = () => {
    return notifications.filter((notif) =>
      notif.title.toLowerCase().includes(search.toLowerCase()) ||
      notif.message.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filteredNotifications = handleSearch().filter((n) =>
    showUnreadOnly ? !n.read : true
  );

  return (
    <div className="mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <HiBell className="text-blue-600 dark:text-blue-400" /> Notifications
        </h1>
        <div className="flex gap-2 items-center">
          <TextInput
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={HiSearch}
          />
          <ToggleSwitch
            checked={showUnreadOnly}
            onChange={setShowUnreadOnly}
            label="Unread only"
          />
          <Dropdown label="Export" color="gray" inline>
            <Dropdown.Item icon={FaFileCsv}>Download CSV</Dropdown.Item>
            <Dropdown.Item icon={FaFilePdf}>Download PDF</Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-2 ${
                notif.read ? "opacity-70" : "border-l-4 border-blue-600"
              }`}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {notif.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <HiClock className="inline-block" />{" "}
                  {new Date(notif.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                {!notif.read && (
                  <Button
                    color="success"
                    size="xs"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <HiCheck className="mr-1" /> Mark as Read
                  </Button>
                )}
                <Button
                  size="xs"
                  color="blue"
                  onClick={() => setSelectedNotification(notif)}
                >
                  View
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <p>No notifications found.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        show={selectedNotification !== null}
        onClose={() => setSelectedNotification(null)}
        size="lg"
      >
        <Modal.Header>{selectedNotification?.title}</Modal.Header>
        <Modal.Body>
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {selectedNotification?.message}
            </p>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <HiClock />{" "}
              {new Date(selectedNotification?.timestamp || "").toLocaleString()}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setSelectedNotification(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotificationsPage;
