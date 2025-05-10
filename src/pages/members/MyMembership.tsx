import { Card, Button, Table, Tooltip, Progress } from "flowbite-react";
import { FiArrowUpRight, FiClock, FiCheckCircle, FiInfo } from "react-icons/fi";
import { usePayment } from "../../hooks/payment";
import { motion } from "framer-motion";
import { PageMeta } from "../../utils/app/pageMetaValues";

const MyMembershipPage = () => {
  const { openPaymentModal } = usePayment();

  // Sample Membership Data (Replace with API data)
  const membership = {
    type: "Regular Member",
    status: "Active", // Can be "Expired" or "Pending"
    expiryDate: "2025-04-02",
    progress: 75, // Membership validity progress
    benefits: [
      "Conference attendance",
      "Community engagement",
      "Research collaboration",
      "Access to publications",
    ],
  };

  const transactions = [
    { id: 1, date: "2024-04-01", amount: "$50", status: "Success" },
    { id: 2, date: "2023-04-01", amount: "$50", status: "Success" },
  ];

  return (
    <>
      <PageMeta>
        <title>My Membership | LIPAN</title>
        <meta
          name="description"
          content="View and manage your membership details and transaction history."
        />
      </PageMeta>
      <div className="mx-auto dark:bg-gray-900 dark:text-gray-200">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          My Membership
        </h1>

        <Card className="p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Membership Type
              </h2>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {membership.type}
              </p>
            </div>
            <div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  membership.status === "Active"
                    ? "bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300"
                    : "bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300"
                }`}
              >
                {membership.status}
              </span>
            </div>
          </div>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Expiry Date: {membership.expiryDate}
          </p>

          {/* Progress Tracker */}
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Membership Progress
            </p>
            <Progress
              progress={membership.progress}
              color="blue"
              size="lg"
              className="dark:bg-gray-700"
            />
          </div>

          {/* Membership Benefits */}
          <h3 className="mt-6 text-lg font-medium">Membership Benefits</h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4 mt-4"
          >
            {membership.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <FiCheckCircle className="text-green-500 dark:text-green-300" />
                <p>{benefit}</p>
                <Tooltip content="More info" placement="top">
                  <FiInfo className="text-gray-400 dark:text-gray-500 cursor-pointer" />
                </Tooltip>
              </div>
            ))}
          </motion.div>

          <div className="mt-6 flex gap-4">
            <Button
              color="blue"
              onClick={openPaymentModal}
              className="flex items-center gap-2"
            >
              Renew Membership <FiArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Transaction History */}
        <h2 className="mt-10 text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Transaction History
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here are your recent transactions related to your membership.
        </p>
        <div className="overflow-hidden overflow-x-auto max-w-full">
          <Table className="mt-4">
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y dark:divide-gray-700">
              {transactions.map((tx) => (
                <Table.Row key={tx.id} className="bg-white dark:bg-gray-800">
                  <Table.Cell>{tx.date}</Table.Cell>
                  <Table.Cell>{tx.amount}</Table.Cell>
                  <Table.Cell>
                    {tx.status === "Success" ? (
                      <span className="text-green-600 dark:text-green-300 flex items-center gap-2">
                        <FiCheckCircle /> {tx.status}
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-300 flex items-center gap-2">
                        <FiClock /> Pending
                      </span>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
};

export default MyMembershipPage;
