import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Label,
  TextInput,
  Textarea,
  Button,
  Select,
  Avatar,
  Modal,
  Badge,
} from "flowbite-react";
import { HiArrowCircleLeft } from "react-icons/hi";
import { FiCalendar, FiCheckCircle, FiClock } from "react-icons/fi";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useParams } from "react-router-dom";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { getInitails } from "../../utils/app/text";
import { Skeleton } from "../../components/UI/Skeleton";
import PasswordInput from "../../components/UI/PasswordInput";
import { useAuth } from "../../hooks/auth";

const profileSchema = yup.object({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  title: yup.string().required("Title is required"),
  gender: yup.string().required("Gender is required"),
  phone: yup.string().required("Phone is required"),
  organization: yup.string().nullable(),
  mailing_address: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  lga: yup.string().nullable(),
  zip_code: yup.string().nullable(),
  payment_status: yup.string().nullable(),
  payment_method: yup.string().nullable(),
  plan_type: yup.string().nullable().default("yearly"),
  membership_type: yup.string().nullable(),
});

const passwordSchema = yup.object({
  new_password1: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  new_password2: yup
    .string()
    .oneOf([yup.ref("new_password1")], "Passwords must match"),
});

type PasswordChangeType = yup.InferType<typeof passwordSchema>;

type MembershipInfo = {
  account_created_at?: string | null;
  membership_start?: string | null;
  membership_end?: string | null;
  membership_active?: boolean;
  plan_type?: string | null;
  last_payment_date?: string | null;
  last_payment_amount?: string | null;
  last_payment_method?: string | null;
  last_payment_type?: "registration" | "renewal" | null;
  payment_count?: number;
};

function formatDay(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function daysUntil(value?: string | null) {
  if (!value) return null;
  const end = new Date(value);
  if (Number.isNaN(end.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ViewUserPage() {
  const auth = useAuth();
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: passwordReset,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });
  const { id, type } = useParams<{ id: string; type: string }>();
  const [user, setUser] = useState<any>(null);
  const [membershipMap, setMembershipMap] = useState<any>({});
  const [memberships, setMemberships] = useState<any[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [lgas, setLgas] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      plan_type: "yearly",
      state: "",
      lga: "",
    },
  });

  const selectedState = watch("state");

  useEffect(() => {
    fetch("https://nga-states-lga.onrender.com/fetch")
      .then((response) => response.json())
      .then((data) => setStates(data))
      .catch((error) => console.error("Error fetching states:", error));
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetch(`https://nga-states-lga.onrender.com/?state=${selectedState}`)
        .then((response) => response.json())
        .then((data) => {
          setLgas(data);
          setValue("lga", "");
        })
        .catch((error) => console.error("Error fetching LGAs:", error));
    } else {
      setLgas([]);
      setValue("lga", "");
    }
  }, [selectedState, setValue]);

  const fetchUserData = async () => {
    setIsFetching(true);
    try {
      const [membershipResponse, userResponse] = await Promise.all([
        axios.get(`/membership/`),
        axios.get(`/accounts/users/${id}/`, { params: { type } }),
      ]);
      const { profile_pic, ...data } = userResponse.data;
      const membershipData = membershipResponse.data;
      const rows = Array.isArray(membershipData?.results)
        ? membershipData.results
        : Array.isArray(membershipData)
          ? membershipData
          : [];
      const map = rows.reduce((acc: any, obj: any) => {
        acc[`${obj.id}`] = obj.name;
        return acc;
      }, {});
      setMembershipMap(map);
      setMemberships(rows);
      reset(data);
      setUser(data);
      setAvatarUrl(
        profile_pic
          ? `${import.meta.env.VITE_API_URL + profile_pic}`
          : "/avatar_placeholder.png"
      );
    } catch (error) {
      toast.error("Failed to fetch user data. Please try again.");
      console.error("Error fetching user data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id, type]);

  const info: MembershipInfo = user?.membership_info || {};
  const remaining = useMemo(() => daysUntil(info.membership_end), [info.membership_end]);
  const membershipName =
    user?.membership_detail?.name ||
    membershipMap?.[`${user?.membership_type}`] ||
    "No membership";
  const paymentLabel =
    info.last_payment_type === "renewal"
      ? "Membership renewal"
      : info.last_payment_type === "registration"
        ? "Membership registration"
        : "Last membership payment";

  const handleEditClick = () => {
    reset(user);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      const { data: updatedData } = await axios.patch(
        `/accounts/users/${id}/`,
        data,
        { params: { type } }
      );
      setUser(updatedData);
      setIsModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(
        `Failed to update profile: ${error.response?.data?.detail || error.message} Please try again.`
      );
    }
  };

  const onChangePassword = async (data: PasswordChangeType) => {
    const toastId = toast.loading("Changing Account Password....", {
      position: "top-center",
    });
    try {
      const response = await axios.post(
        `/accounts/users/${id}/password/change/`,
        data
      );
      passwordReset();
      toast.update(toastId, {
        render: response?.data?.detail || "Password change successful",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err: any) {
      toast.update(toastId, {
        render: err?.response?.data?.detail || "Error changing password",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-0 lg:p-6">
      <div className="flex items-center">
        <Button color="light" as={Link} to="/admin/manage-users">
          <HiArrowCircleLeft className="mr-2 h-6" />
          Back to Users
        </Button>
      </div>

      {isFetching ? (
        <Card>
          <div className="flex items-end gap-4">
            <Skeleton className="size-[120px] rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-24 rounded" />
              <Skeleton className="h-8 w-64 rounded" />
            </div>
          </div>
          <Skeleton className="mt-6 h-40 w-full rounded" />
        </Card>
      ) : (
        <>
          <Card className="border-0 !border-t-4 !border-t-blue-600">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  img={avatarUrl || undefined}
                  placeholderInitials={getInitails(user?.full_name)}
                  size="xl"
                  bordered
                  rounded
                  status={user?.is_active ? "online" : "offline"}
                />
                <div>
                  <p className="text-sm font-semibold capitalize text-gray-500">
                    {user?.title || "Member"}
                  </p>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    {user?.full_name || "Unnamed member"}
                  </h1>
                  <p className="mt-1 font-mono text-sm text-blue-700 dark:text-blue-400">
                    {user?.lipan_id || "No LiPAN ID"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge color={user?.is_active ? "success" : "failure"}>
                      {user?.is_active ? "Account active" : "Suspended"}
                    </Badge>
                    {!user?.is_staff && (
                      <Badge color={info.membership_active ? "success" : "warning"}>
                        {info.membership_active ? "Membership active" : "Membership expired"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button color="blue" onClick={handleEditClick}>
                Edit Profile
              </Button>
            </div>
          </Card>

          {!user?.is_staff && (
            <Card className="border-0">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Membership timeline
                  </h2>
                  <p className="text-sm text-gray-500">
                    Registration, renewal payments, and expiry for this member.
                  </p>
                </div>
                <Badge color={info.membership_active ? "success" : "warning"}>
                  {info.membership_active ? "Active" : "Expired"}
                </Badge>
              </div>

              <div className="mb-5 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-gray-500">Current plan</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {membershipName}
                  {info.plan_type ? ` · ${String(info.plan_type).replace(/^\w/, (c) => c.toUpperCase())}` : ""}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <TimelineStat
                  icon={<FiCalendar />}
                  label="Account registered"
                  value={formatDay(info.account_created_at || user?.created_at)}
                />
                <TimelineStat
                  icon={<FiCheckCircle />}
                  label={paymentLabel}
                  value={formatDay(info.last_payment_date)}
                  hint={
                    info.last_payment_amount
                      ? `NGN ${Number(info.last_payment_amount).toLocaleString()}${
                          info.last_payment_method ? ` · ${info.last_payment_method}` : ""
                        }`
                      : "No successful payment recorded"
                  }
                />
                <TimelineStat
                  icon={<FiClock />}
                  label="Membership started"
                  value={formatDay(info.membership_start)}
                />
                <TimelineStat
                  icon={<FiClock />}
                  label="Membership expires"
                  value={formatDay(info.membership_end)}
                  hint={
                    remaining == null
                      ? undefined
                      : remaining >= 0
                        ? `${remaining} day${remaining === 1 ? "" : "s"} remaining`
                        : `Expired ${Math.abs(remaining)} day${Math.abs(remaining) === 1 ? "" : "s"} ago`
                  }
                  highlight={!info.membership_active}
                />
              </div>
            </Card>
          )}

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Contact & profile
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ProfileField label="Email" value={user?.email} />
              <ProfileField label="Phone" value={user?.phone} />
              <ProfileField label="Gender" value={user?.gender} />
              <ProfileField label="Title" value={user?.title} />
              <ProfileField label="Organization / Institution" value={user?.organization} />
              <ProfileField label="Mailing Address" value={user?.mailing_address} />
              <ProfileField label="City" value={user?.city} />
              <ProfileField label="State" value={user?.state} />
              <ProfileField label="LGA" value={user?.lga} />
              <ProfileField label="ZIP Code" value={user?.zip_code} />
              {!user?.is_staff && (
                <ProfileField
                  label="Payment status (profile)"
                  value={user?.payment_status}
                />
              )}
            </div>
            {user?.bio ? (
              <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">{user.bio}</p>
            ) : null}
          </Card>
        </>
      )}

      {auth.user?.is_superuser && user?.is_staff && (
        <Card>
          <h3 className="mb-4 text-xl font-semibold text-gray-700 dark:text-white">
            Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label value="New Password" />
                <PasswordInput
                  {...registerPassword("new_password1")}
                  error={passwordErrors.new_password1}
                />
              </div>
              <div>
                <Label value="Confirm New Password" />
                <PasswordInput
                  {...registerPassword("new_password2")}
                  error={passwordErrors.new_password2}
                />
              </div>
            </div>
            <Button color="blue" type="submit" fullSized>
              Update Password
            </Button>
          </form>
        </Card>
      )}

      <Modal
        show={isModalOpen}
        position="center"
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        size="3xl"
      >
        <Modal.Header>Edit User Profile</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label value="First Name" />
                <TextInput
                  {...register("first_name")}
                  color={errors.first_name ? "failure" : undefined}
                  helperText={errors.first_name?.message}
                />
              </div>
              <div>
                <Label value="Last Name" />
                <TextInput
                  {...register("last_name")}
                  color={errors.last_name ? "failure" : undefined}
                  helperText={errors.last_name?.message}
                />
              </div>
              <div>
                <Label value="Title" />
                <Select
                  {...register("title")}
                  color={errors.title ? "failure" : undefined}
                  helperText={errors.title?.message}
                >
                  <option value="">Select title</option>
                  {["Mr", "Miss", "Dr", "Prof", "Mrs"].map((opt: string) => (
                    <option key={opt} value={opt.toLowerCase()}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label value="Gender" />
                <Select
                  {...register("gender")}
                  color={errors.gender ? "failure" : undefined}
                  helperText={errors.gender?.message}
                >
                  <option value="">Select gender</option>
                  {["Male", "Female", "Other"].map((opt: string) => (
                    <option key={opt} value={opt.toLowerCase()}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label value="Phone" />
                <TextInput
                  {...register("phone")}
                  color={errors.phone ? "failure" : undefined}
                  helperText={errors.phone?.message}
                />
              </div>
              <div>
                <Label value="Organization / Institution" />
                <TextInput {...register("organization")} />
              </div>
              <div>
                <Label value="City" />
                <TextInput {...register("city")} />
              </div>
              <div>
                <Label value="State" />
                <TextInput {...register("state")} />
              </div>
              <div>
                <Label value="ZIP Code" />
                <TextInput {...register("zip_code")} />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <Label value="Mailing Address" />
                <Textarea {...register("mailing_address")} rows={3} />
              </div>
              {!user?.is_staff && (
                <>
                  <div>
                    <Label value="Membership Type" />
                    <Select {...register("membership_type")}>
                      <option value="">Select Membership Type</option>
                      {memberships.map((opt: any) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label value="Payment Status" />
                    <Select {...register("payment_status")}>
                      <option value="">Select status</option>
                      {["Paid", "Unpaid"].map((opt: string) => (
                        <option key={opt} value={opt.toLowerCase()}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label value="Plan Type" />
                    <Select {...register("plan_type")}>
                      <option value="">Select plan</option>
                      {["Monthly", "Yearly"].map((opt: string) => (
                        <option key={opt} value={opt.toLowerCase()}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit" isProcessing={isSubmitting} disabled={isSubmitting} color="blue">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

const ProfileField = ({ label, value }: { label: string; value: any }) => (
  <div>
    <Label value={label} className="mb-1 text-sm font-medium text-gray-500" />
    <TextInput value={value || "N/A"} readOnly shadow />
  </div>
);

const TimelineStat = ({
  icon,
  label,
  value,
  hint,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-xl border p-4 ${
      highlight
        ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
    }`}
  >
    <div className="mb-2 text-blue-600">{icon}</div>
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white">{value}</p>
    {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
  </div>
);
