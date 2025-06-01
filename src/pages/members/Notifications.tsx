import { useEffect, useState } from "react";
import { Button, Card, Dropdown, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { HiBell, HiCheck, HiClock, HiDocumentDownload, HiSearch } from "react-icons/hi";
import { FaFileCsv, FaFilePdf } from "react-icons/fa";
import axios from "../../config/axios";
import Switch from "../../components/UI/Switch";
import { formatDate } from "../../utils/app/time";
import { Skeleton } from "../../components/UI/Skeleton";

type Notification = {
  id: number;
  // type: "Info" | "Warning" | "Success";
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
};



const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
     const { data } = await axios.get("/accounts/user/notifications/");
     console.log(data);
     setNotifications(data.results);
     setIsLoading(false);
   } catch (error) {
      console.error("Error fetching notifications:", error);
   }
  }

  const handleSearch = () => {
    return notifications.filter((notif) =>
      notif.subject?.toLowerCase().includes(search.toLowerCase()) ||
      notif.message?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleMarkAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
     await axios.get(`/accounts/user/notifications/${id}/`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  
  const viewNotification = async (notification: Notification) => {
    setSelectedNotification(notification);
    handleMarkAsRead(notification.id);
  }

  const filteredNotifications = !notifications.length ? [] : handleSearch().filter((n) =>
    showUnreadOnly ? !n.is_read : true
  );

  useEffect(() => {
    fetchNotifications();
  }, [])

  if (isLoading) {
    return (
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <Skeleton className="h-10 w-60 mb-2" />
          <div className="flex gap-2 items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }
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
          <Switch
            checked={showUnreadOnly}
            onChange={setShowUnreadOnly}
            label="Unread only"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-2 ${
                notif.is_read ? "opacity-70" : "!border-l-4 !border-l-blue-600"
              }`}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {notif.subject}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-full">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <HiClock className="inline-block" />{" "}
                  {formatDate(notif.created_at) || "Unknown date"}
                </p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                {!notif.is_read && (
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
                  onClick={() => viewNotification(notif)}
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
        <Modal.Header>{selectedNotification?.subject}</Modal.Header>
        <Modal.Body>
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {selectedNotification?.message}
            </p>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <HiClock />{" "}
              {formatDate(selectedNotification?.created_at as string) ||
                "Unknown date"}
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
