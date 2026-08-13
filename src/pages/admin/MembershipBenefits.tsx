import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  TextInput,
  Textarea,
  Label,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { Skeleton } from "../../components/UI/Skeleton";
import {
  HiMenu,
  HiPlus,
  HiPencil,
  HiTrash,
  HiCheck,
  HiX,
} from "react-icons/hi";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { formatDate } from "../../utils/app/time";

const defaultBenefitsData = [
  // Access Control Benefits
  {
    id: "1",
    name: "Premium Content Access",
    description:
      "Access to exclusive premium content, articles, and resources not available to regular users.",
    // category: "access",
    icon: "🔓",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Early Access",
    description:
      "Get early access to new features, products, and content before they're released to the public.",
    // category: "access",
    icon: "⚡",
    is_active: true,
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T11:00:00Z",
  },
  {
    id: "3",
    name: "VIP Area Access",
    description:
      "Access to exclusive VIP areas, forums, and member-only sections of the platform.",
    // category: "access",
    icon: "👑",
    is_active: true,
    created_at: "2024-01-15T11:30:00Z",
    updated_at: "2024-01-15T11:30:00Z",
  },

  // Feature Benefits
  {
    id: "4",
    name: "Advanced Analytics",
    description:
      "Access to detailed analytics, reports, and insights about your usage and performance.",
    // category: "features",
    icon: "📊",
    is_active: true,
    created_at: "2024-01-15T12:00:00Z",
    updated_at: "2024-01-15T12:00:00Z",
  },
  {
    id: "5",
    name: "Custom Themes",
    description:
      "Ability to customize the interface with premium themes and personalization options.",
    // category: "features",
    icon: "🎨",
    is_active: true,
    created_at: "2024-01-15T12:30:00Z",
    updated_at: "2024-01-15T12:30:00Z",
  },
  {
    id: "6",
    name: "API Access",
    description:
      "Full API access for integration with third-party applications and custom development.",
    // category: "features",
    icon: "🔌",
    is_active: true,
    created_at: "2024-01-15T13:00:00Z",
    updated_at: "2024-01-15T13:00:00Z",
  },
  {
    id: "7",
    name: "Bulk Operations",
    description:
      "Perform bulk operations on data, users, and content for efficient management.",
    // category: "features",
    icon: "⚙️",
    is_active: false,
    created_at: "2024-01-15T13:30:00Z",
    updated_at: "2024-01-15T13:30:00Z",
  },

  // Content Benefits
  {
    id: "8",
    name: "HD Video Streaming",
    description:
      "Stream videos in high definition quality with no buffering or quality restrictions.",
    // category: "content",
    icon: "🎬",
    is_active: true,
    created_at: "2024-01-15T14:00:00Z",
    updated_at: "2024-01-15T14:00:00Z",
  },
  {
    id: "9",
    name: "Offline Downloads",
    description:
      "Download content for offline viewing and access without internet connection.",
    // category: "content",
    icon: "📥",
    is_active: true,
    created_at: "2024-01-15T14:30:00Z",
    updated_at: "2024-01-15T14:30:00Z",
  },
  {
    id: "10",
    name: "Exclusive Webinars",
    description:
      "Access to exclusive webinars, workshops, and live sessions with industry experts.",
    // category: "content",
    icon: "🎓",
    is_active: true,
    created_at: "2024-01-15T15:00:00Z",
    updated_at: "2024-01-15T15:00:00Z",
  },
];

interface Benefit {
  id: string;
  name: string;
  description: string;
  created_at: string;
  is_active?: boolean;
}

// Validation schema
const benefitSchema = yup.object().shape({
  name: yup
    .string()
    .required("Benefit name is required")
    .min(3, "Benefit name must be at least 3 characters")
    .max(100, "Benefit name must not exceed 100 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  // category: yup
  //   .string()
  //   .required("Category is required")
  //   .oneOf(
  //     ["access", "features", "content", "support", "discounts", "other"],
  //     "Invalid category"
  //   ),
  // icon: yup.string().max(50, "Icon must not exceed 50 characters"),
  // is_active: yup.boolean().required("Active status is required"),
});

type BenefitForm = yup.InferType<typeof benefitSchema>;

const BENEFIT_CATEGORIES = [
  { value: "access", label: "Access Control" },
  { value: "features", label: "Features" },
  { value: "content", label: "Content" },
  { value: "support", label: "Support" },
  { value: "discounts", label: "Discounts" },
  { value: "other", label: "Other" },
];

function AdminBenefitsListPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [confirmAction, setConfirmAction] = useState<null | {
    benefit: Benefit;
    action: "delete" | "toggle" | null;
  }>(null);
  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    register,
    watch,
  } = useForm<BenefitForm>({
    resolver: yupResolver(benefitSchema),
    defaultValues: {
      name: "",
      description: "",
      // icon: "",
    },
  });

  const fetchBenefits = async () => {
    setIsLoading(false);
    try {
      setIsLoading(true);
      const { data } = await axios.get("/benefits/");
      console.log(data);
      setBenefits(data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ||
          "Error fetching benefits. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBenefits();
  }, []);

  const resetForm = () => {
    reset({
      name: "",
      description: "",
      // category: "features",
      // icon: "",
      // is_active: true,
    });
    setEditingBenefit(null);
    setShowCreateForm(false);
  };

  const onSubmit = async (data: BenefitForm) => {
    try {
      if (editingBenefit) {
        // Update existing benefit
        const response = await axios.put(
          `/benefits/${editingBenefit.id}/`,
          data
        );
        toast.success("Benefit updated successfully");
      } else {
        // Create new benefit
        await axios.post("/benefits/", data);
        toast.success("Benefit created successfully");
      }
      fetchBenefits();
      resetForm();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ||
          `Error ${editingBenefit ? "updating" : "creating"} benefit. Please try again.`
      );
    }
  };

  const handleEdit = (benefit: Benefit) => {
    setEditingBenefit(benefit);
    setValue("name", benefit.name);
    setValue("description", benefit.description);
    // setValue("category", benefit.category);
    // setValue("icon", benefit.icon || "");
    // setValue("is_active", benefit.is_active);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    setIsActionLoading(true);
    try {
      await axios.delete(`/benefits/${id}/`);
      setBenefits((prev) => prev.filter((b) => b.id !== id));
      toast.success("Benefit deleted successfully");
      setConfirmAction(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ||
          "Error deleting benefit. Please try again."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleStatus = async (benefit: Benefit) => {
    setIsActionLoading(true);
    try {
      const { data } = await axios.patch(`/benefits/${benefit.id}/`, {
        is_active: !benefit.is_active,
      });
      setBenefits((prev) => prev.map((b) => (b.id === benefit.id ? data : b)));
      toast.success(
        `Benefit ${!benefit.is_active ? "activated" : "deactivated"} successfully`
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ||
          "Error updating benefit status. Please try again."
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    return (
      BENEFIT_CATEGORIES.find((cat) => cat.value === category)?.label ||
      category
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      access: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      features:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      content:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      support:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      discounts:
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="mx-auto max-w-6xl p-4 text-gray-800 dark:text-gray-100">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Membership Benefits</h1>
        <Button
          color="blue"
          onClick={() => setShowCreateForm(true)}
          disabled={isSubmitting}
        >
          <HiPlus className="mr-2 h-4 w-4" />
          Add Benefit
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 h-screen p-4">
          <Card className="mb-6 bg-white dark:bg-gray-800 w-full max-w-xl shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {editingBenefit ? "Edit Benefit" : "Create New Benefit"}
                </h3>
                <Button
                  color="gray"
                  size="sm"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  <HiX className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name" value="Benefit Name *" />
                  <TextInput
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="Enter benefit name"
                    disabled={isSubmitting}
                    color={errors.name ? "failure" : "gray"}
                    helperText={errors.name?.message}
                  />
                </div>

                {/* <div>
                <Label htmlFor="category" value="Category *" />

                <Select
                  {...register("category")}
                  id="category"
                  disabled={isSubmitting}
                  color={errors.category ? "failure" : "gray"}
                  helperText={errors.category?.message}
                >
                  {BENEFIT_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
              </div> */}
              </div>

              <div>
                <Label htmlFor="description" value="Description *" />

                <Textarea
                  {...register("description")}
                  id="description"
                  placeholder="Enter benefit description"
                  rows={3}
                  disabled={isSubmitting}
                  color={errors.description ? "failure" : "gray"}
                  helperText={errors.description?.message}
                />
              </div>

              {/* <div>
                <Label htmlFor="icon" value="Icon (optional)" />

                <TextInput
                  {...register("icon")}
                  id="icon"
                  type="text"
                  placeholder="Enter icon name or emoji"
                  disabled={isSubmitting}
                  color={errors.icon ? "failure" : "gray"}
                  helperText={errors.icon?.message}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  {...register("is_active")}
                  id="is_active"
                  type="checkbox"
                  checked={watch("is_active")}
                  disabled={isSubmitting}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <Label htmlFor="is_active" value="Active" />
              </div> */}

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  color="gray"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="blue"
                  disabled={isSubmitting}
                  isProcessing={isSubmitting}
                >
                  {editingBenefit ? "Update Benefit" : "Create Benefit"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Benefits List */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <Card key={i}>
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4 my-2" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))
          : benefits.map((benefit) => (
              <Card
                key={benefit.id}
                className={`bg-white text-gray-900 shadow-md dark:bg-gray-800 dark:text-white relative group`}
              >
                <div className="absolute top-2 right-2">
                  <Dropdown
                    label=""
                    dismissOnClick
                    renderTrigger={() => (
                      <button className="cursor-pointer p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <HiMenu className="text-lg" />
                      </button>
                    )}
                    className="px-2 w-[140px] z-40"
                    inline
                  >
                    <Dropdown.Item
                      onClick={() => handleEdit(benefit)}
                      className="flex items-center gap-2"
                    >
                      <HiPencil className="h-4 w-4" />
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        setConfirmAction({ benefit, action: "toggle" })
                      }
                      className="flex items-center gap-2"
                    >
                      {/* {benefit.is_active ? (
                        <>
                          <HiX className="h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <HiCheck className="h-4 w-4" />
                          Activate
                        </>
                      )} */}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      className="!bg-red-500 rounded-md text-white hover:!bg-red-600"
                      onClick={() =>
                        setConfirmAction({ benefit, action: "delete" })
                      }
                    >
                      <HiTrash className="h-4 w-4 mr-2" />
                      Delete
                    </Dropdown.Item>
                  </Dropdown>
                </div>

                <div className="flex items-start gap-3">
                  <div className="">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                        {benefit.name}
                      </h3>
                    </div>

                    {/* <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${getCategoryColor(benefit.category)}`}
                    >
                      {getCategoryLabel(benefit.category)}
                    </span> */}

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {benefit.description}
                    </p>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created: {formatDate(benefit.created_at)}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
      </div>

      {!isLoading && benefits.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            No benefits found. Create your first benefit to get started.
          </div>
        </div>
      )}

      <ConfirmationModal
        open={!!confirmAction}
        theme={confirmAction?.action === "delete" ? "failure" : "warning"}
        title="Confirm Action"
        message={
          confirmAction?.action === "delete"
            ? "Are you sure you want to delete this benefit? This action cannot be undone."
            : confirmAction?.action === "toggle"
              ? `Are you sure you want to ${
                  confirmAction.benefit.is_active ? "deactivate" : "activate"
                } this benefit?`
              : ""
        }
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction?.action === "delete") {
            handleDelete(confirmAction.benefit.id);
          } else if (confirmAction?.action === "toggle") {
            handleToggleStatus(confirmAction.benefit);
          }
          
        }}
        loading={isActionLoading}
      />
    </div>
  );
}

export default AdminBenefitsListPage;
