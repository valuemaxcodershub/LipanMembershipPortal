import { useEffect, useState } from "react";
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
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiLockClosed,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
} from "react-icons/hi";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaCamera } from "react-icons/fa";
import { BiFile } from "react-icons/bi";
import CameraCapture from "../../components/UI/CapturePhoto";
import { dataUrlToFile } from "../../utils/app/text";
import { PageMeta } from "../../utils/app/pageMetaValues";
import axios from "../../config/axios";
import PasswordInput from "../../components/UI/PasswordInput";
import { useApp } from "../../hooks/app";
import { toast } from "react-toastify";
import { Skeleton } from "../../components/UI/Skeleton";

const FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 2MB
const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
const MAX_WIDTH = 1200; // Maximum allowed width (px)
const MAX_HEIGHT = 630; // Maximum allowed height (px)

// ✅ Validation Schema
const profileSchema = yup.object().shape({
  title: yup.string().required("Please select your title"),
  gender: yup.string().required("Please select your gender"),
  full_name: yup.string().required("Full Name is required"),
  organization: yup.string().required("Organization is required"),
  mailing_address: yup.string().required("Mailing address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip_code: yup.string(),
  phone: yup.string().required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  areas_of_interest: yup
    .array()
    .min(1, "Please select at least one area of interest"),
  level_of_learners: yup
    .string()
    .required("Please select one level of learners"),
  bio: yup.string(),
  profile_pic: yup.mixed(),
  // .test("fileSize", "File size is too large", (value) => {
  //   return (
  //     value && value instanceof FileList && value[0]?.size <= FILE_SIZE_LIMIT
  //   );
  // })
  // .test("fileType", "Unsupported file format", (value) => {
  //   return value && SUPPORTED_FORMATS.includes((value as FileList)[0]?.type);
  // }),
});

const passwordSchema = yup.object().shape({
  old_password: yup
    .string()
    .min(6, "Current password must be at least 6 characters")
    .required("Current password is required"),
  new_password1: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
  new_password2: yup
    .string()
    .oneOf([yup.ref("new_password1")], "Passwords must match"),
});

type ProfileSettingsType = yup.InferType<typeof profileSchema>;
type PasswordChangeType = yup.InferType<typeof passwordSchema>;

const ProfileSettingsPage = () => {
  const { areasOfInterest, levelOfLearners } = useApp();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: passwordReset,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });
  const file = watch("profile_pic") as FileList;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showPhotoSelectionOpen, setShowPhotoSelectionOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showCaptureModal, setShowCaptureModal] = useState(false);

  const onSubmit = async (data: ProfileSettingsType) => {
    // const formattedData = {...data, level_of_learners: Number(data.level_of_learners), areas_of_interest: data.areas_of_interest.map(Number)};
    console.log(data);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "areas_of_interest") {
        value.forEach((keyValue: string) => {
          formData.append(key, keyValue);
        });
      } else if (key === "profile_pic" && value) {
        formData.append(key, (value as FileList)?.[0]);
        console.log((value as FileList)?.[0]);
      } else {
        formData.append(key, value as string);
      }
    });

    const toastId = toast.loading("Updating Profile changes....", {
      position: "top-center",
    });

    try {
      const response = await axios.patch("/auth/user/", formData);
      console.log(response);
      toast.update(toastId, {
        render: response.data?.detail || "Updates saved successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      fetchProfile();
    } catch (err: any) {
      console.error(err.response);
      toast.update(toastId, {
        render:
          err?.response?.data?.detail || "Error updating profile, try again",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const onChangePassword = async (data: PasswordChangeType) => {
    const toastId = toast.loading("Changing Account Password....", {
      position: "top-center",
    });
    try {
      const response = await axios.post("/auth/password/change/", data);
      passwordReset();
      toast.update(toastId, {
        render: response?.data?.detail || "Password change successfull",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err: any) {
      console.error(err);
      toast.update(toastId, {
        render: err?.response?.data?.detail || "Error changing password",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const togglePhotoSelect = () => setShowPhotoSelectionOpen((prev) => !prev);
  const toggleCaptureModal = () => setShowCaptureModal((prev) => !prev);

  const fetchProfile = async () => {
    setIsFetching(true);
    try {
      const { data } = await axios.get("/accounts/user/profile/");
      // console.log(data)
      const { profile_pic, ...otherData } = data;
      reset({ ...otherData, profile_pic: undefined });
      setAvatarUrl(
        profile_pic ? `${import.meta.env.VITE_API_URL + profile_pic}` : null
      );
      setIsFetching(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    (async () => {
      if (file.length) {
        console.log(file);
        const valid = await trigger(["profile_pic"]);
        console.log(valid);
        if (!valid) {
          return toast.error(errors.profile_pic?.message as string);
        }
        togglePhotoSelect();
        const url = URL.createObjectURL(file[0]);
        console.log(url);
        setAvatarUrl(url);
      }
    })();
  }, [file]);

  if (isFetching) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <div className="grid grid-cols-1 gap-6">
          {/* Profile Info Form Skeleton */}
          <Skeleton className="h-[380px] w-full" />
          {/* Password Change Form Skeleton */}
          <Skeleton className="h-[260px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta>
        <title>Profile Settings | LIPAN</title>
        <meta
          name="description"
          content="Manage your profile settings and update your information."
        />
      </PageMeta>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">
          Profile & Account Settings
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {/* 🔵 Profile Info Form */}
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-5 gap-4">
                <div className="relative flex items-center gap-4 mb-4 col-span-2">
                  <img
                    src={avatarUrl || "/avatar_placeholder.png"}
                    className="h-[300px] w-full rounded-xl object-cover"
                    alt="User avatar"
                  />
                  <button
                    onClick={togglePhotoSelect}
                    type="button"
                    // disabled={isSubmitting}
                    className="absolute bottom-2 right-2 bg-white p-3 rounded-full cursor-pointer"
                  >
                    <FaCamera className="text-blue-600" size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 col-span-3 gap-4">
                  <div>
                    <Label value="Full Name" />
                    <TextInput
                      icon={HiOutlineUser}
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
                      <option value="">Select Title</option>
                      <option value="mr">Mr.</option>
                      <option value="ms">Ms.</option>
                      <option value="dr">Dr.</option>
                      <option value="prof">Prof.</option>
                    </Select>
                  </div>
                  <div>
                    <Label value="Gender" />
                    <Select
                      {...register("gender")}
                      color={errors.gender ? "failure" : undefined}
                      helperText={errors.gender?.message}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label value="Email" />
                  <TextInput
                    icon={HiOutlineMail}
                    type="email"
                    {...register("email")}
                    color={errors.email ? "failure" : undefined}
                    helperText={errors.email?.message}
                  />
                </div>
                <div>
                  <Label value="Phone Number" />
                  <TextInput
                    icon={HiOutlinePhone}
                    {...register("phone")}
                    color={errors.phone ? "failure" : undefined}
                    helperText={errors.phone?.message}
                  />
                </div>
              </div>

              <div>
                <Label value="Organization" />
                <TextInput
                  icon={HiOutlineOfficeBuilding}
                  {...register("organization")}
                  color={errors.organization ? "failure" : undefined}
                  helperText={errors.organization?.message}
                />
              </div>

              <div>
                <Label value="Mailing Address" />
                <Textarea
                  rows={6}
                  {...register("mailing_address")}
                  color={errors.mailing_address ? "failure" : undefined}
                  helperText={errors.mailing_address?.message}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
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
              </div>

              <div>
                <Label value="Short Bio / About You" />
                <Textarea
                  rows={10}
                  {...register("bio")}
                  color={errors.bio ? "failure" : undefined}
                  helperText={errors.bio?.message}
                />
              </div>

              <h3 className="text-xl font-semibold text-gray-700 dark:text-white pt-32 mb-4">
                Change Preferences
              </h3>

              <div className="mb-4">
                <Label value="Level of Learners" />
                <Select
                  {...register("level_of_learners")}
                  helperText={errors.level_of_learners?.message}
                  color={errors.level_of_learners ? "failure" : undefined}
                >
                  <option value="">---Select---</option>
                  {levelOfLearners.map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <div
                  className={`mb-4 flex flex-wrap gap-3 rounded-md p-5 border border-${errors.areas_of_interest ? "red-500" : "gray-300"}`}
                >
                  {areasOfInterest.map((interest, index) => (
                    <label
                      key={index}
                      htmlFor={`checkbox-${index}`}
                      className="flex flex-grow items-center justify-center gap-2 rounded-lg border-2 border-gray-200 p-2 text-[13.5px] shadow-sm transition-all hover:shadow-lg peer-checked:border-blue-500"
                    >
                      <input
                        id={`checkbox-${index}`}
                        type="checkbox"
                        value={interest.id}
                        defaultChecked={watch("areas_of_interest")?.includes(
                          interest.id
                        )}
                        {...register("areas_of_interest")}
                        className="peer rounded-md"
                      />
                      <p className="cursor-pointer group dark:text-white peer-checked:text-blue-600">
                        {interest.name}
                      </p>
                    </label>
                  ))}
                </div>
                {errors.areas_of_interest && (
                  <i className="text-sm text-red-500">
                    {errors.areas_of_interest.message}
                  </i>
                )}
              </div>

              <Button color="blue" type="submit" fullSized>
                Save Changes
              </Button>
            </form>
          </Card>

          {/* 🟣 Password Change Form */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
              Change Password
            </h3>

            <form
              onSubmit={handlePasswordSubmit(onChangePassword)}
              className="space-y-4"
            >
              <div>
                <Label value="Current Password" />
                <PasswordInput
                  {...registerPassword("old_password")}
                  error={passwordErrors.old_password}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
        </div>

        <Modal
          size="lg"
          position="center"
          show={showPhotoSelectionOpen}
          onClose={togglePhotoSelect}
        >
          <Modal.Header>Change Profile Picture</Modal.Header>
          <Modal.Body>
            <div className="w-full grid grid-cols-1  md:grid-cols-2 gap-4 p-5">
              <label
                htmlFor="avatar-upload"
                className="block space-y-3 w-[100%] cursor-pointer rounded-md border border-blue-600 p-3"
              >
                <div className="w-fit mx-auto">
                  <BiFile size={45} className="text-blue-600" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept={SUPPORTED_FORMATS.join(", ")}
                    className="hidden"
                    {...register("profile_pic")}
                  />
                </div>
                <p className="text-center text-blue-600">Pick from files</p>
              </label>
              <div
                onClick={() => {
                  togglePhotoSelect();
                  toggleCaptureModal();
                }}
                className="rounded-md space-y-3 w-[100%] cursor-pointer border border-blue-600 p-3"
              >
                <div className="w-fit mx-auto">
                  <FaCamera size={45} className="text-blue-600" />
                </div>
                <p className="text-center text-blue-600">Take a selfie</p>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          size="lg"
          position="center"
          show={showCaptureModal}
          onClose={toggleCaptureModal}
        >
          <Modal.Header>Capture New Profile Photo</Modal.Header>
          <Modal.Body>
            <CameraCapture
              onCapture={(url, filename) => {
                const file = dataUrlToFile(url, filename);
                setValue("profile_pic", [file]);
                toggleCaptureModal();
              }}
            />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default ProfileSettingsPage;
