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
import { HiOutlineCreditCard } from "react-icons/hi";
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
  // participation: yup.string().required("Participation mode is required"),
  // participationCategory: yup
  //   .string()
  //   .required("Participation category is required"),
  registrationFee: yup.string(),

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

export default function TeacherRegistrationPage() {
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
      // country: "Nigeria",
      paymentTrxId: "",
      paymentTrxRef: "",
      registrationFee: "Teacher - ₦120,000",
    },
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const formValues = watch();

  // const selectedCountry = watch("country");
  // const selectedCity = watch("city");
  // const selectedCategory = watch("participationCategory");
  

  const [showModal, setShowModal] = useState(false);
  const [countries, setCountries] = useState<Country[]>(countryData as any);
  // const [code, setCode] = useState("");
  // const [isCheckingCode, setIsCheckingCode] = useState(false);

  // const [result, setResult] = useState<any>(null);

  // const handleCheck = async () => {
  //   setIsCheckingCode(true);
  //   const res = await checkCode(code);
  //   setResult(res);
  //   setIsCheckingCode(false);
  // };

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

  
  let amount = 100_000;
  let currency: "NGN" | "USD" = "NGN";



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
    const isFormValid = await trigger(undefined, { shouldFocus: true });
    if (!isFormValid) return;
    initializePayment({ onSuccess, onClose });
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
        <h1 className="text-4xl font-extrabold">Teacher Conference Registration</h1>
        <p className="mt-3 text-lg font-medium">
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
          <Card className="col-span-3 p-8 shadow-xl m-auto w-full max-w-4xl">
            <h2 className="text-4xl font-extrabold mx-auto mb-6 p-3 text-black rounded-xl w-fit">
              Teacher Registration Form
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
              {/* <div>
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
              </div> */}

              {/* Registration Fees */}
              {/* {selectedCountry && selectedCategory && selectedCity && ( */}
                <div className="flex justify-center mt-8">
                  <Card className="w-full shadow-lg border rounded-2xl p-6">
                    {/* Header */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Registration Checkout
                    </h2>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-5 w-full">
                      {/* Fee Row */}
                      <div className="flex items-center gap-5 justify-start border-b pb-4 w-3/4">
                        <span className="text-gray-600 text-lg">
                          Conference Registration Fee:
                        </span>
                        <span className="text-blue-600 font-extrabold text-xl">
                          NGN 120,000
                        </span>
                      </div>

                      {/* Pay Button */}
                      <Button
                        onClick={startPayment}
                        gradientDuoTone="purpleToBlue"
                        size="md"
                        type="button"
                        className="w-1/4 flex items-center justify-center gap-2"
                      >
                        <HiOutlineCreditCard className="text-lg h-5 mr-2" />
                        Pay Now
                      </Button>
                    </div>

                    {/* Additional Info */}

                    <p className="text-gray-500 text-sm">
                      Please confirm your payment details before proceeding.
                    </p>
                  </Card>
                </div>
              {/* )} */}
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
