import { Card, Button, Table, Modal } from "flowbite-react";
import {
  FiArrowLeft,
  FiFileText,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { useState } from "react";
import { Transaction } from "../../types/_all";
import TransactionReceiptModal from "../../components/UI/TransactionModal";

const transactions = [
  {
    id: "INV-20240401-001",
    date: "2024-04-01",
    time: "10:35 AM",
    amount: "$50",
    fee: "$2",
    total: "$52",
    paymentMethod: "Credit Card",
    recipient: "John Doe",
    status: "Success",
    authCode: "AUTH123456",
  },
  {
    id: "INV-20230401-002",
    date: "2023-04-01",
    time: "02:15 PM",
    amount: "$50",
    fee: "$1.5",
    total: "$51.5",
    paymentMethod: "Bank Transfer",
    recipient: "Jane Smith",
    status: "Success",
    authCode: "AUTH987654",
  },
];

const MyInvoicesPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [invoices, setInvoices] = useState<Transaction[]>(transactions);
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);

  

  const openInvoiceModal = (invoice: Transaction) => {
    setSelectedInvoice(invoice);
    setOpenModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Button
        color="light"
        className="flex items-center gap-2 mb-4"
        onClick={() => window.history.back()}
      >
        <FiArrowLeft /> Back to Dashboard
      </Button>

      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        My Invoices
      </h1>

      <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
          Invoice Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg shadow">
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
              Total Invoices
            </p>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </div>
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow">
            <p className="text-lg font-semibold text-green-700 dark:text-green-300">
              Paid
            </p>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </div>
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow">
            <p className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
              Pending
            </p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </Card>

      <h2 className="mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Transaction History
      </h2>
      <div className="overflow-hidden overflow-x-auto max-w-full">
        <Table className="mt-4">
          <Table.Head>
            <Table.HeadCell>Invoice No.</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Time</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {invoices.map((tx) => (
              <Table.Row key={tx.id} className="bg-white dark:bg-gray-800">
                <Table.Cell>{tx.id}</Table.Cell>
                <Table.Cell>{tx.date}</Table.Cell>
                <Table.Cell>{tx.time}</Table.Cell>
                <Table.Cell>{tx.amount}</Table.Cell>
                <Table.Cell>
                  {tx.status === "Success" ? (
                    <span className="text-green-600 flex items-center gap-2">
                      <FiCheckCircle /> {tx.status}
                    </span>
                  ) : (
                    <span className="text-yellow-600 flex items-center gap-2">
                      <FiClock /> Pending
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    color="blue"
                    size="xs"
                    onClick={() => openInvoiceModal(tx)}
                    className="flex items-center gap-2"
                  >
                    <FiFileText /> View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Invoice Receipt Modal */}
      <TransactionReceiptModal
        isOpen={openModal}
        transaction={selectedInvoice}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default MyInvoicesPage;
