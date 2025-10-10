import { useState } from "react";
import { Button, Modal, Label, TextInput, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiCreditCard,
  FiBriefcase,
} from "react-icons/fi";

// ✅ Yup Validation Schema
const participantSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  title: yup.string().required("Title is required"),
  organization: yup.string().required("Organization is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9+\-() ]*$/, "Invalid phone number")
    .required("Phone number is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  participation: yup.string().required("Participation type is required"),
  participationCategory: yup
    .string()
    .required("Participation category is required"),
  registrationFee: yup
    .number()
    .typeError("Registration fee must be a number")
    .positive()
    .required("Registration fee is required"),
  paperTitle: yup.string().nullable(),
  thematicArea: yup.string().nullable(),
  coAuthors: yup.string().nullable(),
  presentationTypes: yup.string().required("Presentation type is required"),
  paymentTrxId: yup.string().required("Payment Transaction ID is required"),
  paymentTrxRef: yup.string().nullable(),
  paymentMethod: yup.string().required("Payment method is required"),
  lipanId: yup.string().nullable(),
});

interface AddParticipantModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
}

export default function AddParticipantModal({
  open,
  onClose,
  onSubmit,
}: AddParticipantModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(participantSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={open} onClose={onClose} size="3xl" popup>
      <Modal.Header>Add New Participant</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" value="First Name" />
              <TextInput
                icon={FiUser}
                color={errors.firstName ? "failure" : undefined}
                {...register("firstName")}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" value="Last Name" />
              <TextInput
                icon={FiUser}
                color={errors.lastName ? "failure" : undefined}
                {...register("lastName")}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" value="Title" />
            <Select
              color={errors.title ? "failure" : undefined}
              {...register("title")}
            >
              <option value="">Select Title</option>
              <option>Mr</option>
              <option>Mrs</option>
              <option>Miss</option>
              <option>Dr</option>
              <option>Prof</option>
            </Select>
            {errors.title && (
              <p className="text-red-500 text-sm">
                {errors.title.message as string}
              </p>
            )}
          </div>

          {/* Organization */}
          <div>
            <Label htmlFor="organization" value="Organization / Institution" />
            <TextInput
              icon={FiBriefcase}
              color={errors.organization ? "failure" : undefined}
              {...register("organization")}
              placeholder="ABC University"
            />
            {errors.organization && (
              <p className="text-red-500 text-sm">
                {errors.organization.message as string}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                icon={FiMail}
                type="email"
                color={errors.email ? "failure" : undefined}
                {...register("email")}
                placeholder="example@mail.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" value="Phone" />
              <TextInput
                icon={FiPhone}
                color={errors.phone ? "failure" : undefined}
                {...register("phone")}
                placeholder="+234..."
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">
                  {errors.phone.message as string}
                </p>
              )}
            </div>
          </div>

          {/* City & Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" value="City" />
              <TextInput
                color={errors.city ? "failure" : undefined}
                {...register("city")}
                placeholder="Lagos"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">
                  {errors.city.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="country" value="Country" />
              <TextInput
                icon={FiGlobe}
                color={errors.country ? "failure" : undefined}
                {...register("country")}
                placeholder="Nigeria"
              />
              {errors.country && (
                <p className="text-red-500 text-sm">
                  {errors.country.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Conference Info */}
          <div>
            <Label htmlFor="participation" value="Participation Type" />
            <Select
              color={errors.participation ? "failure" : undefined}
              {...register("participation")}
            >
              <option value="">Select</option>
              <option>Attendee</option>
              <option>Presenter</option>
              <option>Panelist</option>
            </Select>
            {errors.participation && (
              <p className="text-red-500 text-sm">
                {errors.participation.message as string}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="participationCategory"
              value="Participation Category"
            />
            <Select
              color={errors.participationCategory ? "failure" : undefined}
              {...register("participationCategory")}
            >
              <option value="">Select</option>
              <option>Student</option>
              <option>Academic</option>
              <option>Professional</option>
            </Select>
            {errors.participationCategory && (
              <p className="text-red-500 text-sm">
                {errors.participationCategory.message as string}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="presentationTypes" value="Presentation Type" />
            <Select
              color={errors.presentationTypes ? "failure" : undefined}
              {...register("presentationTypes")}
            >
              <option value="">Select</option>
              <option>Oral</option>
              <option>Poster</option>
              <option>Virtual</option>
            </Select>
            {errors.presentationTypes && (
              <p className="text-red-500 text-sm">
                {errors.presentationTypes.message as string}
              </p>
            )}
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentTrxId" value="Payment Transaction ID" />
              <TextInput
                icon={FiCreditCard}
                color={errors.paymentTrxId ? "failure" : undefined}
                {...register("paymentTrxId")}
                placeholder="TRX12345"
              />
              {errors.paymentTrxId && (
                <p className="text-red-500 text-sm">
                  {errors.paymentTrxId.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="paymentMethod" value="Payment Method" />
              <Select
                color={errors.paymentMethod ? "failure" : undefined}
                {...register("paymentMethod")}
              >
                <option value="">Select</option>
                <option>Bank Transfer</option>
                <option>Mobile Money</option>
                <option>Card</option>
              </Select>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm">
                  {errors.paymentMethod.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Registration Fee */}
          <div>
            <Label htmlFor="registrationFee" value="Registration Fee (₦)" />
            <TextInput
              type="number"
              color={errors.registrationFee ? "failure" : undefined}
              {...register("registrationFee")}
              placeholder="5000"
            />
            {errors.registrationFee && (
              <p className="text-red-500 text-sm">
                {errors.registrationFee.message as string}
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" isProcessing={loading} disabled={loading}>
              {loading ? "Saving..." : "Add Participant"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
