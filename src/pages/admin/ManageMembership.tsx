import React, { useEffect, useState } from "react";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Spinner,
  Card,
  Tooltip,
  Checkbox,
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
import SelectableSection from "../../components/UI/SelectionCard";
import { errorHandler } from "../../utils/api/errors";

const membershipSchema = yup.object({
  name: yup.string().required("Plan name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Registration price is required"),
  renewal_price: yup
    .number()
    .typeError("Renewal price must be a number")
    .required("Renewal price is required")
    .min(0, "Renewal price cannot be negative"),
  benefits: yup.array().min(1, "At least one benefit is required"),
  permissions: yup.array().min(1, "At least one benefit is required"),
});

type MembershipSchemaType = yup.InferType<typeof membershipSchema>;

function MembershipFormSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 animate-pulse space-y-4">
      <div className="h-8 bg-gray-300 rounded w-2/5"></div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded-md" />
      ))}
    </div>
  );
}

export default function MembershipCreateEditPage() {
  const { value } = useParams<{ value: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<MembershipSchemaType>({
    resolver: yupResolver(membershipSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      renewal_price: 0,
      benefits: [],
      permissions: [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);

  const isEditing = value && value !== "create";

  useEffect(() => {
    const fetchMembership = async () => {
      setIsLoading(true);
      try {
        if (isEditing) {
          const { data } = await axios.get(`/membership/${value}/`);
          reset({
            name: data.name,
            description: data.description,
            price: data.price,
            renewal_price:
              data.renewal_price != null ? Number(data.renewal_price) : Number(data.price),
            benefits: data.benefits.map((b: any) => b.id),
            permissions: data.permissions.map((p: any) => p.key),
          });
        }

        const [permissionRes, benefitsRes] = await Promise.all([
          axios.get("/membership/permission-list/"),
          axios.get("/benefits/"),
        ]);
        const permissionsList = permissionRes.data;
        const benefitslist = benefitsRes.data;
        console.log(benefitslist, permissionsList);

        setBenefits(
          benefitslist.map((item: any) => ({
            id: item.id,
            label: item.name,
          }))
        );
        setPermissions(
          permissionsList.map((item: any) => ({
            id: item.key,
            label: item.label,
          }))
        );
      } catch {
        toast.error("Failed to load membership plan");
        navigate("/admin/memberships");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembership();
  }, [value, reset, navigate, isEditing]);

  const onSubmit = async (data: MembershipSchemaType) => {
    console.log(data);
    try {
      if (isEditing) {
        await axios.put(`/membership/${value}/`, data);
        toast.success("Membership plan updated successfully!");
      } else {
        await axios.post("/membership/", data);
        toast.success("Membership plan created successfully!");
        reset({
          name: "",
          description: "",
          price: 0,
          renewal_price: 0,
          permissions: [],
        });
        navigate("/admin/memberships");
      }
    } catch (error: any) {
      const errMsg = errorHandler(error);
      toast.error(errMsg || "Failed to save membership plan");
    }
  };

  if (isLoading) return <MembershipFormSkeleton />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button color="light" as={Link} to="/admin/memberships">
          <HiArrowCircleLeft className="h-5 mr-2" />
          Back
        </Button>
        <Tooltip content="All fields are required. Pricing is in ₦.">
          <FaInfoCircle className="text-gray-500 text-xl cursor-pointer" />
        </Tooltip>
      </div>

      <div className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
        {isEditing ? (
          <>
            <FaEdit className="text-blue-500" />
            Editing: Membership Plan
          </>
        ) : (
          <>
            <FaPlus className="text-green-500" />
            Create a New Membership Plan
          </>
        )}
      </div>

      <Card className="shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price" value="Registration Price (₦)" />
              <TextInput
                icon={FaMoneyBillWave}
                id="price"
                type="number"
                placeholder="First-time registration fee"
                {...register("price")}
                color={errors.price ? "failure" : undefined}
                helperText={errors.price?.message}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renewal_price" value="Renewal Price (₦)" />
              <TextInput
                icon={FaMoneyBillWave}
                id="renewal_price"
                type="number"
                placeholder="Fee when membership expires and is renewed"
                {...register("renewal_price")}
                color={errors.renewal_price ? "failure" : undefined}
                helperText={
                  errors.renewal_price?.message ||
                  "Charged when an expired member renews this plan."
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" value="Description" />
            <Textarea
              id="description"
              placeholder="Describe the benefits of this membership plan..."
              rows={4}
              {...register("description")}
              color={errors.description ? "failure" : undefined}
              helperText={errors.description?.message}
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500">
              This will help users understand what they get.
            </p>
          </div>

          <div className="space-y-2">
            <Label value="Membership benefits" />
            <SelectableSection
              options={benefits}
              multiple
              value={watch("benefits") as string[]}
              onChange={(val) => setValue("benefits", val as string[])}
              renderItem={(item: any, isSelected) => (
                <div className="flex items-center gap-3 px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all">
                  <Checkbox color="blue" checked={isSelected} readOnly />
                  <span className="text-sm text-gray-800 dark:text-gray-100">
                    {item.label}
                  </span>
                </div>
              )}
            />
            {errors.benefits && (
              <p className="text-sm text-red-500">{errors.benefits.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label value="Membership permissions" />
            <SelectableSection
              options={permissions}
              multiple
              value={watch("permissions") as string[]}
              onChange={(val) => setValue("permissions", val as string[])}
              renderItem={(item: any, isSelected) => (
                <div className="flex items-center gap-3 px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all">
                  <Checkbox color="blue" checked={isSelected} readOnly />
                  <span className="text-sm text-gray-800 dark:text-gray-100">
                    {item.label}
                  </span>
                </div>
              )}
            />
            {errors.permissions && (
              <p className="text-sm text-red-500">
                {errors.permissions.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              color="blue"
              disabled={isSubmitting}
              size="md"
              fullSized
            >
              {isSubmitting ? (
                <Spinner size="sm" />
              ) : isEditing ? (
                "Update Plan"
              ) : (
                "Create Plan"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
