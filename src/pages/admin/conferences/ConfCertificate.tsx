import { useState } from "react";
import { Button, Label, TextInput, Table, Spinner, Card } from "flowbite-react";
import { FaSearch, FaFilePdf } from "react-icons/fa";
import axios from "../../../config/axios";
import CertificatePreview from "../../../components/UI/ConfCertificate";

interface Participant {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  lipanId: string;
  organization: string;
  city: string;
  country: string;
}

export default function CertificateAdminPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selected, setSelected] = useState<Participant | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/participants/search?query=${query}`);
      setParticipants(res.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Certificate Generation
      </h1>

      {/* Search Form */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Label htmlFor="search" value="Search by Email or Lipan ID" />
          <TextInput
            id="search"
            type="text"
            placeholder="Enter Email or Lipan ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button color="blue" onClick={handleSearch} disabled={loading}>
          {loading ? <Spinner size="sm" /> : <FaSearch className="mr-2" />}
          Search
        </Button>
      </div>

      {/* Search Results */}
      {participants.length > 0 && (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Lipan ID</Table.HeadCell>
            <Table.HeadCell>Organization</Table.HeadCell>
            <Table.HeadCell>Country</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {participants.map((p) => (
              <Table.Row key={p.id}>
                <Table.Cell>
                  {p.title} {p.firstName} {p.lastName}
                </Table.Cell>
                <Table.Cell>{p.email}</Table.Cell>
                <Table.Cell>{p.lipanId}</Table.Cell>
                <Table.Cell>{p.organization}</Table.Cell>
                <Table.Cell>{p.country}</Table.Cell>
                <Table.Cell>
                  <Button
                    color="success"
                    size="xs"
                    onClick={() => setSelected(p)}
                  >
                    Select
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Selected Participant Details */}
      {selected && (
        <Card className="mt-6 shadow-lg border">
          <h2 className="text-xl font-semibold mb-3">Participant Details</h2>
          <div className="grid grid-cols-2 gap-y-2 text-gray-700">
            <p>
              <b>Name:</b> {selected.firstName} {selected.lastName}
            </p>
            <p>
              <b>Email:</b> {selected.email}
            </p>
            <p>
              <b>Lipan ID:</b> {selected.lipanId}
            </p>
            <p>
              <b>Organization:</b> {selected.organization}
            </p>
            <p>
              <b>Country:</b> {selected.country}
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <Button color="red" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button
              color="blue"
              className="ml-3 flex items-center"
              onClick={() => alert("Generate Certificate")}
            >
              <FaFilePdf className="mr-2" /> Generate Certificate
            </Button>
          </div>
        </Card>
      )}

      {/* Certificate Preview (Render only if selected) */}
      {selected && (
        <div className="mt-8">
          <CertificatePreview participant={selected} />
        </div>
      )}
    </div>
  );
}
