import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Select, Table, TextInput } from "flowbite-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import { Skeleton } from "../../components/UI/Skeleton";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { errorHandler } from "../../utils/api/errors";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { HiSearch } from "react-icons/hi";

type Participant = {
  id: number;
  conferenceId?: string;
  conference_reg_id?: string;
  title?: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  organization?: string;
  participationCategory?: string;
  participation_category?: string;
  registrationFee?: string;
  registration_fee?: string;
  paymentStatus?: string;
  payment_status?: string;
  lipanId?: string;
  lipan_id?: string;
  created_at?: string;
};

const YEAR_PAGES = [2025, 2026] as const;

function conferenceIdOf(p: Participant) {
  return (p.conferenceId || p.conference_reg_id || "").trim();
}

function normalizeParticipant(row: any): Participant {
  return {
    ...row,
    conferenceId: conferenceIdOf(row),
    firstName: row.firstName || row.first_name,
    lastName: row.lastName || row.last_name,
    participationCategory: row.participationCategory || row.participation_category,
    registrationFee: row.registrationFee || row.registration_fee,
    paymentStatus: row.paymentStatus || row.payment_status,
    lipanId: row.lipanId || row.lipan_id,
  };
}

function feeTypeLabel(fee?: string) {
  const value = (fee || "").toLowerCase();
  if (value.includes("non-member") || value.includes("non member")) return "Non-Member";
  if (value.includes("member")) return "Member";
  if (value.includes("student")) return "Student";
  if (value.includes("international")) return "International";
  return fee || "—";
}

export default function ConferenceParticipantsPage() {
  const navigate = useNavigate();
  const { year: yearParam } = useParams();
  const year = Number(yearParam) === 2025 ? 2025 : 2026;

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<Participant | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadParticipants = async () => {
    try {
      setRefreshing(true);
      const { data } = await axios.get("/conference/participants/", {
        params: {
          conference_year: year,
          search: search || undefined,
          payment_status: paymentStatus || undefined,
        },
      });
      const rows = Array.isArray(data) ? data : data?.results || [];
      setParticipants(rows.map(normalizeParticipant));
    } catch (err) {
      toast.error(errorHandler(err) || "Failed to load conference participants");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (yearParam && yearParam !== "2025" && yearParam !== "2026") {
      navigate("/admin/conference/participants/2026", { replace: true });
      return;
    }
    setSearch("");
    setPaymentStatus("");
    setLoading(true);
    loadParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  useEffect(() => {
    if (!loading) loadParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentStatus]);

  const paidCount = useMemo(
    () => participants.filter((p) => (p.paymentStatus || "").toLowerCase() === "paid").length,
    [participants]
  );

  const deleteParticipant = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`/conference/participants/${deleting.id}/`);
      toast.success("Participant removed");
      setDeleting(null);
      await loadParticipants();
    } catch (err) {
      toast.error(errorHandler(err) || "Could not delete participant");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Conference
          </p>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
            Registered Participants
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {year} Biennial Conference registrants
          </p>
        </div>

        <div className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
          {YEAR_PAGES.map((y) => (
            <Link
              key={y}
              to={`/admin/conference/participants/${y}`}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                year === y
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="!shadow-sm">
          <p className="text-xs uppercase text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {participants.length}
          </p>
        </Card>
        <Card className="!shadow-sm">
          <p className="text-xs uppercase text-gray-500">Paid</p>
          <p className="text-2xl font-bold text-green-600">{paidCount}</p>
        </Card>
        <Card className="!shadow-sm">
          <p className="text-xs uppercase text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">
            {participants.length - paidCount}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden !shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <TextInput
              icon={HiSearch}
              placeholder="Search by name, email, phone, Conference ID, or LiPAN ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") loadParticipants();
              }}
            />
          </div>
          <div className="w-full lg:w-48">
            <Select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="">All payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadParticipants} isProcessing={refreshing}>
              <HiSearch className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button color="light" onClick={loadParticipants} isProcessing={refreshing}>
              <FiRefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-48 w-full" />
        ) : participants.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              No {year} participants yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Registrations for this conference year will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl ring-1 ring-gray-100 dark:ring-gray-700">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Conference ID</Table.HeadCell>
                <Table.HeadCell>Title / Position</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Organization</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Phone</Table.HeadCell>
                <Table.HeadCell>Country</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Type</Table.HeadCell>
                <Table.HeadCell>Payment</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {participants.map((p) => (
                  <Table.Row key={p.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-mono text-sm font-bold tracking-wider text-blue-700 dark:text-blue-400">
                      {conferenceIdOf(p) || "—"}
                    </Table.Cell>
                    <Table.Cell className="capitalize">{p.title || "—"}</Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {p.firstName} {p.lastName}
                    </Table.Cell>
                    <Table.Cell>{p.organization || "—"}</Table.Cell>
                    <Table.Cell>{p.email || "—"}</Table.Cell>
                    <Table.Cell className="whitespace-nowrap">{p.phone || "—"}</Table.Cell>
                    <Table.Cell>{p.country || "—"}</Table.Cell>
                    <Table.Cell>{p.participationCategory || "—"}</Table.Cell>
                    <Table.Cell>{feeTypeLabel(p.registrationFee)}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        color={
                          p.paymentStatus === "paid"
                            ? "success"
                            : p.paymentStatus === "failed"
                              ? "failure"
                              : "warning"
                        }
                      >
                        {p.paymentStatus || "pending"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        type="button"
                        onClick={() => setDeleting(p)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                        aria-label="Delete participant"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </Card>

      <ConfirmationModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={deleteParticipant}
        loading={deleteLoading}
        theme="failure"
        title="Delete participant?"
        message={
          deleting
            ? `Remove ${deleting.firstName || ""} ${deleting.lastName || ""} from the ${year} conference list?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
