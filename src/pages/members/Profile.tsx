import { useState } from "react";
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
  level_of_learners: yup.string().required("Please select a level of learners"),
  bio: yup.string(),
  profile_pic: yup
    .mixed()
    .test("required", "File is required", (value) => {
      return value && Array.isArray(value) && value.length > 0;
    })
    .test("fileSize", "File size is too large", (value) => {
      return (
        value && value instanceof FileList && value[0]?.size <= FILE_SIZE_LIMIT
      );
    })
    .test("fileType", "Unsupported file format", (value) => {
      return value && SUPPORTED_FORMATS.includes((value as FileList)[0]?.type);
    }),
});

const passwordSchema = yup.object().shape({
  password: yup.string().min(6).required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const ProfileSettingsPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const [avatarUrl, setAvatarUrl] = useState("https://picsum.photos/200")
  const [showPhotoSelectionOpen, setShowPhotoSelectionOpen] = useState(false)
  const [showCaptureModal, setShowCaptureModal] = useState(false)

  const onSubmit = (data: any) => {
    console.log("Profile Update", data);
  };

  const onChangePassword = (data: any) => {
    console.log("Change Password", data);
  };

  const togglePhotoSelect = () => setShowPhotoSelectionOpen(prev=> !prev) 
  const toggleCaptureModal = () => setShowCaptureModal((prev) => !prev); 

  return (
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
                  src={avatarUrl}
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
                    <option>Mr</option>
                    <option>Ms</option>
                    <option>Dr</option>
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
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
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
              <Label value="Level of Learners" />
              <Select
                {...register("level_of_learners")}
                color={errors.level_of_learners ? "failure" : undefined}
                helperText={errors.level_of_learners?.message}
              >
                <option value="">Select Level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </Select>
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
              <Label value="New Password" />
              <TextInput
                type="password"
                icon={HiLockClosed}
                {...registerPassword("password")}
                color={passwordErrors.password ? "failure" : undefined}
                helperText={passwordErrors.password?.message}
              />
            </div>
            <div>
              <Label value="Confirm Password" />
              <TextInput
                type="password"
                icon={HiLockClosed}
                {...registerPassword("confirm_password")}
                color={passwordErrors.confirm_password ? "failure" : undefined}
                helperText={passwordErrors.confirm_password?.message}
              />
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
                  accept="image/*"
                  className="hidden"
                  {...register("profile_pic")}
                />
              </div>
              <p className="text-center text-blue-600">Pick from files</p>
            </label>
            <div
              onClick={() => {
                togglePhotoSelect()
                toggleCaptureModal()
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
      <Modal size="lg" position="center" show={showCaptureModal} onClose={toggleCaptureModal}>
        <Modal.Header>Capture New Profile Photo</Modal.Header>
        <Modal.Body>
          <CameraCapture
            onCapture={(url, filename) => {
              const file = dataUrlToFile(url, filename);
              setValue("profile_pic", file);
              setAvatarUrl(URL.createObjectURL(file));
              toggleCaptureModal();
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfileSettingsPage;
