import { forwardRef, useEffect, useState } from "react";
import {
  Card,
  Label,
  TextInput,
  Textarea,
  Button,
  Select,
  Avatar,
  Modal,
} from "flowbite-react";
import { HiArrowCircleLeft } from "react-icons/hi";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useParams } from "react-router-dom";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { getInitails } from "../../utils/app/text";
import { Skeleton } from "../../components/UI/Skeleton";

// 🔵 Validation Schema
const profileSchema = yup.object().shape({
  full_name: yup.string().required("Full Name is required"),
  title: yup.string().required("Title is required"),
  gender: yup.string().required("Gender is required"),
  phone: yup.string().required("Phone is required"),
  organization: yup.string().nullable(),
  mailing_address: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  zip_code: yup.string().nullable(),
  payment_status: yup.string().nullable(),
  payment_method: yup.string().nullable(),
  plan_type: yup.string().nullable(),
  membership_type: yup.string().nullable(),
});

export default function ViewUserPage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [user, setUser] = useState<any>(null);
  const [membershipMap, setMembershipMap] = useState<any>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  const fetchUserData = async () => {
    setIsFetching(true);
    try {
      const [membershipResponse, userResponse] = await Promise.all([
        axios.get(`/membership/`),
        axios.get(`/accounts/users/${id}/`, { params: { type } }),
      ]);
      const { profile_pic, ...data } = userResponse.data;
      const membershipData = membershipResponse.data;
      const map = membershipData.results.reduce((acc: any, obj: any) => {
        acc[`${obj.id}`] = obj.name;
        return acc;
      }, {});
      console.log("Memberships:", map, data);
      setMembershipMap(map);
      setMemberships(membershipData.results);
      reset(data);
      setUser(data);
      setAvatarUrl(
        profile_pic
          ? `${import.meta.env.VITE_API_URL + profile_pic}`
          : "/avatar_placeholder.png"
      );
      setIsFetching(false);
    } catch (error) {
      toast.error("Failed to fetch user data. Please try again.");
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditClick = () => {
    reset(user);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    console.log("Updated Profile Data:", data);
    // ⏩ You can trigger an update API here
    try {
      const { data: updatedData } = await axios.patch(
        `/accounts/users/${id}/`,
        data,
        { params: { type } }
      );
      console.log("Updated User Data:", updatedData);
      setUser(updatedData);
      setIsModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(
        `Failed to update profile: ${error.response.data.detail || error.message} Please try again.`
      );
      console.error("Error updating profile:", error.response);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* 🔵 Back Button */}
      <div className="flex items-center">
        <Button color="light" as={Link} to="/admin/manage-users">
          <HiArrowCircleLeft className="h-6 mr-2" />
          Back to Users
        </Button>
      </div>

      {/* 🔵 Profile Details */}
      <Card className="p-6 border-0 !border-t-4 border-blue-600">
        {/* 🔵 Profile Header */}
        {isFetching ? (
          <>
            <div className="flex flex-col md:flex-row items-end space-x-4">
              <Skeleton className="size-[200px] rounded-full" />
              <div>
                <Skeleton className="h-6 mb-3 w-[50px] rounded" />
                <Skeleton className="h-6  w-[250px] rounded" />
              </div>
            </div>
            <Skeleton className="h-24 w-full mb-4 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-11 w-full mb-4 rounded" />
              <Skeleton className="h-11 w-full mb-4 rounded" />
              <Skeleton className="h-11 w-full mb-4 rounded" />
              <Skeleton className="h-11 w-full mb-4 rounded" />
              <Skeleton className="h-11 w-full mb-4 rounded" />
              <Skeleton className="h-11 w-full mb-4 rounded" />

              <div className="col-span-1 md:col-span-2">
                <Skeleton className="h-11 w-full mb-4 rounded" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-end space-x-4">
              <Avatar
                img={avatarUrl || undefined}
                placeholderInitials={
                  user?.full_name ? getInitails(user?.full_name) : "- -"
                }
                size="xl"
                bordered
                statusPosition="bottom-right"
                rounded
                status={user?.is_active ? "online" : "offline"}
              />
              <div>
                <p className="text-gray-500 font-semibold text-xl capitalize">
                  {user?.title}
                </p>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                  {user?.full_name || "Loading..."}
                </h1>
              </div>
            </div>
            <p className="text-gray-800 text-md">
              {user?.bio ||
                "-- --- ----- ------ ---------  ------ ----- ------ ------"}
            </p>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Email" value={user?.email} />
              <ProfileField label="Phone" value={user?.phone} />
              <ProfileField label="Gender" value={user?.gender} />
              <ProfileField label="Title" value={user?.title} />
              <ProfileField label="Organization / Institution" value={user?.organization} />
              <ProfileField
                label="Mailing Address"
                value={user?.mailing_address}
              />
              <ProfileField label="City" value={user?.city} />
              <ProfileField label="State" value={user?.state} />
              <div className="col-span-1 md:col-span-2">
                <ProfileField label="ZIP Code" value={user?.zip_code} />
              </div>
              {!user?.is_staff && (
                <>
                  <div className="col-span-1 md:col-span-2">
                    <ProfileField
                      label="Membership Type"
                      value={membershipMap[`${user?.membership_type}`]}
                    />
                  </div>
                  <ProfileField
                    label="Payment Status"
                    value={user?.payment_status}
                  />
                  <ProfileField label="Plan Type" value={user?.plan_type} />
                  <ProfileField
                    label="Payment Method"
                    value={user?.payment_method || "Not Paid"}
                  />
                </>
              )}
            </div>

            {/* 🔵 Edit Profile Button */}
            <div className="flex justify-end mt-6">
              <Button color="blue" onClick={handleEditClick}>
                Edit Profile
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* 🔵 Edit Modal */}
      <Modal
        show={isModalOpen}
        position="center"
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        size="3xl"
      >
        <Modal.Header>Edit User Profile</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label value="Full Name" />
                <TextInput
                  {...register("full_name")}
                  color={errors.full_name ? "failure" : undefined}
                  helperText={errors.full_name?.message}
                />
              </div>
              <div>
                <Label value="Title" />
                <Select
                  {...register("title")}
                  color={errors.title ? "failure" : undefined}
                  helperText={errors.title?.message}
                >
                  <option value="">Select Membership Type</option>
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
                  <option value="">Select Membership Type</option>
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
                <TextInput
                  {...register("organization")}
                  color={errors.organization ? "failure" : undefined}
                  helperText={errors.organization?.message}
                />
              </div>
              <div>
                <Label value="City" />
                <TextInput
                  {...register("city")}
                  color={errors.city ? "failure" : undefined}
                  helperText={errors.city?.message}
                />
              </div>
              <div>
                <Label value="State" />
                <TextInput
                  {...register("state")}
                  color={errors.state ? "failure" : undefined}
                  helperText={errors.state?.message}
                />
              </div>
              <div>
                <Label value="ZIP Code" />
                <TextInput
                  {...register("zip_code")}
                  color={errors.zip_code ? "failure" : undefined}
                  helperText={errors.zip_code?.message}
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <Label value="Mailing Address" />
                <Textarea {...register("mailing_address")} rows={3} />
              </div>
              {!user?.is_staff && (
                <>
                  <div>
                    <Label value="Membership Type" />
                    <Select
                      {...register("membership_type")}
                      color={errors.membership_type ? "failure" : undefined}
                      helperText={errors.membership_type?.message}
                    >
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
                    <Select
                      {...register("payment_status")}
                      color={errors.payment_status ? "failure" : undefined}
                      helperText={errors.payment_status?.message}
                    >
                      <option value="">Select Membership Type</option>
                      {["Paid", "Unpaid"].map((opt: string) => (
                        <option key={opt} value={opt.toLowerCase()}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label value="Plan Type" />
                    <Select
                      {...register("plan_type")}
                      color={errors.plan_type ? "failure" : undefined}
                      helperText={errors.plan_type?.message}
                    >
                      <option value="">Select Membership Type</option>
                      {["Monthly", "Yearly"].map((opt: string) => (
                        <option key={opt} value={opt.toLowerCase()}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label value="Payment Method" />
                    <Select
                      {...register("payment_method")}
                      color={errors.payment_method ? "failure" : undefined}
                      helperText={errors.payment_method?.message}
                    >
                      <option value="">Select Membership Type</option>
                      {["Cash", "Transfer"].map((opt: string) => (
                        <option key={opt} value={opt.toLowerCase()}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                isProcessing={isSubmitting}
                disabled={isSubmitting}
                color="blue"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

// 🔵 Small reusable components
const ProfileField = ({ label, value }: { label: string; value: any }) => (
  <div>
    <Label value={label} className="text-sm font-medium text-gray-500 mb-1" />
    <TextInput value={value || "N/A"} readOnly shadow />
  </div>
);
