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
import {
  TextInput,
  Button,
  Select,
  Checkbox,
  Tooltip,
  Card,
  Label,
} from "flowbite-react";
import { createElement, useState } from "react";
import { Logo } from "../../components/UI/Logo";
import SpinnerLogo from "../../components/UI/LogoLoader";
import { signUpSchema, SignUpSchemaType } from "../../schemas/mainauth";
import { Register } from "../../utils/api/auth";
import { toast } from "react-toastify";
import { useApp } from "../../hooks/app";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/UI/PasswordInput";

function MultiSectionForm() {
  const { areasOfInterest, levelOfLearners } = useApp();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    reset,
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
            <Label value="Title" />
            <Select
              color={errors.title ? "failure" : undefined}
              {...register("title")}
              helperText={errors.title?.message}
            >
              <option value="">---Select Title---</option>
              <option value="mr">Mr.</option>
              <option value="mrs">Mrs.</option>
              <option value="miss">Miss</option>
              <option value="dr">Dr</option>
              <option value="prof">Professor</option>
            </Select>
          </div>
          <div className="my-6">
            <Label value="Full Name" />
            <TextInput
              {...register("full_name")}
              placeholder="Enter your fullname"
              icon={FiUser}
              color={errors.full_name ? "failure" : undefined}
              helperText={errors.full_name?.message}
            />
          </div>
          <div className="my-6">
            <Label value="Gender" />
            <Select
              color={errors.gender ? "failure" : undefined}
              {...register("gender")}
              helperText={errors.gender?.message}
            >
              <option value="">---Select Gender---</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </div>
          <div className="my-6">
            <Label value="Organization" />
            <TextInput
              {...register("organization")}
              placeholder="Organization name"
              icon={FiUser}
              color={errors.organization ? "failure" : undefined}
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
            <Label value="Mailing Address" />
            <TextInput
              {...register("mailing_address")}
              placeholder="Mailing Address"
              color={errors.mailing_address ? "failure" : undefined}
              helperText={errors.mailing_address?.message}
            />
          </div>
          <div className="my-6">
            <Label value="City" />
            <TextInput
              {...register("city")}
              placeholder="City"
              color={errors.city ? "failure" : undefined}
              helperText={errors.city?.message}
            />
          </div>
          <div className="my-6">
            <Label value="State" />
            <TextInput
              {...register("state")}
              placeholder="State"
              color={errors.state ? "failure" : undefined}
              helperText={errors.state?.message}
            />
          </div>
          <div className="my-6">
            <Label value="ZIP Code" />
            <TextInput
              {...register("zip_code")}
              placeholder="ZIP Code"
              color={errors.zip_code ? "failure" : undefined}
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
            <Label value="Phone" />
            <TextInput
              {...register("phone")}
              placeholder="Phone"
              icon={FiPhone}
              color={errors.phone ? "failure" : undefined}
              helperText={errors.phone?.message}
            />
          </div>
          <div className="my-6">
            <Label value="Email" />
            <TextInput
              {...register("email")}
              placeholder="Email"
              icon={FiMail}
              color={errors.email ? "failure" : undefined}
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
        </>
      ),
    },
    {
      label: "Level of Learners",
      icon: FiBook,
      fields: (
        <div className="my-6">
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
      ),
    },
    {
      label: "Security",
      icon: FiLock,
      fields: (
        <>
          <div className="my-6">
            <Label value="Password" />
            <PasswordInput
              {...register("password1")}
              type="password"
              placeholder="Password"
              error={errors.password1}
            />
          </div>
          <div className="my-6">
            <Label value="Confirm Password" />
            <PasswordInput
              {...register("password2")}
              type="password"
              placeholder="Confirm Password"
              error={errors.password2}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              {...register("terms")}
              color={errors.terms ? "failure" : undefined}
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
      reset();
      navigate(`/registration-success/${formData.email}`);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
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
    <div className="grid grid-cols-1 place-items-center">
      <Logo className="bg-blue-700 p-3 rounded-xl h-16 my-6" />
      <Card className="relative w-full max-w-4xl overflow-hidden  rounded-lg p-3 shadow-lg">
        {sectionLoading && (
          <div className="absolute inset-0 z-30 flex size-full items-center justify-center bg-slate-950/10">
            <SpinnerLogo />
          </div>
        )}
        {/* Progress Bar */}
        <div className="mb-3 hidden lg:flex items-center justify-between ">
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
                scale: index === section ? 1.1 : 0.8999,
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`flex size-12 items-center justify-center rounded-full ${
                  index === section
                    ? "bg-blue-200"
                    : index < section
                      ? "bg-green-200"
                      : "bg-gray-200"
                }`}
              >
                {index < section ? (
                  <FiCheckCircle size={15} />
                ) : (
                  <s.icon size={15} />
                )}
              </div>
              <span className="mt-1 text-xs">{s.label}</span>
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 over-hidden"
        >
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

          <div className="mt-4 flex justify-center text-sm text-gray-600 border-t border-gray-300 dark:border-gray-700 pt-3">
            <span className="flex gap-2 dark:text-gray-200">
              Already have an account?
              <Link
                to="/auth/sign-in"
                className="text-blue-600 dark:text-blue-500 underline"
              >
                Sign In
              </Link>
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default MultiSectionForm;
