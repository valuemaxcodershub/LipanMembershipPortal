import {
  Button,
  Card,
  Label,
  TextInput,
  Textarea,
  Modal,
  ToggleSwitch,
  Spinner,
} from "flowbite-react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { Skeleton } from "../../components/UI/Skeleton";
import Switch from "../../components/UI/Switch";

const membershipSchema = yup.object().shape({
  name: yup.string().required("Plan name is required"),
  description: yup.string().required("Description is required"),
  price: yup.string().required("Price is required"),
  benefits: yup
    .array()
    .of(yup.string().required("Benefit cannot be empty"))
    .min(1, "At least one benefit is required"),
});

type MembershipSchemaType = yup.InferType<typeof membershipSchema>;

interface Plans {
  name: string;
  description: string;
  price: string;
  benefits: string[];
}

export default function AdminMembershipPlansPage() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(membershipSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      benefits: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits" as never,
  });
  const [plans, setPlans] = useState<Plans[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [activePlansOnly, setActivePlansOnly] = useState(true);

  const existingPlans = [
    {
      name: "Basic",
      description: "Access to general resources",
      price: 0,
      benefits: ["Newsletter", "Event invites"],
    },
    {
      name: "Premium",
      description: "Full membership access",
      price: 5000,
      benefits: ["Workshops", "Certification", "Online courses"],
    },
  ];

  const getPlans = async () => {
    try {
      setPlans([]);
      const { data } = await axios.get("/membership/");
      setPlans(data.results);
      console.log(data);
    } catch (err: any) {
      console.error("Error fetching membership plans:", err);
      toast.error(
        err?.response?.data?.detail ||
          "Error fetching membership plans. Please try again."
      );
    }
  };

  useEffect(() => {
    getPlans();
  }, []);
  const onSubmit = async (data: MembershipSchemaType) => {
    setIsSubmitting(true);
    console.log("Submitted Membership Plan:", data);
    const formData = {
      ...data,
      price: Number(data.price),
    };
    try {
      const { data } = await axios.post("/membership/", formData);
      toast.success(data?.detail || "Membership plan created successfully!");
      reset();
      setOpenModal(false);
    } catch (err: any) {
      console.error("Error creating membership plan:", err);
      toast.error(
        err?.response?.data?.detail ||
          "Error creating membership plan. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 text-gray-800 dark:text-gray-100">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Membership Plans</h1>
        <div className="flex items-center gap-4">
          <Switch
            checked={activePlansOnly}
            label="Show Active Plans Only"
            onChange={setActivePlansOnly}
          />
          <Button onClick={() => setOpenModal(true)}>+ Add New Plan</Button>
        </div>
      </div>

      {/* Modal for Creating Membership Plan */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} size="lg">
        <Modal.Header>Create Membership Plan</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name" value="Plan Name" />
              <TextInput
                id="name"
                {...register("name")}
                disabled={isSubmitting}
                color={errors.name ? "failure" : undefined}
                helperText={errors.name?.message}
              />
            </div>

            <div>
              <Label htmlFor="price" value="Price (₦)" />
              <TextInput
                id="price"
                type="number"
                {...register("price")}
                disabled={isSubmitting}
                color={errors.price ? "failure" : undefined}
                helperText={errors.price?.message}
              />
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                {...register("description")}
                disabled={isSubmitting}
                color={errors.description ? "failure" : undefined}
                placeholder="Describe the membership plan"
                helperText={errors.description?.message}
                rows={3}
              />
            </div>

            <div>
              <Label value="Membership Benefits" />
              {fields.map((field, index) => (
                <div key={field.id} className="mb-2 flex gap-2">
                  <TextInput
                    {...register(`benefits.${index}`)}
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  <Button
                    color="failure"
                    size="xs"
                    disabled={isSubmitting}
                    type="button"
                    className="flex items-center"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {errors.benefits && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.benefits.message || errors.benefits[0]?.message}
                </p>
              )}
              <Button
                type="button"
                onClick={() => append("")}
                size="sm"
                disabled={isSubmitting}
                className="mt-2"
              >
                + Add Benefit
              </Button>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                gradientDuoTone="purpleToBlue"
              >
                Save Plan
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Display Existing Plans as Cards */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.length ? (
          <>
            {plans.map((plan, idx) => (
              <Card
                key={idx}
                className="bg-white text-gray-900 shadow-md dark:bg-gray-800 dark:text-white"
              >
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                  {plan.name}
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {plan.description}
                </p>
                <p className="mt-2 text-lg font-bold text-gray-800 dark:text-gray-200">
                  ₦{plan.price}
                </p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300">
                  {plan.benefits.map((benefit, bIdx) => (
                    <li key={bIdx}>{benefit}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </>
        ) : (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <div className="p-4 space-y-2">
                  <Skeleton className="h-10 w-full my-4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="p-4 space-y-2 mt-2">
                  <Skeleton className="h-2 w-4/4" />
                  <Skeleton className="h-2 w-2/4" />
                  <Skeleton className="h-2 w-3/4" />
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
