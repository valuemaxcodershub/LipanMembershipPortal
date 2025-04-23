import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  TextInput,
  Badge,
  Pagination,
  Modal,
} from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { FaEye, FaTrash, FaBan } from "react-icons/fa";
import axios from "../../config/axios";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    membership: "Gold",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    membership: "Silver",
    status: "Suspended",
  },
];

type User = {
  id: number;
  name: string;
  email: string;
  membership: string;
  status: string;
};

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState(mockUsers);
  const [membershipFilter, setMembershipFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let filteredUsers = [...users];

    if (membershipFilter) {
      filteredUsers = filteredUsers.filter(
        (user) => user.membership === membershipFilter
      );
    }

    if (statusFilter) {
      filteredUsers = filteredUsers.filter(
        (user) => user.status === statusFilter
      );
    }

    if (search.trim()) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(filteredUsers);
  }, [membershipFilter, statusFilter, search, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      // Simulate fetch
      await new Promise((res) => setTimeout(res, 7000));
      // const { data } = await axios.get("/api/users"); // Uncomment this line when using actual API
      // setUsers(data); // Uncomment this line when using actual API
      setUsers(mockUsers); // replace with API result
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        User Management
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        <TextInput
          icon={HiSearch}
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-3/5"
        />
        <div className="flex gap-4 w-full md:w-2/5">
          <Select
            onChange={(e) => setMembershipFilter(e.target.value)}
            value={membershipFilter}
            className="w-full"
          >
            <option value="">All Memberships</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Basic">Basic</option>
          </Select>
          <Select
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
            className="w-full"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <Table hoverable className="min-w-full text-sm">
          <Table.Head className="bg-gray-100 dark:bg-gray-800">
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Membership</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-6">
                  <div className="flex justify-center">
                    <div className="animate-spin size-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Loading users...</p>
                </Table.Cell>
              </Table.Row>
            ) : error ? (
              <Table.Row>
                <Table.Cell
                  colSpan={5}
                  className="text-center text-red-500 py-6"
                >
                  {error}
                </Table.Cell>
              </Table.Row>
            ) : users.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={5}
                  className="text-center text-gray-500 py-6"
                >
                  No users found.
                </Table.Cell>
              </Table.Row>
            ) : (
              users.map((user) => (
                <Table.Row
                  key={user.id}
                  className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Badge color="purple">{user.membership}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={
                        user.status === "Active"
                          ? "success"
                          : user.status === "Suspended"
                            ? "failure"
                            : "gray"
                      }
                    >
                      {user.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="xs"
                        color="light"
                        onClick={() => openUserModal(user)}
                      >
                        <FaEye className="mr-1" /> View
                      </Button>
                      <Button size="xs" color="warning">
                        <FaBan className="mr-1" /> Suspend
                      </Button>
                      <Button size="xs" color="failure">
                        <FaTrash className="mr-1" /> Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>

      <div className="flex justify-center pt-4">
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>User Details</Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Membership:</strong> {selectedUser.membership}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
