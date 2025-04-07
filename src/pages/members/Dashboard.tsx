import { Card, Button, Badge, Table, Timeline, Label } from "flowbite-react";
import {
  FiUpload,
  FiBookOpen,
  FiClock,
  FiStar,
  FiBookmark,
  FiFileText,
  FiCreditCard,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import { usePayment } from "../../hooks/payment";

function MemberDashboard() {
  const { openPaymentModal } = usePayment();
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Welcome Back, John!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Upgrade your membership more for unlimited access and exclusive features.
        </p>
        <Button
          onClick={openPaymentModal}
          gradientDuoTone="purpleToBlue"
          className="mt-4"
        >
          Upgrade Your Membership
        </Button>
      </Card>

      {/* Stats Section */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FiBookOpen}
          color="blue"
          title="Books Read"
          value="15"
        />
        <StatCard
          icon={FiFileText}
          color="purple"
          title="My Journal Entries"
          value="5"
        />
        <StatCard
          icon={FiCreditCard}
          color="green"
          title="My Invoices"
          value="$350"
        />
        <StatCard
          icon={FiUsers}
          color="red"
          title="Membership Status"
          value="Basic"
        />
      </div>

      {/* Recent Activity Section */}
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Recent Activity
        </h2>
        <Timeline>
          <Timeline.Item>
            <Timeline.Point icon={FiStar} />
            <Timeline.Content>
              <p className="text-gray-800 dark:text-gray-200">
                You read "Pride and Prejudice"
              </p>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                2 hours ago
              </span>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point icon={FiUpload} />
            <Timeline.Content>
              <p className="text-gray-800 dark:text-gray-200">
                You uploaded "War and Peace"
              </p>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Yesterday
              </span>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline>
      </Card>

      {/* Upcoming Events */}
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Upcoming Events
        </h2>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="text-gray-800 dark:text-gray-200">
              Event
            </Table.HeadCell>
            <Table.HeadCell className="text-gray-800 dark:text-gray-200">
              Date
            </Table.HeadCell>
            <Table.HeadCell className="text-gray-800 dark:text-gray-200">
              Location
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="text-gray-800 dark:text-gray-200">
                <FiCalendar className="inline text-blue-500 mr-2" /> Book
                Reading Club
              </Table.Cell>
              <Table.Cell className="text-gray-800 dark:text-gray-200">
                April 10, 2025
              </Table.Cell>
              <Table.Cell className="text-gray-800 dark:text-gray-200">
                Community Hall
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="text-gray-800 dark:text-gray-200">
                <FiCalendar className="inline text-green-500 mr-2" /> Author
                Meetup
              </Table.Cell>
              <Table.Cell className="text-gray-800 dark:text-gray-200">
                April 15, 2025
              </Table.Cell>
              <Table.Cell className="text-gray-800 dark:text-gray-200">
                Library Room B
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionButton icon={FiUpload} color="blue" text="Upload a Book" />
          <ActionButton
            icon={FiBookOpen}
            color="green"
            text="Explore Library"
          />
          <ActionButton
            icon={FiBookmark}
            color="yellow"
            text="View Favorites"
          />
        </div>
      </Card>
    </div>
  );
}

const StatCard = ({ icon: Icon, color, title, value }: Record<string, any>) => (
  <Card>
    <div className="flex items-center space-x-4">
      <div className={`rounded-lg bg-${color}-100 dark:bg-${color}-900 p-4`}>
        <Icon className={`text-${color}-600 dark:text-${color}-400`} size={28} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </p>
      </div>
    </div>
  </Card>
);

const ActionButton = ({ icon: Icon, color, text }: Record<string, any>) => (
  <Button color={color} className="flex items-center space-x-2 w-full">
    <Icon size={20} />
    <span className="text-gray-800 dark:text-gray-100">{text}</span>
  </Button>
);

export default MemberDashboard;
