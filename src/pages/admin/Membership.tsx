import React, { useEffect, useState } from "react";
import { Button, Card, Dropdown } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { Skeleton } from "../../components/UI/Skeleton";
import { HiMenu } from "react-icons/hi";
import ConfirmationModal from "../../components/UI/ConfirmModal";


interface Membership {
  id: string;
  name: string;
  description: string;
  price: number;
  benefits: any[];
}

export default function AdminMembershipsListPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | {
    membership: Membership;
    action: "delete" | null;
  }>(null);
  const navigate = useNavigate();

  const fetchMemberships = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/membership/");
      console.log(data.results);
      setMemberships(data.results);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ||
          "Error fetching membership plans. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleDelete = async (id: string) => {
    setIsActionLoading(true);
    try {
      await axios.delete(`/membership/${id}/`);
      setMemberships((prev) => prev.filter((m) => m.id !== id));
      toast.success("Membership deleted successfully");
      setConfirmAction(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ||
          "Error deleting membership. Please try again."
      );
    } finally {
      setIsActionLoading(false)
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 text-gray-800 dark:text-gray-100">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">Membership Plans</h1>
        <Button color="blue" as={Link} to="/admin/memberships/create">
          + Add Membership Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <Card key={i}>
                <div className="p-4 space-y-2">
                  <Skeleton className="h-10 w-full my-4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="p-4 space-y-2 mt-2">
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-2 w-1/2" />
                  <Skeleton className="h-2 w-3/4" />
                </div>
              </Card>
            ))
          : memberships.map((membership) => (
              <Card
                key={membership.id}
                className="bg-white text-gray-900 shadow-md dark:bg-gray-800 dark:text-white relative group"
              >
                <div className="absolute top-2 right-2">
                  <Dropdown
                    label=""
                    dismissOnClick
                    renderTrigger={() => (
                      <button className="cursor-pointer p-2 rounded-md border border-black dark:border-white ">
                        <HiMenu className="text-lg" />
                      </button>
                    )}
                    className="px-2 w-[100px]"
                    inline
                  >
                    <Dropdown.Item
                      as={Link}
                      to={`/admin/memberships/${membership.id}`}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      className="!bg-[#ff0000] rounded-md text-white"
                      onClick={() =>
                        setConfirmAction({ membership, action: "delete" })
                      }
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown>
                </div>
                <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400">
                  {membership.name}
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {membership.description}
                </p>
                <p className="mt-2 text-lg font-bold text-gray-800 dark:text-gray-200">
                  ₦{membership.price}
                </p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-300 max-h-[200px] overflow-y-auto">
                  {membership.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit.name}</li>
                  ))}
                </ul>
              </Card>
            ))}
      </div>

      <ConfirmationModal
        open={!!confirmAction}
        theme="failure"
        title="Confirm Action"
        message="Are you sure you want to delete this membership plan? This action cannot be undone."
        onClose={() => !isActionLoading && setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction?.action === "delete") {
            handleDelete(confirmAction.membership.id);
          }
          
        }}
        loading={isActionLoading}
      />
    </div>
  );
}
