import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  TextInput,
  Badge,
  Pagination,
  Modal,
  Label,
  Checkbox,
  Textarea,
  Avatar,
  Tooltip,
} from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import {
  FaEye,
  FaTrash,
  FaBan,
  FaPlus,
  FaUser,
  FaUserShield,
  FaRedo,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../../config/axios";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { Link, useSearchParams } from "react-router-dom";
import { signUpSchema } from "../../schemas/mainauth";
import PasswordInput from "../../components/UI/PasswordInput";
import { toast } from "react-toastify";
import SelectableSection from "../../components/UI/SelectionCard";
import { getInitails } from "../../utils/app/text";
import { BsCheckAll } from "react-icons/bs";
import { errorHandler } from "../../utils/api/errors";
// Mock Users
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
  full_name: string;
  email: string;
  membership_type: string;
  is_staff: boolean;
  is_active: boolean;
  profile_pic: string | null;
};

const addUserSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
  password1: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password2: yup
    .string()
    .oneOf([yup.ref("password1")], "Passwords must match")
    .required("Confirm password is required"),
  is_staff: yup.boolean().required("User type is required"),
});

const UserManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const membership_type = searchParams.get("membership_type") || "";
  const is_active = searchParams.get("is_active") || "";

  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [membership, setMembership] = useState([]);
  const [membershipMap, setMembershipMap] = useState<any>(null);
  const [membershipFilter, setMembershipFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [debounceValue, setDebounceValue] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | {
    type: "delete" | "statusChange" | "approve";
    user: User;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(addUserSchema),
    defaultValues: {
      is_staff: false,
    },
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const { data: membershipData } = await axios.get(`/membership/`);
      const { data } = await axios.get("/accounts/users/", {
        params: { page, search, membership_type, is_active },
      });
      const map = membershipData.results.reduce((acc: any, obj: any) => {
        acc[`${obj.id}`] = obj.name;
        return acc;
      }, {});
      console.log(data, membershipData);
      setMembershipMap(map);
      setMembership(membershipData.results);
      setTotalPages(data.total_pages);
      setUsers(data.results);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      setDebounceValue(searchValue);
    }, 500);
    return () => clearInterval(id);
  }, [searchValue]);
  useEffect(() => {
    updateParams({
      search: debounceValue,
      is_active: statusFilter,
      membership_type: membershipFilter,
    });
  }, [debounceValue, statusFilter, membershipFilter]);

  useEffect(() => {
    fetchUsers();
  }, [page, search, membership_type, is_active]);

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      await axios.post("/accounts/users/", data);
      reset();
      setOpenAddModal(false);
      toast.success(
        `${data.is_staff ? "Admin" : "User"} "${data.email}" added successfully!`
      );
      fetchUsers(); // Refresh the user list after adding a new user
    } catch (err) {
      toast.error("Failed to add user. Please try again.");
    }
  };

  const handleConfirmAction = async () => {
    if (confirmAction) {
      const { user } = confirmAction;
      setActionLoading(true);
      const url = `/accounts/users/${user.id}/`;
      try {
        if (confirmAction.type === "delete") {
          await axios.delete(url);
          toast.success(`User "${user.full_name}" deleted successfully!`);
        } else if (confirmAction.type === "statusChange") {
          await axios.patch(url, { is_active: !user.is_active });
          toast.success(
            `User "${user.full_name}" ${user.is_active ? "suspended" : "activated"} successfully!`
          );
        }
        fetchUsers();
        setConfirmAction(null);
      } catch (err: any) {
        const errorMsg = errorHandler(err);
        toast.error(errorMsg || "Action not completed, try again");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const updateParams = (fields: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(fields).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const onPageChange = (page: number) =>
    updateParams({ page: page.toString() });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          User Management
        </h1>
        <div className="flex items-center gap-3">
          <Tooltip content="Refresh" placement="right">
            <Button color="gray" pill className="!w-fit" onClick={fetchUsers}>
              <FaRedo className="text-blue-600" />
            </Button>
          </Tooltip>
          <Button color="blue" onClick={() => setOpenAddModal(true)}>
            <FaPlus className="mr-2 h-6" /> Add New User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        <TextInput
          icon={HiSearch}
          placeholder="Search by name or email"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full md:w-3/5"
        />
        <div className="flex gap-4 w-full md:w-2/5">
          <Select
            onChange={(e) => setMembershipFilter(e.target.value)}
            value={membershipFilter}
            className="w-full"
          >
            <option value="">All Memberships</option>
            {membership.map((opt: any) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </Select>
          <Select
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
            className="w-full"
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Suspended</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <Table hoverable className="min-w-full text-sm">
          <Table.Head className="bg-gray-100 text-center dark:bg-gray-800">
            <Table.HeadCell>S/N</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Membership</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell
                  colSpan={7}
                  className="bg-white text-center dark:bg-gray-800 border-b dark:border-gray-700 py-6"
                >
                  <div className="flex justify-center">
                    <div className="animate-spin size-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Loading users...</p>
                </Table.Cell>
              </Table.Row>
            ) : error ? (
              <Table.Row>
                <Table.Cell
                  colSpan={7}
                  className="bg-white text-center dark:bg-gray-800 border-b dark:border-gray-700 text-red-500 py-6"
                >
                  {error}
                </Table.Cell>
              </Table.Row>
            ) : users.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={7}
                  className="bg-white text-center dark:bg-gray-800 border-b dark:border-gray-700 text-gray-500 py-6"
                >
                  No users found.
                </Table.Cell>
              </Table.Row>
            ) : (
              users.map((user, idx) => (
                <Table.Row
                  key={user.id}
                  className="bg-white text-center dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <Table.Cell>
                    <div className="flex items-center justify-center h-full">
                      {(page - 1) * 10 + (idx + 1)}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="flex items-center gap-3">
                    <Avatar
                      img={
                        user.profile_pic
                          ? `${import.meta.env.VITE_API_URL + user.profile_pic}`
                          : undefined
                      }
                      placeholderInitials={
                        user?.full_name ? getInitails(user?.full_name) : "- -"
                      }
                      size="sm"
                      bordered
                      statusPosition="bottom-right"
                      rounded
                      status={user?.is_active ? "online" : "offline"}
                    />
                    <p className="truncate max-w-[200px]">{user.full_name}</p>
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      className="w-fit mx-auto"
                      color={user.is_staff ? "purple" : "warning"}
                    >
                      <div className=" !flex !items-center !gap-2">
                        {user.is_staff ? (
                          <>
                            <FaUserShield className="text-black size-2" /> Admin
                          </>
                        ) : (
                          <>
                            <FaUser className="text-black size-2" /> Member
                          </>
                        )}
                      </div>
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge className="w-fit mx-auto" color="purple">
                      {membershipMap[`${user.membership_type}`] || "N/A"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      className="w-fit mx-auto"
                      color={user.is_active ? "success" : "failure"}
                    >
                      {user.is_active ? "Active" : "Suspended"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="xs"
                        color="blue"
                        className="!w-fit"
                        // onClick={() => openUserModal(user)}
                        as={Link}
                        to={`/admin/manage-users/${user.id}/view`}
                      >
                        <FaEye className="h-5" />
                      </Button>
                      {user.is_active ? (
                        <Button
                          size="xs"
                          color="warning"
                          className="!w-fit"
                          onClick={() =>
                            setConfirmAction({ type: "statusChange", user })
                          }
                        >
                          <FaBan className="h-5" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="!bg-green-500 !w-fit"
                          onClick={() =>
                            setConfirmAction({ type: "statusChange", user })
                          }
                        >
                          <BsCheckAll className="h-5" />
                        </Button>
                      )}
                      <Button
                        size="xs"
                        color="failure"
                        className="!w-fit"
                        onClick={() =>
                          setConfirmAction({ type: "delete", user })
                        }
                      >
                        <FaTrash className="h-5" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        show={openAddModal}
        onClose={() => !isSubmitting && setOpenAddModal(false)}
      >
        <Modal.Header>Add New User</Modal.Header>
        <Modal.Body>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="title" value="Title" />
              <Select
                id="title"
                {...register("title")}
                color={errors.title ? "failure" : undefined}
                helperText={errors.title?.message}
                disabled={isSubmitting}
              >
                <option value="">Select Title</option>
                <option value="mr">Mr</option>
                <option value="miss">Ms</option>
                <option value="dr">Dr</option>
                <option value="prof">Prof</option>
                <option value="mrs">Mrs</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="full_name" value="Full Name" />
              <TextInput
                id="full_name"
                disabled={isSubmitting}
                {...register("full_name")}
                color={errors.full_name ? "failure" : undefined}
                helperText={errors.full_name?.message}
              />
            </div>
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                disabled={isSubmitting}
                {...register("email")}
                color={errors.email ? "failure" : undefined}
                helperText={errors.email?.message}
              />
            </div>
            <div>
              <Label htmlFor="gender" value="Gender" />
              <Select
                id="gender"
                {...register("gender")}
                color={errors.gender ? "failure" : undefined}
                helperText={errors.gender?.message}
                disabled={isSubmitting}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Ms</option>
                <option value="other">Others</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone" value="Phone" />
              <TextInput
                id="phone"
                disabled={isSubmitting}
                {...register("phone")}
                color={errors.phone ? "failure" : undefined}
                helperText={errors.phone?.message}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password1" value="Password" />
                <PasswordInput
                  id="password1"
                  disabled={isSubmitting}
                  {...register("password1")}
                  error={errors.password1}
                />
              </div>
              <div>
                <Label htmlFor="password2" value="Confirm Password" />
                <PasswordInput
                  id="password2"
                  disabled={isSubmitting}
                  {...register("password2")}
                  error={errors.password2}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label value="User Type" />
              <SelectableSection
                options={[
                  {
                    id: false,
                    label: "Member",
                    icon: <FaUser />,
                  },
                  {
                    id: true,
                    label: "Admin",
                    icon: <FaUserShield />,
                  },
                ]}
                onChange={(val) => setValue("is_staff", val as boolean)}
                allowBooleanToggle
                value={watch("is_staff")}
                renderItem={(item, isSelected) => (
                  <div
                    className={`w-[90px] rounded-md cursor-pointer bg-gray-200 dark:bg-gray-800 p-3 ${isSelected ? "border-2 border-blue-600 !text-blue-600" : "border"}`}
                  >
                    <div
                      className={`text-4xl ${isSelected ? "text-blue-600" : "text-gray-500"} m-auto w-fit`}
                    >
                      {item.icon}
                    </div>
                    <p className="text-xs font-semibold text-center dark:text-gray-200">
                      {item.label}
                    </p>
                  </div>
                )}
              />
            </div>
            <div className="flex justify-end gap-3 mt-3">
              <Button
                color="gray"
                type="button"
                onClick={() => {
                  setOpenAddModal(false);
                  reset();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitting}
                isProcessing={isSubmitting}
                color="blue"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={!!confirmAction}
        loading={actionLoading}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={
          confirmAction?.type === "delete" ? "Delete User?" : "Suspend User?"
        }
        message={`Are you sure you want to ${
          confirmAction?.type === "delete" ? "delete" : "suspend"
        } ${confirmAction?.user.full_name}?`}
        // destructive
      />
    </div>
  );
};

export default UserManagementPage;
