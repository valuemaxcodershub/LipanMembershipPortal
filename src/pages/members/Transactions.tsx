import { useState } from "react";
import { Button, Card, Label, TextInput, Select, Table } from "flowbite-react";
import { HiOutlineDownload } from "react-icons/hi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const transactions = [
  { id: 1, type: "Payment", amount: 50, date: "2025-04-01", status: "Completed" },
  { id: 2, type: "Refund", amount: 20, date: "2025-03-28", status: "Pending" },
  { id: 3, type: "Membership Fee", amount: 100, date: "2025-03-15", status: "Completed" },
];

const TransactionsPage = () => {
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredTransactions = filterStatus === "All"
    ? transactions
    : transactions.filter((tx) => tx.status === filterStatus);

  const exportCSV = () => {
    const csv = [
      ["ID", "Type", "Amount", "Date", "Status"],
      ...filteredTransactions.map(tx => [tx.id, tx.type, tx.amount, tx.date, tx.status]),
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Type", "Amount", "Date", "Status"]],
      body: filteredTransactions.map(tx => [tx.id, tx.type, tx.amount, tx.date, tx.status]),
    });
    doc.save("transactions.pdf");
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Transactions</h1>
        <div className="flex gap-3">
          <Button onClick={exportCSV} color="light" size="sm">
            <HiOutlineDownload className="mr-2" /> CSV
          </Button>
          <Button onClick={exportPDF} color="gray" size="sm">
            <HiOutlineDownload className="mr-2" /> PDF
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <Label htmlFor="status-filter">Filter by Status</Label>
        <Select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </Select>
      </div>

      <Card className="!overflow-hidden !overflow-x-auto !max-w-full">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredTransactions.map((tx) => (
              <Table.Row key={tx.id}>
                <Table.Cell>{tx.id}</Table.Cell>
                <Table.Cell>{tx.type}</Table.Cell>
                <Table.Cell>${tx.amount}</Table.Cell>
                <Table.Cell>{tx.date}</Table.Cell>
                <Table.Cell>{tx.status}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
};

export default TransactionsPage;
