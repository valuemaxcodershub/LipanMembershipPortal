import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, TextInput, Pagination } from "flowbite-react";
import { FiTrash2, FiEye, FiPlus, FiSearch } from "react-icons/fi";
import axios from "../../../config/axios";
import AddParticipantModal from "../../../components/UI/AddParticipantModal";
import { toast } from "react-toastify";
import axiosMain from "axios";

const mockParticipants = [
  {
    id: "1",
    title: "Dr.",
    firstName: "Amara",
    lastName: "Okafor",
    organization: "University of Lagos",
    email: "amara.okafor@unilag.edu.ng",
    phone: "+2348012345678",
    country: "Nigeria",
    participationCategory: "Speaker",
    paymentTrxId: "PAY12345",
    lipanId: "LPN001",
  },
  {
    id: "2",
    title: "Mr.",
    firstName: "James",
    lastName: "Mugisha",
    organization: "Makerere University",
    email: "james.mugisha@mak.ac.ug",
    phone: "+256702345678",
    country: "Uganda",
    participationCategory: "Attendee",
    paymentTrxId: "PAY22341",
    lipanId: "LPN002",
  },
  {
    id: "3",
    title: "Prof.",
    firstName: "Sarah",
    lastName: "Mensah",
    organization: "University of Ghana",
    email: "s.mensah@ug.edu.gh",
    phone: "+233201234567",
    country: "Ghana",
    participationCategory: "Keynote Speaker",
    paymentTrxId: "PAY34589",
    lipanId: "LPN003",
  },
  {
    id: "4",
    title: "Mrs.",
    firstName: "Lerato",
    lastName: "Mokoena",
    organization: "University of Johannesburg",
    email: "lerato.mokoena@uj.ac.za",
    phone: "+27721234567",
    country: "South Africa",
    participationCategory: "Poster Presenter",
    paymentTrxId: "PAY45876",
    lipanId: "LPN004",
  },
  {
    id: "5",
    title: "Dr.",
    firstName: "David",
    lastName: "Ochieng",
    organization: "University of Nairobi",
    email: "david.ochieng@uonbi.ac.ke",
    phone: "+254701234567",
    country: "Kenya",
    participationCategory: "Virtual Participant",
    paymentTrxId: "PAY55679",
    lipanId: "LPN005",
  },
  {
    id: "6",
    title: "Ms.",
    firstName: "Emily",
    lastName: "Smith",
    organization: "University of Oxford",
    email: "emily.smith@ox.ac.uk",
    phone: "+447912345678",
    country: "United Kingdom",
    participationCategory: "Attendee",
    paymentTrxId: "PAY66890",
    lipanId: "LPN006",
  },
  {
    id: "7",
    title: "Dr.",
    firstName: "Hassan",
    lastName: "Abdullahi",
    organization: "Ahmadu Bello University",
    email: "hassan.abdullahi@abu.edu.ng",
    phone: "+2348034567890",
    country: "Nigeria",
    participationCategory: "Panelist",
    paymentTrxId: "PAY77823",
    lipanId: "LPN007",
  },
  {
    id: "8",
    title: "Prof.",
    firstName: "Grace",
    lastName: "Kambale",
    organization: "University of Kinshasa",
    email: "grace.kambale@unikin.cd",
    phone: "+243991234567",
    country: "DR Congo",
    participationCategory: "Keynote Speaker",
    paymentTrxId: "PAY88900",
    lipanId: "LPN008",
  },
];

interface Participant {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  phone: string;
  country: string;
  participationCategory: string;
  lipanId?: string;
}

export default function RegisteredParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // you can change this or make it dynamic
  const [open, setOpen] = useState(false);

  // Fetch participants
  const fetchParticipants = async (page = 1, query = "") => {
    try {
      setLoading(true);
      const res = await axios.get("/conference/participants/", {
        params: { page, search: query },
      });

      // Assuming your API returns { data: [...], totalPages: N }
      console.log(res.data);
      setParticipants(res.data.results || []);
      setTotalPages(res.data.total_pages || 1);
    } catch (error) {
      console.error("Failed to load participants", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants(currentPage, searchTerm);
  }, [currentPage]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // reset to first page
    fetchParticipants(1, searchTerm);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this participant?"))
      return;
    try {
      setBusyId(id);
      await axios.delete(`/conference/participants/${id}/`);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setBusyId(null);
    }
  };

  const handleAdd = async (formData: any) => {
    try {
      await axiosMain.post(
        `${import.meta.env.VITE_OTHER_API_URL}/api/conference`,
        formData
      );
      toast.success("New Participant added successfully");
      fetchParticipants();
    } catch (err) {
      toast.error("Ooops, there was an error, pls try again");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Registered Participants
      </h1>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <TextInput
            icon={FiSearch}
            placeholder="Search by name, email, or LiPAN ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 md:w-80"
          />
          <Button type="submit" color="blue">
            Search
          </Button>
        </form>

        {/* Add button */}
        <Button
          onClick={() => setOpen(true)}
          color="success"
          size="sm"
          className="flex items-center gap-2"
        >
          <FiPlus className="text-lg" />
          Add Participant
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <Table hoverable={true} className="min-w-full text-sm">
          <Table.Head>
            <Table.HeadCell>Title / Position</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Organization</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Country</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={9}>
                  <div className="flex justify-center py-10">
                    <Spinner size="lg" />
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : participants.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={9}>
                  <div className="p-10 text-center text-gray-500">
                    No participants found.
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              participants.map((p) => (
                <Table.Row
                  key={p.id}
                  className="bg-white hover:bg-gray-50 transition-all"
                >
                  <Table.Cell className="font-medium text-gray-900">
                    {p.title || "N/A"}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900">
                    {p.title ? `${p.title} ` : ""}
                    {p.firstName} {p.lastName}
                  </Table.Cell>
                  <Table.Cell>{p.organization || "N/A"}</Table.Cell>
                  <Table.Cell>{p.email || "N/A"}</Table.Cell>
                  <Table.Cell>{p.phone || "N/A"}</Table.Cell>
                  <Table.Cell>{p.country || "N/A"}</Table.Cell>
                  <Table.Cell>{p.participationCategory || "N/A"}</Table.Cell>
                  <Table.Cell>
                    {!p.lipanId
                      ? "Non-Member"
                      : p.lipanId === "teacher"
                      ? "Teacher"
                      : "Member"}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-3">
                      {/* <Button
                        color="light"
                        size="xs"
                        className="flex items-center gap-1 text-blue-600"
                      >
                        <FiEye />
                      </Button> */}
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => handleDelete(p.id)}
                        disabled={busyId === p.id}
                        className="flex items-center gap-1"
                      >
                        {busyId === p.id ? <Spinner size="sm" /> : <FiTrash2 />}
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-6">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
          />
        )}
      </div>

      <AddParticipantModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
}
