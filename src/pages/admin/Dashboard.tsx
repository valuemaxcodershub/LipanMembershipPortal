import { Card, Dropdown, Progress, Table, Tooltip } from "flowbite-react";
import {
  HiUsers,
  HiDocumentText,
  HiOutlineTrendingUp,
  HiOutlineMail,
  HiDotsVertical,
} from "react-icons/hi";
import { Button } from "flowbite-react";

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Users</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                1,245
              </h3>
            </div>
            <HiUsers className="text-4xl text-blue-500" />
          </div>
        </Card>

        <Card className="hover:shadow-xl transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Help Requests</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                87
              </h3>
            </div>
            <HiOutlineMail className="text-4xl text-red-500" />
          </div>
        </Card>

        <Card className="hover:shadow-xl transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Resources Uploaded</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                340
              </h3>
            </div>
            <HiDocumentText className="text-4xl text-green-500" />
          </div>
        </Card>

        <Card className="hover:shadow-xl transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Request Rate</p>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                +18%
              </h3>
            </div>
            <HiOutlineTrendingUp className="text-4xl text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Request Completion Progress */}
      <Card>
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
          Request Resolution Progress
        </h2>
        <Progress
          progress={72}
          color="blue"
          textLabelPosition="outside"
          textLabel="72% Completed"
        />
      </Card>

      {/* Recent Users Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Users
          </h2>
          <Dropdown label={<HiDotsVertical className="text-xl" />} inline>
            <Dropdown.Item>View All</Dropdown.Item>
            <Dropdown.Item>Export</Dropdown.Item>
          </Dropdown>
        </div>

        <Table hoverable striped>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Date Joined</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            <Table.Row>
              <Table.Cell>Jane Doe</Table.Cell>
              <Table.Cell>jane@example.com</Table.Cell>
              <Table.Cell>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Active
                </span>
              </Table.Cell>
              <Table.Cell>2025-04-01</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>John Smith</Table.Cell>
              <Table.Cell>john@example.com</Table.Cell>
              <Table.Cell>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                  Pending
                </span>
              </Table.Cell>
              <Table.Cell>2025-04-05</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
};

export default AdminDashboard;
