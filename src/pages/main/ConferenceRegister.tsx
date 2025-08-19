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
import { FiUser, FiMail, FiPhone, FiGlobe, FiFileText } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SelectableSection from "../../components/UI/SelectionCard";
import { usePaystackPayment } from "react-paystack";
import PaymentProcessingModal from "../../components/UI/ConferencePaymentModal";
import NavigationBar from "../../components/UI/MainSiteNav";
import ReactSelect, { components as ReactSelectComponents } from "react-select";
import { Country } from "../../types/_all";
import axios from "axios";
import countryData from "../../data.json";

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
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  participation: yup.string().required("Participation mode is required"),
  participationCategory: yup
    .string()
    .required("Participation category is required"),
  registrationFee: yup.string().required("Please select a registration fee"),
  paperTitle: yup.string().nullable(),
  thematicArea: yup.string().nullable(),
  coAuthors: yup.string().nullable(),
  presentationTypes: yup
    .array()
    .min(1, "Presentation type is required")
    .default([]),
  proposedTransport: yup.string().required("This field is required"),
  reserveHotel: yup.string().required("This field is required"),
  makeSiteVisits: yup.string().required("This field is required"),
  dateOfArrival: yup.string().required("This field is required"),
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

/**
 * Information about a country.
 */

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
    mode: "onBlur",
    defaultValues: {
      dateOfArrival: new Date().toISOString(),
      paymentTrxId: "",
      paymentTrxRef: "",
    },
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const selectedFee = watch("registrationFee");
  const formValues = watch();

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const selectedCategory = watch("participationCategory");
  const participationMode = watch("participation");

  const [showModal, setShowModal] = useState(false);
  const [countries, setCountries] = useState<Country[]>(countryData);

  const getCountries = async () => {
    try {
      const { data } = await axios.get(
        "https://www.apicountries.com/countries"
      );
      console.log(data);
      // setCountries(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error("Error fetching the country data:", err);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  const getFeeOptions = () => {
    if (!selectedCountry || !selectedCategory || !selectedState) return [];

    if (participationMode === "virtual") {
      return [{ value: "Free – $0", label: "Free" }];
    }

    const countryData = countries.find((c) => c.name === selectedCountry);
    const isNigeria = selectedCountry === "Nigeria";
    const isAfrica = countryData?.region === "Africa" && !isNigeria;

    if (isNigeria) {
      return [
        { value: "Member – ₦30,000", label: "Member – ₦30,000" },
        { value: "Non-Member – ₦40,000", label: "Non-Member – ₦40,000" },
      ];
    } else if (isAfrica) {
      return [
        { value: "Student – $20", label: "Student – $20" },
        { value: "Regular – $100", label: "Regular – $100" },
      ];
    } else {
      return [
        { value: "Student – $20", label: "Student – $20" },
        { value: "Regular – $150", label: "Regular – $150" },
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
  };

  const onSuccess = (reference: any) => {
    console.log("Payment successful:", reference);
    setValue("paymentTrxId", reference.transaction);
    setValue("paymentTrxRef", reference.trxref);
    setShowModal(true);
  };

  const onClose = () => {
    console.log("Payment popup closed");
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const startPayment = async () => {
    const isFormValid = await trigger();
    if (!isFormValid) return;
    if (participationMode === "virtual") {
      // Skip payment for virtual participation
      setValue("paymentTrxId", "virtual-free");
      setValue("paymentTrxRef", "virtual-free");
      setShowModal(true);
      return;
    }
    initializePayment({ onSuccess, onClose });
  };
  // const onSubmit = (data: FormValues) => {
  //   console.log("Form submitted:", data);
  //   alert("Registration submitted successfully!");
  // };

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="fixed flex justify-center top-5 w-full z-50 xl:px-32">
        <NavigationBar />
      </div>
      <header
        className="w-full text-white py-20 pt-36 text-center shadow-md"
        style={{
          backgroundImage: "url(/bg-grad.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className="text-4xl font-extrabold">Conference Registration</h1>
        <p className="mt-3 text-lg font-medium">
          Pan African Literacy for All Conference 2025 – Join us in shaping
          Africa’s future
        </p>
      </header>

      <main className="flex-1 container mx-auto px-4 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
          {/* Illustration / Sidebar */}
          <div className="hidden lg:flex items-start justify-center">
            <img
              src="/student-with-diploma.svg"
              alt="Conference Illustration"
              className="w-80 h-80 sticky top-[70px]"
            />
          </div>
          {/* Form Section */}
          <Card className="col-span-2 p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 p-3 text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl w-fit">
              Registration form
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
                  <Label htmlFor="state" value="State" />
                  <TextInput
                    id="state"
                    placeholder="State of residence"
                    {...register("state")}
                    color={errors.state ? "failure" : undefined}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm">
                      {errors.state.message}
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
                    <option value="presenter">Presenter</option>
                    <option value="participant/observer">
                      Participant / Observer
                    </option>
                    <option value="exhibitor">Exhibitor</option>
                    <option value="sponsor">Sponsor</option>
                  </Select>
                  {errors.participationCategory && (
                    <p className="text-red-500 text-sm">
                      {errors.participationCategory.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Registration Fees */}
              {selectedCountry && selectedCategory && selectedState && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Registration Fees
                  </h3>
                  <div
                    className={`rounded-xl ${
                      errors.registrationFee ? "border border-[#ff0000]" : null
                    }`}
                  >
                    <div className="space-y-3 p-4">
                      {getFeeOptions().map((fee) => (
                        <div
                          key={fee.value}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="radio"
                            value={fee.value}
                            {...register("registrationFee")}
                            id={fee.value}
                          />
                          <Label htmlFor={fee.value}>{fee.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {errors.registrationFee && (
                    <p className="text-red-500 text-sm">
                      {errors.registrationFee.message}
                    </p>
                  )}
                </div>
              )}

              {/* Paper Title */}
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
                      <Checkbox color="blue" checked={isSelected} readOnly />
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

              <div>
                <Label
                  htmlFor="proposedTransport"
                  value="Proposed means of transport"
                />
                <TextInput
                  id="proposedTransport"
                  placeholder="e.g car, plane e.t.c..."
                  icon={FiGlobe}
                  {...register("proposedTransport")}
                  color={errors.proposedTransport ? "failure" : undefined}
                />
                {errors.proposedTransport && (
                  <p className="text-red-500 text-sm">
                    {errors.proposedTransport.message}
                  </p>
                )}
              </div>
              <div>
                <Label value="Do you want a hotel reservation to be made for you" />
                <div className="flex gap-6 mt-2">
                  <div className="grid grid-cols-2 gap-2 place-items-center">
                    <Radio
                      value="yes"
                      {...register("reserveHotel")}
                      id="yes-h"
                      color={errors.reserveHotel ? "failure" : undefined}
                    />
                    <Label htmlFor="yes-h">Yes</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 place-items-center">
                    <Radio
                      value="no"
                      {...register("reserveHotel")}
                      id="no-h"
                      color={errors.reserveHotel ? "failure" : undefined}
                    />
                    <Label htmlFor="no-h">No</Label>
                  </div>
                </div>
                {errors.reserveHotel && (
                  <p className="text-red-500 text-sm">
                    {errors.reserveHotel.message}
                  </p>
                )}
              </div>
              <div>
                <Label value="Will you be interested in site visits" />
                <div className="flex gap-6 mt-2">
                  <div className="grid grid-cols-2 gap-2 place-items-center">
                    <Radio
                      value="yes"
                      {...register("makeSiteVisits")}
                      id="yes-v"
                      color={errors.makeSiteVisits ? "failure" : undefined}
                    />
                    <Label htmlFor="yes-v">Yes</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 place-items-center">
                    <Radio
                      value="no"
                      {...register("makeSiteVisits")}
                      id="no-v"
                      color={errors.makeSiteVisits ? "failure" : undefined}
                    />
                    <Label htmlFor="no-v">No</Label>
                  </div>
                </div>
                {errors.makeSiteVisits && (
                  <p className="text-red-500 text-sm">
                    {errors.makeSiteVisits.message}
                  </p>
                )}
              </div>

              <div>
                <Label value="Proposed date of arrival" />
                <Datepicker
                  minDate={new Date()}
                  value={new Date(watch("dateOfArrival")).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric", year: "numeric" }
                  )}
                  onSelectedDateChanged={(date) =>
                    setValue("dateOfArrival", date.toISOString())
                  }
                />
                {errors.dateOfArrival && (
                  <p className="text-red-500 text-sm">
                    {errors.dateOfArrival.message}
                  </p>
                )}
              </div>
              {/* Submit */}
              <Button
                type="button"
                onClick={startPayment}
                className="w-full mt-6 text-white !bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
              >
                Proceed
              </Button>
            </form>
          </Card>
        </div>

        <PaymentProcessingModal
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
