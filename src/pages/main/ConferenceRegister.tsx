import { useRef, useState, useEffect } from "react";
import {
  Button,
  Card,
  Checkbox,
  Label,
  Radio,
  TextInput,
  Accordion,
  Select,
  Textarea,
  Datepicker,
} from "flowbite-react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiFileText,
  FiSmartphone,
  FiCreditCard,
} from "react-icons/fi";
import { HiOutlineCreditCard } from "react-icons/hi";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SelectableSection from "../../components/UI/SelectionCard";
import { usePaystackPayment } from "react-paystack";
import PaymentProcessingModal from "../../components/UI/ConferencePaymentModal";
import ReactSelect, { components as ReactSelectComponents } from "react-select";
import { Country } from "../../types/_all";
import countryData from "../../data.json";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { usePayment } from "../../hooks/payment";
import { checkCode } from "../../utils/api/download";

// ----------------------
// Validation Schema (Yup)
// ----------------------
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  title: yup.string().required("Title/Position is required"),
  organization: yup.string().required("Organization/Institution is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone/WhatsApp is required"),
  city: yup.string().required("City of residence is required"),
  country: yup.string().required("Country is required"),
  participation: yup.string().required("Participation mode is required"),
  participationCategory: yup
    .string()
    .required("Participation category is required"),
  registrationFee: yup.string().required("Please select a registration fee"),
  paperTitle: yup.string().nullable(),
  thematicArea: yup.string().nullable(),
  coAuthors: yup.string().nullable(),
  paymentMethod: yup.string().nullable(),
  lipanId: yup.string().nullable(),
  presentationTypes: yup.array().default([]),
  // proposedTransport: yup.string().required("This field is required"),
  // reserveHotel: yup.string().required("This field is required"),
  // makeSiteVisits: yup.string().required("This field is required"),
  // dateOfArrival: yup.string().required("This field is required"),
  paymentTrxId: yup.string(),
  paymentTrxRef: yup.string(),
});

type FormValues = yup.InferType<typeof schema>;

const presentationTypes = [
  "Individual/Co-author(s) Presentation",
  "Poster Presentation",
  "Workshops",
  "Panel Presentation",
  "Special Presentation",
  "Special Sessions",
  "Exhibitions",
];



export default function RegistrationPage() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
    control,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      // dateOfArrival: new Date().toISOString(),
      country: "Nigeria",
      paymentTrxId: "",
      paymentTrxRef: "",
      paymentMethod: "",
      lipanId: "",
    },
  });

  const { processPayment } = usePayment();

  const formRef = useRef<HTMLFormElement | null>(null);
  const selectedFee = watch("registrationFee");
  const formValues = watch();

  const selectedCountry = watch("country");
  const selectedCity = watch("city");
  const selectedCategory = watch("participationCategory");
  const participationMode = watch("participation");

  const [showModal, setShowModal] = useState(false);
  const [countries, setCountries] = useState<Country[]>(countryData as any);
  const [code, setCode] = useState("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);

  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    setIsCheckingCode(true);
    const res = await checkCode(code);
    setResult(res);
    setIsCheckingCode(false);
  };

  const [selected, setSelected] = useState<string>("");

  const methods = [
    { label: "Paystack", value: "paystack", icon: <FiSmartphone /> },
    { label: "Other Methods", value: "other", icon: <FiCreditCard /> },
  ];

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  // const getCountries = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       "https://www.apicountries.com/countries"
  //     );
  //     console.log(data);
  //     // setCountries(data.sort((a, b) => a.name.localeCompare(b.name)));
  //   } catch (err) {
  //     console.error("Error fetching the country data:", err);
  //   }
  // };

  // useEffect(() => {
  //   getCountries();
  // }, []);

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

  let amount = 0;
  let currency: "NGN" | "USD" = "NGN";

  if (selectedFee) {
    if (selectedFee.includes("₦")) {
      currency = "NGN";
      amount = parseInt(selectedFee.replace(/[^0-9]/g, ""), 10);
    } else if (selectedFee.includes("$")) {
      currency = "USD";
      amount = parseInt(selectedFee.replace(/[^0-9]/g, ""), 10);
    }
  }

  // Paystack config
  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: watch("email"), // replace with actual user email
    amount: amount * 100, // Paystack expects amount in kobo/cents
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, // replace with your Paystack public key
    currency: currency,
    metadata: {
      custom_fields: [
        {
          display_name: "Purpose",
          variable_name: "purpose",
          value: "conference",
        },
        {
          display_name: "Registration Data",
          variable_name: "registration_data",
          value: { ...formValues, lipanId: code || "" },
        },
      ],
    },
  };

  const onSuccess = async (reference: any) => {
    console.log("Payment successful:", reference);
    try {
      await processPayment({
        // transactionId: reference.transaction,
        transaction_ref: reference.trxref,
        // amount: reference.amount,
        // email: reference.email,
      });
      setValue("paymentTrxId", reference.transaction);
      setValue("paymentTrxRef", reference.trxref);
      setValue("paymentMethod", selected);
      setValue("lipanId", code || "");
      setShowModal(true);
    } catch (error) {
      console.error("Payment processing error:", error);
    }
  };

  const onClose = () => {
    console.log("Payment popup closed");
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const startPayment = () => {
    initializePayment({ onSuccess, onClose });
  };

  const initializeRegister = async () => {
    const isFormValid = await trigger(undefined, { shouldFocus: true });
    if (!isFormValid) return;
    if (selectedFee === "Member – ₦30,000" && !code) {
      toast.error("Please enter and validate your Membership ID.");
      return;
    }
    if (code && !result?.valid) {
      toast.error("Validate your membership id to continue.");
      return;
    }
    if (selected && selected === "paystack") {
      startPayment();
    } else {
      setValue("paymentTrxId", "N/A");
      setValue("paymentTrxRef", "N/A");
      setValue("paymentMethod", selected);
      setValue("lipanId", code || "");
      setShowModal(true);
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
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}

      <header
        className="w-full text-white px-2 lg:px-0 py-20 pt-36 text-center shadow-md"
        style={{
          backgroundImage: "url(/bg-grad.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className="text-2xl lg:text-4xl font-extrabold">
          Conference Registration
        </h1>
        <p className="mt-3 text-md lg:text-lg font-medium">
          Pan African Literacy for All Conference 2025 – Join us in shaping
          Africa’s future
        </p>
      </header>

      <main className="flex-1 container mx-auto px-4 lg:px-24 py-12">
        <div className="grid grid-cols-1 gap-10 relative">
          {/* Illustration / Sidebar */}
          {/* <div className="hidden lg:flex items-start justify-center">
            <img
              src="/student-with-diploma.svg"
              alt="Conference Illustration"
              className="w-80 h-80 sticky top-[70px]"
            />
          </div> */}
          {/* Form Section */}
          <Card className="col-span-3 p-0 lg:p-8 shadow-xl m-auto w-full max-w-4xl">
            <h2 className="text-2xl lg:text-4xl font-extrabold mx-auto mb-6 p-3 text-black rounded-xl w-fit">
              Registration Form
            </h2>

            <form ref={formRef} className="space-y-12">
              {/* Name */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName" value="First Name" />
                  <TextInput
                    id="firstName"
                    placeholder="Enter first name"
                    icon={FiUser}
                    {...register("firstName")}
                    color={errors.firstName ? "failure" : undefined}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" value="Last Name" />
                  <TextInput
                    id="lastName"
                    placeholder="Enter last name"
                    icon={FiUser}
                    {...register("lastName")}
                    color={errors.lastName ? "failure" : undefined}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Title / Org */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title" value="Title/Position" />
                  <TextInput
                    id="title"
                    placeholder="Your position"
                    {...register("title")}
                    color={errors.title ? "failure" : undefined}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="organization"
                    value="Organization/Institution"
                  />
                  <TextInput
                    id="organization"
                    placeholder="Institution name"
                    {...register("organization")}
                    color={errors.organization ? "failure" : undefined}
                  />
                  {errors.organization && (
                    <p className="text-red-500 text-sm">
                      {errors.organization.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="email" value="Email" />
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    icon={FiMail}
                    color={errors.email ? "failure" : undefined}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" value="Phone/WhatsApp" />
                  <TextInput
                    id="phone"
                    type="tel"
                    placeholder="+234 ..."
                    icon={FiPhone}
                    {...register("phone")}
                    color={errors.phone ? "failure" : undefined}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Participation Mode */}
              <div>
                <Label value="Preferred Mode of Participation" />
                <div className="flex gap-6 mt-2">
                  <div className="grid grid-cols-2 place-items-center">
                    <Radio
                      value="physical"
                      {...register("participation")}
                      id="physical"
                      color={errors.participation ? "failure" : undefined}
                    />
                    <Label htmlFor="physical">Physical</Label>
                  </div>
                  <div className="grid grid-cols-2 place-items-center">
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
                    {errors.participation.message}
                  </p>
                )}
              </div>

              <div>
                <Label value="Select Your Participation Category" />
                <div className="mt-2">
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
                      {errors.participationCategory.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Paper Title */}
              {selectedCategory === "presenting" && (
                <>
                  <div>
                    <Label
                      htmlFor="paperTitle"
                      value="Title of Paper/Presentation (optional)"
                    />
                    <TextInput
                      id="paperTitle"
                      placeholder="Enter title"
                      icon={FiFileText}
                      {...register("paperTitle")}
                      color={errors.paperTitle ? "failure" : undefined}
                    />
                    {errors.paperTitle && (
                      <p className="text-red-500 text-sm">
                        {errors.paperTitle.message}
                      </p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label value="Thematic Area (optional)" />
                      <Textarea
                        placeholder="Write here..."
                        {...register("thematicArea")}
                        required
                        rows={4}
                        color={errors.thematicArea ? "failure" : undefined}
                      />
                      {errors.thematicArea && (
                        <p className="text-red-500 text-sm">
                          {errors.thematicArea.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label value="Co-authors (if-any)" />
                      <Textarea
                        placeholder="Write here..."
                        {...register("coAuthors")}
                        required
                        rows={4}
                        color={errors.coAuthors ? "failure" : undefined}
                      />
                      {errors.coAuthors && (
                        <p className="text-red-500 text-sm">
                          {errors.coAuthors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label value="Types of presentation" />
                    <SelectableSection
                      options={presentationTypes}
                      multiple
                      value={watch("presentationTypes") as string[]}
                      onChange={(val) =>
                        setValue("presentationTypes", val as string[])
                      }
                      renderItem={(item, isSelected) => (
                        <div className="flex items-center gap-3 px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all">
                          <Checkbox
                            color="blue"
                            checked={isSelected}
                            readOnly
                          />
                          <span className="text-sm text-gray-800 dark:text-gray-100">
                            {item as string}
                          </span>
                        </div>
                      )}
                    />
                    {errors.presentationTypes && (
                      <p className="text-red-500 text-sm">
                        {errors.presentationTypes.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Location */}
              <div className="grid gap-4 md:grid-cols-2">
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
                        isDisabled={!!selectedFee}
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
                    <p className="text-red-500 text-sm">
                      {errors.country.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city" value="City" />
                  <TextInput
                    id="city"
                    placeholder="City of residence"
                    {...register("city")}
                    color={errors.city ? "failure" : undefined}
                    disabled={!!selectedFee}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Registration Fees */}
              {selectedCountry && selectedCategory && selectedCity && (
                <div>
                  <Label value="Registration Type" />
                  <Select
                    disabled={!!selectedFee}
                    color={errors.registrationFee ? "failure" : undefined}
                    {...register("registrationFee")}
                  >
                    <option value="">Select category</option>
                    {getFeeOptions().map((fee) => (
                      <option value={fee.value}>{fee.label}</option>
                    ))}
                  </Select>
                  {errors.registrationFee && (
                    <p className="text-red-500 text-sm">
                      {errors.registrationFee.message}
                    </p>
                  )}

                  {selectedFee === "Member – ₦30,000" &&
                    selectedCountry === "Nigeria" && (
                      <div className="mt-10">
                        <Label value="Enter your Membership Id" />
                        <div className="w-full mx-auto rounded-xl border p-2">
                          <div className="flex flex-col md:flex-row gap-3 lg:gap-5">
                            <TextInput
                              id="codeInput"
                              type="text"
                              value={code}
                              placeholder="Enter ID here..."
                              onChange={(e) => setCode(e.target.value)}
                              required
                              disabled={isCheckingCode || result?.valid}
                              className="rounded-r-none w-full"
                              color={
                                result && !result.valid ? "failure" : undefined
                              }
                            />
                            <Button
                              onClick={handleCheck}
                              color="blue"
                              disabled={isCheckingCode || result?.valid}
                              isProcessing={isCheckingCode}
                              className=""
                            >
                              Validate
                            </Button>
                          </div>
                        </div>
                        {result && (
                          <p
                            className={`${
                              result.valid ? "text-lime-500" : "text-red-500"
                            } text-sm`}
                          >
                            {result?.message}
                          </p>
                        )}
                      </div>
                    )}

                  <div className="mt-10">
                    <Label value="Select Payment Method" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {methods.map((method) => {
                        const isSelected = selected === method.value;
                        return (
                          <div
                            key={method.value}
                            onClick={() => handleSelect(method.value)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? "border-blue-600"
                                  : "border-gray-400"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl text-blue-500">
                                {method.icon}
                              </span>
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                {method.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedFee && selected && (
                    <div className="flex justify-center mt-8">
                      <Card className="w-full shadow-lg border rounded-2xl lg:p-6">
                        {selectedFee === "Student – ₦20,000" && (
                          <p className="p-2 lg:p-5 rounded-xl border-l-4 border-blue-600 text-sm lg:text-md shadow">
                            <span className="text-md lg:text-lg font-bold">
                              Note:
                            </span>{" "}
                            You will be required to provide your student ID on
                            conference entry
                          </p>
                        )}
                        {/* Header */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                          Registration Checkout
                        </h2>

                        <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full">
                          {/* Fee Row */}
                          <div className="flex flex-col md:flex-row md:items-center gap-5 justify-start border-b pb-4 w-full lg:w-3/4">
                            <span className="text-gray-600 text-sm md:text-lg">
                              Conference Registration Fee:
                            </span>
                            <span className="text-blue-600 font-extrabold text-lg md:text-xl">
                              {currency} {amount}
                            </span>
                          </div>

                          {/* Pay Button */}
                          <Button
                            onClick={initializeRegister}
                            gradientDuoTone="purpleToBlue"
                            size="md"
                            type="button"
                            className="w-full lg:w-1/4 flex items-center justify-center gap-2"
                          >
                            <HiOutlineCreditCard className="text-lg h-5 mr-2" />
                            {selected === "paystack"
                              ? "Pay Now"
                              : "Pay with Other Methods"}
                          </Button>
                        </div>

                        {/* Additional Info */}

                        <p className="text-gray-500 text-xs md:text-sm">
                          Please confirm your payment details before proceeding.
                        </p>
                      </Card>
                    </div>
                  )}
                </div>
              )}

              {/* Submit */}
              {/* <Button
                type="button"
                onClick={startPayment}
                className="w-full mt-6 text-white !bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
              >
                Proceed
              </Button> */}
            </form>
          </Card>
        </div>

        <PaymentProcessingModal
          title={
            selected === "other"
              ? "Processing Submission"
              : "Payment Successful"
          }
          isOpen={showModal}
          transactionData={formValues}
          onClose={() => {
            reset();
            setShowModal(false);
          }}
        />
      </main>
    </div>
  );
}
