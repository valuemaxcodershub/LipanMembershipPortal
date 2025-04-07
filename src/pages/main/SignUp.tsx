import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import {
  FiMail,
  FiUser,
  FiPhone,
  FiMap,
  FiCheckCircle,
  FiList,
  FiArrowRight,
  FiArrowLeft,
  FiGrid,
  FiBook,
  FiLock,
} from "react-icons/fi";
import { TextInput, Button, Select, Checkbox, Tooltip, Card } from "flowbite-react";
import { createElement, useState } from "react";
import { Logo } from "../../components/UI/Logo";
import SpinnerLogo from "../../components/UI/LogoLoader";
import { signUpSchema, SignUpSchemaType } from "../../schemas/mainauth";
import { Register } from "../../utils/api/auth";
import { toast } from "react-toastify";
import { useApp } from "../../hooks/app";



function MultiSectionForm() {
  const {areasOfInterest, levelOfLearners} = useApp();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<SignUpSchemaType>({
    resolver: yupResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      areas_of_interest: [],
    },
  });

  const [section, setSection] = useState(0);
  const [sectionLoading, setSectionLoading] = useState(false);

  const sections = [
    {
      label: "Personal Info",
      icon: FiUser,
      fields: (
        <>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              Title
            </label>
            <Select
              color={errors.title ? "failure" : ""}
              {...register("title")}
              helperText={errors.title?.message}
            >
              <option value="">---Select Title---</option>
              <option value="mr">Mr.</option>
              <option value="mrs">Mrs.</option>
              <option value="miss">Miss</option>
              <option value="dr">Dr</option>
              <option value="professor">Professor</option>
            </Select>
          </div>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <TextInput
              {...register("full_name")}
              placeholder="Enter your fullname"
              icon={FiUser}
              color={errors.full_name ? "failure" : ""}
              helperText={errors.full_name?.message}
            />
          </div>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              Gender
            </label>
            <Select
              color={errors.gender ? "failure" : ""}
              {...register("gender")}
              helperText={errors.gender?.message}
            >
              <option value="">---Select Gender---</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </div>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              Organization
            </label>
            <TextInput
              {...register("organization")}
              placeholder="Organization name"
              icon={FiUser}
              color={errors.organization ? "failure" : ""}
              helperText={errors.organization?.message}
            />
          </div>
        </>
      ),
    },
    {
      label: "Address Info",
      icon: FiMap,
      fields: (
        <>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              Mailing Address
            </label>
            <TextInput
              {...register("mailing_address")}
              placeholder="Mailing Address"
              color={errors.mailing_address ? "failure" : ""}
              helperText={errors.mailing_address?.message}
            />
          </div>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              City
            </label>
            <TextInput
              {...register("city")}
              placeholder="City"
              color={errors.city ? "failure" : ""}
              helperText={errors.city?.message}
            />
          </div>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              State
            </label>
            <TextInput
              {...register("state")}
              placeholder="State"
              color={errors.state ? "failure" : ""}
              helperText={errors.state?.message}
            />
          </div>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              ZIP Code
            </label>
            <TextInput
              {...register("zip_code")}
              placeholder="ZIP Code"
              color={errors.zip_code ? "failure" : ""}
              helperText={errors.zip_code?.message}
            />
          </div>
        </>
      ),
    },
    {
      label: "Contact Info",
      icon: FiPhone,
      fields: (
        <>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              Phone
            </label>
            <TextInput
              {...register("phone")}
              placeholder="Phone"
              icon={FiPhone}
              color={errors.phone ? "failure" : ""}
              helperText={errors.phone?.message}
            />
          </div>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <TextInput
              {...register("email")}
              placeholder="Email"
              icon={FiMail}
              color={errors.email ? "failure" : ""}
              helperText={errors.email?.message}
            />
          </div>
        </>
      ),
    },
    {
      label: "Areas of Interest",
      icon: FiGrid,
      fields: (
        <>
          {" "}
          <div
            className={`my-6 flex flex-wrap gap-3 rounded-md p-5 border border-${errors.areas_of_interest ? "red-500" : "gray-300"}`}
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
                  {...register("areas_of_interest")}
                  className="peer rounded-md"
                />
                <p className="cursor-pointer group peer-checked:text-blue-600">
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
        </>
      ),
    },
    {
      label: "Level of Learners",
      icon: FiBook,
      fields: (
        <div className="my-6">
          <label className="block text-sm font-medium text-gray-600">
            Level of Learners
          </label>
          <Select
            {...register("level_of_learners")}
            helperText={errors.level_of_learners?.message}
            color={errors.level_of_learners ? "failure" : ""}
          >
            <option value="">---Select---</option>
            {levelOfLearners.map((option, index) => (
              <option key={index} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>
        </div>
      ),
    },
    {
      label: "Security",
      icon: FiLock,
      fields: (
        <>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <TextInput
              {...register("password1")}
              type="password"
              placeholder="Password"
              icon={FiLock}
              color={errors.password1 ? "failure" : ""}
              helperText={errors.password1?.message}
            />
          </div>
          <div className="my-6">
            <label className="block text-sm font-medium text-gray-600 mt-4">
              Confirm Password
            </label>
            <TextInput
              {...register("password2")}
              type="password"
              placeholder="Confirm Password"
              icon={FiLock}
              color={errors.password2 ? "failure" : ""}
              helperText={errors.password2?.message}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              {...register("terms")}
              color={errors.terms ? "failure" : ""}
            />
            <label
              htmlFor="terms"
              className="text-sm flex flex-wrap gap-1 text-gray-600"
            >
              By checking this box, I,{" "}
              <span className="text-blue-500 underline font-bold">
                {watch("full_name") || "your full name"}
              </span>
              , confirm that I have read and agree to the{" "}
              <Tooltip content="Terms and Conditions" placement="top">
                <span className="cursor-pointer font-bold text-blue-500 underline">
                  Terms and Conditions
                </span>
              </Tooltip>
              of this platform.
            </label>
          </div>
        </>
      ),
    },
  ];

  const onSubmit = async (formData: SignUpSchemaType) => {
    console.log(formData);
    setSectionLoading(true);
    try {
      const { data } = await Register(formData);
      console.log(data);
        toast.success(data.detail);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    } finally {
      setSectionLoading(false);
    }
  };

  const formSections = [
    ["prefix", "title", "suffix", "full_name", "organization"],
    ["mailing_address", "city", "state", "zip_code"],
    ["phone", "email", "terms"],
    ["areas_of_interest"],
    ["level_of_learners"],
    ["password", "confirm_password", "terms"],
  ];

  const nextSection = async () => {
    const isValid = await trigger(
      formSections[section] as (keyof SignUpSchemaType)[]
    );
    if (isValid) {
      setSectionLoading(true);
      setTimeout(() => {
        setSectionLoading(false);
        setSection(section + 1);
      }, 1000);
    }
  };

  const prevSection = () => {
    if (section > 0) setSection(section - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-blue-700 p-3 rounded-xl h-20 my-6">
        <Logo className="h-full" />
      </div>
      <Card className="relative w-full max-w-4xl overflow-hidden rounded-lg p-10 shadow-lg">
        {sectionLoading && (
          <div className="absolute inset-0 z-30 flex size-full items-center justify-center bg-slate-950/10">
            <SpinnerLogo />
          </div>
        )}
        {/* Progress Bar */}
        <div className="mb-9 hidden lg:flex items-center justify-between gap-4 ">
          {sections.map((s, index) => (
            <motion.div
              key={index}
              className={`mb-5 flex flex-col items-center ${
                index === section
                  ? "text-blue-500"
                  : index < section
                    ? "text-green-500"
                    : "text-gray-400"
              }`}
              animate={{
                scale: index === section ? 1.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`flex size-12 items-center justify-center rounded-full ${
                  index === section
                    ? "bg-blue-100"
                    : index < section
                      ? "bg-green-100"
                      : "bg-gray-100"
                }`}
              >
                {index < section ? (
                  <FiCheckCircle size={20} />
                ) : (
                  <s.icon size={20} />
                )}
              </div>
              <span className="mt-1 text-sm">{s.label}</span>
            </motion.div>
          ))}
        </div>
        <div className="mb-9 flex lg:hidden items-center justify-center gap-4">
          <div className={`mb-5 flex flex-col items-center text-blue-500 `}>
            <div
              className={`flex size-12 items-center justify-center rounded-full bg-blue-100`}
            >
              {createElement(sections[section].icon, { size: 20 })}
            </div>
            <span className="mt-1 text-sm">{sections[section].label}</span>
          </div>
        </div>

        {/* Section Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            {sections[section].fields}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="mt-4 flex justify-between">
            <Button
              disabled={section === 0}
              onClick={prevSection}
              type="button"
              className={`bg-gray-600 hover:bg-gray-700 ${section === 0 ? "invisible" : "visible"}`}
            >
              <FiArrowLeft className="mr-3 h-6" />
              Back
            </Button>
            {section < sections.length - 1 ? (
              <Button
                onClick={nextSection}
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
                <FiArrowRight className="ml-3 h-6" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={sectionLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default MultiSectionForm;
