import { useEffect, useState } from "react";
import { Button, Card, Table } from "flowbite-react";
import axios from "../../config/axios";
import { errorHandler } from "../../utils/api/errors";
import { formatDate } from "../../utils/app/time";
import TransactionReceiptModal from "../../components/UI/TransactionModal";
import { FiFileText } from "react-icons/fi";

type Transaction = {
  id: string;
  amount: string;
  created_at: string;
  description: string;
  payment_method: string;
  status: string;
  subscriber: number;
  total: string;
  transaction_id: string;
  transaction_ref: string;
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [filterStatus, setFilterStatus] = useState("All");
  const [isFetching, setIsFetching] = useState(true);

  const filteredTransactions =
    filterStatus === "All"
      ? transactions
      : transactions.filter((tx) => tx.status === filterStatus);

  const exportCSV = () => {
    const csv = [
      ["ID", "Type", "Amount", "Date", "Status"],
      ...filteredTransactions.map((tx) => [
        tx.transaction_id,
        tx.description,
        tx.amount,
        formatDate(tx.created_at),
        tx.status,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    link.click();
  };

  // const exportPDF = () => {
  //   const doc = new jsPDF();
  //   autoTable(doc, {
  //     head: [["ID", "Type", "Amount", "Date", "Status"]],
  //     body: filteredTransactions.map((tx) => [
  //       tx.transaction_id,
  //       tx.description,
  //       tx.amount,
  //       formatDate(tx.created_at),
  //       tx.status,
  //     ]),
  //   });
  //   doc.save("transactions.pdf");
  // };

  const fetchTransactions = async () => {
    setIsFetching(true);
    try {
      const { data } = await axios.get("/user/transactions/");
      console.log(data);
      setTransactions(data.results || []);
    } catch (err) {
      const errMsg = errorHandler(err);
      console.log(errMsg);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
          Transactions
        </h1>
        {/* <div className="flex gap-3">
          <Button onClick={exportCSV} color="light" size="sm">
            <HiOutlineDownload className="mr-2" /> CSV
          </Button>
          <Button onClick={exportPDF} color="gray" size="sm">
            <HiOutlineDownload className="mr-2" /> PDF
          </Button>
        </div> */}
      </div>

      {/* <div className="mb-4 flex items-center gap-4">
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
      </div> */}

      <Card className="!overflow-hidden !overflow-x-auto !max-w-full">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {isFetching ? (
              <Table.Row>
                <Table.Cell
                  colSpan={6}
                  className="bg-white text-center dark:bg-gray-800 border-b dark:border-gray-700 py-6"
                >
                  <div className="flex justify-center">
                    <div className="animate-spin size-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Loading transactions...
                  </p>
                </Table.Cell>
              </Table.Row>
            ) : !filteredTransactions.length ? (
              <Table.Row>
                <Table.Cell
                  colSpan={6}
                  className="bg-white text-center dark:bg-gray-800 border-b dark:border-gray-700 text-gray-500 py-6"
                >
                  No transactions found.
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredTransactions.map((tx) => (
                <Table.Row key={tx.transaction_id}>
                  <Table.Cell>{tx.transaction_id}</Table.Cell>
                  <Table.Cell>{tx.description}</Table.Cell>
                  <Table.Cell>₦ {tx.amount}</Table.Cell>
                  <Table.Cell>{formatDate(tx.created_at)}</Table.Cell>
                  <Table.Cell>{tx.status}</Table.Cell>
                  <Table.Cell>
                    <Button
                      color="blue"
                      size="xs"
                      onClick={() => setSelectedTransaction(tx)}
                      className="flex items-center gap-2"
                    >
                      <FiFileText className="mr-2 h-5" /> View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card>
      <TransactionReceiptModal
        isOpen={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default TransactionsPage;