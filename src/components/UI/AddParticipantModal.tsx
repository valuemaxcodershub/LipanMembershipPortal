import { useState } from "react";
import {
  Button,
  Modal,
  Label,
  TextInput,
  Select,
  Textarea,
  Checkbox,
  Radio,
} from "flowbite-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiFileText,
  FiBriefcase,
} from "react-icons/fi";
import countries from "../../data.json";
import ReactSelect, { components as ReactSelectComponents } from "react-select";
import { checkCode } from "../../utils/api/download";
import { toast } from "react-toastify";

// Presentation types from the original form
const presentationTypesOptions = [
  "Individual/Co-author(s) Presentation",
  "Poster Presentation",
  "Workshops",
  "Panel Presentation",
  "Special Presentation",
  "Special Sessions",
  "Exhibitions",
];

// ✅ Yup Validation Schema (updated to match original fields, removed payment-related fields)
const participantSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  title: yup.string().required("Title/Position is required"),
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
  participation: yup.string().required("Participation mode is required"),
  participationCategory: yup
    .string()
    .required("Participation category is required"),
  registrationFee: yup.string().required("Registration fee is required"),
  paperTitle: yup.string().nullable(),
  thematicArea: yup.string().nullable(),
  coAuthors: yup.string().nullable(),
  presentationTypes: yup.array().of(yup.string()).nullable(),
  lipanId: yup.string().nullable(),
  paymentMethod: yup.string().nullable(),
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
  const [code, setCode] = useState("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(participantSchema),
    mode: "onChange",
    defaultValues: {
      presentationTypes: [],
      country: "Nigeria",
      paymentMethod: "other",
    },
  });

  const selectedCategory = watch("participationCategory");
  const selectedCity = watch("city");
  const selectedCountry = watch("country");
  const registrationFee = watch("registrationFee");

  const getFeeOptions = () => {
    if (!selectedCountry || !selectedCategory || !selectedCity) return [];

    const countryData = countries.find((c) => c.name === selectedCountry);
    const isNigeria = selectedCountry === "Nigeria";
    const isAfrica = countryData?.region === "Africa" && !isNigeria;

    if (isNigeria) {
      return [
        { value: "Student – ₦20,000", label: "Student" },
        { value: "Member – ₦30,000", label: "Member" },
        { value: "Non-Member – ₦40,000", label: "Non-Member" },
      ];
    } else if (isAfrica) {
      return [
        { value: "Student – $20", label: "Student" },
        { value: "Regular – $100", label: "Regular" },
      ];
    } else {
      return [
        { value: "Student – $20", label: "Student" },
        { value: "Regular – $150", label: "Regular" },
      ];
    }
  };

  const handleCheck = async () => {
    setIsCheckingCode(true);
    const res = await checkCode(code);
    setResult(res || null);
    setIsCheckingCode(false);
  };

  const handleFormSubmit = async (data: any) => {
    const isFormValid = await trigger(undefined, { shouldFocus: true });
    if (!isFormValid) {
      setLoading(false);
      return;
    }
    if (
      registrationFee === "Member – ₦30,000" &&
      selectedCountry === "Nigeria" &&
      !result?.valid
    ) {
      toast.error("Please validate LiPAN Membership ID.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ ...data, lipanId: code || "" });
      reset();
      setCode("");
      setResult(null);
      onClose();
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setLoading(false);
    }
  };

  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: country.name,
    flag: country.flags.svg,
  }));

  const CustomOption = (props: any) => (
    <ReactSelectComponents.Option {...props}>
      <div className="flex items-center">
        <img
          src={props.data.flag}
          alt={`${props.data.label} flag`}
          className="w-6 h-4 mr-2 rounded shadow"
        />
        {props.data.label}
      </div>
    </ReactSelectComponents.Option>
  );

  const CustomSingleValue = (props: any) => (
    <ReactSelectComponents.SingleValue {...props}>
      <div className="flex items-center">
        <img
          src={props.data.flag}
          alt={`${props.data.label} flag`}
          className="w-6 h-4 mr-2 rounded shadow"
        />
        {props.data.label}
      </div>
    </ReactSelectComponents.SingleValue>
  );

  return (
    <Modal show={open} onClose={onClose} size="3xl" popup>
      <Modal.Header>Add New Participant</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-9">
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

          {/* Title/Position and Organization */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" value="Title/Position" />
              <TextInput
                color={errors.title ? "failure" : undefined}
                {...register("title")}
                placeholder="e.g., Professor"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">
                  {errors.title.message as string}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="organization"
                value="Organization / Institution"
              />
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
              <Label htmlFor="country" value="Country" />
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={countryOptions}
                    components={{
                      Option: CustomOption,
                      SingleValue: CustomSingleValue,
                    }}
                    placeholder="Select country"
                    isSearchable
                    classNamePrefix="react-select"
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.country
                          ? "#ff0000"
                          : base.borderColor,
                        boxShadow: errors.country
                          ? "0 0 0 1px #ff0000"
                          : base.boxShadow,
                        "&:hover": {
                          borderColor: errors.country
                            ? "#ff0000"
                            : base.borderColor,
                        },
                      }),
                    }}
                    onChange={(selected) =>
                      field.onChange(selected ? selected.value : "")
                    }
                    value={
                      countryOptions.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                  />
                )}
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>
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
          </div>

          {/* Participation Mode (matching original: physical/virtual) */}
          <div>
            <Label value="Preferred Mode of Participation" />
            <div className="flex gap-6 mt-2">
              <div className="flex items-center gap-2">
                <Radio
                  value="physical"
                  {...register("participation")}
                  id="physical"
                  color={errors.participation ? "failure" : undefined}
                />
                <Label htmlFor="physical">Physical</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio
                  value="virtual"
                  {...register("participation")}
                  id="virtual"
                  color={errors.participation ? "failure" : undefined}
                />
                <Label htmlFor="virtual">Virtual</Label>
              </div>
            </div>
            {errors.participation && (
              <p className="text-red-500 text-sm">
                {errors.participation.message as string}
              </p>
            )}
          </div>

          {/* Participation Category (matching original: presenting/not-presenting) */}
          <div>
            <Label
              htmlFor="participationCategory"
              value="Select Your Participation Category"
            />
            <Select
              color={errors.participationCategory ? "failure" : undefined}
              {...register("participationCategory")}
            >
              <option value="">Select category</option>
              <option value="presenting">Presenting</option>
              <option value="not-presenting">Not-Presenting</option>
            </Select>
            {errors.participationCategory && (
              <p className="text-red-500 text-sm">
                {errors.participationCategory.message as string}
              </p>
            )}
          </div>

          {/* Conditional Presentation Fields (if presenting) */}
          {selectedCategory === "presenting" && (
            <>
              {/* Paper Title */}
              <div>
                <Label
                  htmlFor="paperTitle"
                  value="Title of Paper/Presentation (optional)"
                />
                <TextInput
                  id="paperTitle"
                  icon={FiFileText}
                  color={errors.paperTitle ? "failure" : undefined}
                  {...register("paperTitle")}
                  placeholder="Enter title"
                />
                {errors.paperTitle && (
                  <p className="text-red-500 text-sm">
                    {errors.paperTitle.message as string}
                  </p>
                )}
              </div>

              {/* Thematic Area & Co-Authors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label value="Thematic Area (optional)" />
                  <Textarea
                    placeholder="Write here..."
                    {...register("thematicArea")}
                    rows={4}
                    color={errors.thematicArea ? "failure" : undefined}
                  />
                  {errors.thematicArea && (
                    <p className="text-red-500 text-sm">
                      {errors.thematicArea.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label value="Co-authors (if any)" />
                  <Textarea
                    placeholder="Write here..."
                    {...register("coAuthors")}
                    rows={4}
                    color={errors.coAuthors ? "failure" : undefined}
                  />
                  {errors.coAuthors && (
                    <p className="text-red-500 text-sm">
                      {errors.coAuthors.message as string}
                    </p>
                  )}
                </div>
              </div>

              {/* Presentation Types (multi-select with checkboxes) */}
              <div>
                <Label value="Types of Presentation (optional)" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {presentationTypesOptions.map((type, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Controller
                        name="presentationTypes"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value?.includes(type) || false}
                            onChange={(e) => {
                              const updated = e.target.checked
                                ? [...(field.value || []), type]
                                : (field.value || []).filter(
                                    (v: any) => v !== type
                                  );
                              field.onChange(updated);
                            }}
                            color={
                              errors.presentationTypes ? "failure" : undefined
                            }
                          />
                        )}
                      />
                      <Label htmlFor={`presentationType-${index}`}>
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.presentationTypes && (
                  <p className="text-red-500 text-sm">
                    {errors.presentationTypes.message as string}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Registration Fee (kept as number input, since no payment integration) */}
          <div>
            <Label htmlFor="registrationFee" value="Registration Fee (₦)" />
            {/* <TextInput
              type="number"
              color={errors.registrationFee ? "failure" : undefined}
              {...register("registrationFee")}
              placeholder="5000"
            /> */}
            <Select
              color={errors.registrationFee ? "failure" : undefined}
              {...register("registrationFee")}
              disabled={!selectedCountry || !selectedCity || !selectedCategory}
            >
              <option value="">
                {!selectedCountry || !selectedCategory || !selectedCity
                  ? "Fill country, city, and participation category"
                  : "Select category"}
              </option>
              {getFeeOptions().map((fee) => (
                <option value={fee.value}>{fee.label}</option>
              ))}
            </Select>
            {errors.registrationFee && (
              <p className="text-red-500 text-sm">
                {errors.registrationFee.message as string}
              </p>
            )}
          </div>

          {/* Lipan ID (Membership ID, optional) */}
          {/* Membership ID (Lipan ID) with Validation */}
          {registrationFee === "Member – ₦30,000" &&
            selectedCountry === "Nigeria" && (
              <div>
                <Label value="Enter your Membership ID" />
                <div className="flex flex-col md:flex-row gap-3">
                  <TextInput
                    id="lipanId"
                    type="text"
                    value={code}
                    placeholder="e.g., Li1234PAN"
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isCheckingCode || result?.valid}
                    color={result && !result.valid ? "failure" : undefined}
                  />
                  <Button
                    onClick={handleCheck}
                    color="blue"
                    disabled={isCheckingCode || result?.valid}
                    isProcessing={isCheckingCode}
                  >
                    Validate
                  </Button>
                </div>
                {result && (
                  <p
                    className={`${
                      result.valid ? "text-lime-500" : "text-red-500"
                    } text-sm mt-1`}
                  >
                    {result.message}
                  </p>
                )}
              </div>
            )}

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              color="blue"
              isProcessing={loading}
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Participant"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
