import {
  Button,
  Card,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useState } from "react";
import { FiBell, FiPlus } from "react-icons/fi";

const NotificationAnnouncementPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [audience, setAudience] = useState("all");
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSendNotification = () => {
    setOpenModal(false);
    // send logic here
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FiBell className="text-blue-600 dark:text-blue-400" /> Notifications
        </h1>
        <Button color="blue" onClick={() => setOpenModal(true)}>
          <FiPlus className="mr-2" /> New Notification
        </Button>
      </div>

      {/* Notification Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-gray-800 dark:text-white shadow-sm hover:shadow-md"
          >
            <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
              Maintenance Downtime
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              We will be offline for maintenance this weekend. Please save your work.
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
              Sent to: All Members • 2 hours ago
            </span>
          </Card>
        ))}
      </div>

      {/* Modal for Creating Notification */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="lg">
        <Modal.Header>Send Notification</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="audience" value="Send to" />
              <Select
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="members">Members Only</option>
                <option value="admins">Admins Only</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject" value="Subject" />
              <TextInput id="subject" placeholder="Enter notification subject" required />
            </div>

            <div>
              <Label htmlFor="message" value="Message" />
              <Textarea
                id="message"
                rows={4}
                placeholder="Write your notification message..."
                required
              />
            </div>

            <div className="flex items-center gap-3">
                 <Checkbox
                   checked={isUrgent}
                   onChange={() => setIsUrgent(!isUrgent)}
                 />
                   <Label value="Mark as urgent"/>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSendNotification}>Send</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotificationAnnouncementPage;
