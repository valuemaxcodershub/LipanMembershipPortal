import React, { useEffect, useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Spinner,
  Card,
  Tooltip,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import {
  FaInfoCircle,
  FaEdit,
  FaPlus,
  FaMoneyBillWave,
  FaListUl,
} from "react-icons/fa";
import { HiArrowCircleLeft } from "react-icons/hi";

function MembershipFormSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 animate-pulse">
      <div className="h-10 bg-gray-300 rounded mb-6 w-1/3"></div>
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-300 rounded" />
        ))}
      </div>
    </div>
  );
}

const membershipSchema = yup.object({
  name: yup.string().required("Plan name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),
  benefits: yup.array().min(1, "At least one benefit is required"),
});

const benefitsList = [
  { id: 1, name: "Early Access" },
  { id: 2, name: "Exclusive Events" },
  { id: 3, name: "Monthly Reports" },
];

type MembershipSchemaType = yup.InferType<typeof membershipSchema>;

export default function MembershipCreateEditPage() {
  const { value } = useParams<{ value: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<MembershipSchemaType>({
    resolver: yupResolver(membershipSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      benefits: [""],
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (value && value !== "create") {
      setIsLoading(true);
      axios
        .get(`/membership/${value}`)
        .then(({ data }) => {
          reset({
            name: data.name,
            description: data.description,
            price: data.price,
            benefits: data.benefits.length > 0 ? data.benefits : [""],
          });
        })
        .catch(() => {
          toast.error("Failed to load membership plan");
          navigate("/admin/memberships");
        })
        .finally(() => setIsLoading(false));
    }
  }, [value, reset, navigate]);

  const onSubmit = async (data: MembershipSchemaType) => {
    try {
      if (value !== "create") {
        await axios.put(`/membership/${value}`, data);
        toast.success("Membership plan updated successfully!");
      } else {
        await axios.post("/membership/", data);
        toast.success("Membership plan created successfully!");
        reset({
          name: "",
          description: "",
          price: 0,
          benefits: [""],
        });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.detail || "Failed to save membership plan"
      );
    }
  };

  if (isLoading) return <MembershipFormSkeleton />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-10">
        <Button color="light" as={Link} to="/admin/memberships">
          <HiArrowCircleLeft className="h-6 mr-2" />
          Back
        </Button>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold flex items-center dark:text-gray-100 gap-2">
          {value === "create" ? (
            <>
              <FaPlus className="text-green-500" />
              Create Membership Plan
            </>
          ) : (
            <>
              <FaEdit className="text-blue-500" />
              Edit Membership Plan
            </>
          )}
        </h1>
        <Tooltip content="All fields are required. Pricing is in ₦.">
          <FaInfoCircle className="text-gray-500 text-xl cursor-pointer" />
        </Tooltip>
      </div>

      <Card className="shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name" value="Plan Name" />
            <TextInput
              icon={FaListUl}
              id="name"
              placeholder="e.g., Premium Access"
              {...register("name")}
              color={errors.name ? "failure" : undefined}
              helperText={errors.name?.message}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="price" value="Price (₦)" />
            <TextInput
              icon={FaMoneyBillWave}
              id="price"
              type="number"
              placeholder="Enter price in Naira"
              {...register("price")}
              color={errors.price ? "failure" : undefined}
              helperText={errors.price?.message}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              placeholder="Describe this membership plan..."
              rows={4}
              {...register("description")}
              color={errors.description ? "failure" : undefined}
              helperText={errors.description?.message}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Help members understand the value of this plan.
            </p>
          </div>

          <div>
            <Label value="Select Membership Benefits" />
            <div
              className={`mb-4 flex flex-wrap gap-3 rounded-md p-5 border ${
                errors.benefits ? "border-red-500" : "border-gray-300"
              }`}
            >
              {benefitsList.map((benefit, index) => (
                <label
                  key={benefit.id}
                  htmlFor={`benefit-${index}`}
                  className="flex flex-grow items-center justify-center gap-2 rounded-lg border-2 border-gray-200 p-2 text-[13.5px] shadow-sm transition-all hover:shadow-md peer-checked:border-blue-500"
                >
                  <input
                    id={`benefit-${index}`}
                    type="checkbox"
                    value={benefit.id}
                    defaultChecked={watch("benefits")?.includes(benefit.id)}
                    {...register("benefits")}
                    className="peer rounded-md"
                  />
                  <p className="cursor-pointer dark:text-white peer-checked:text-blue-600">
                    {benefit.name}
                  </p>
                </label>
              ))}
            </div>
            {errors.benefits && (
              <i className="text-sm text-red-500">{errors.benefits.message}</i>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner size="sm" />
              ) : value === "create" ? (
                "Create Plan"
              ) : (
                "Update Plan"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
